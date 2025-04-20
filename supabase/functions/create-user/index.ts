
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }
  
  try {
    console.log("Create user function called");
    
    // Create Supabase client with service role key (has admin privileges)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase URL or service key");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Using Supabase URL: ${supabaseUrl}`);
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Only allow authenticated users to call this function
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized - No auth header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify that the requesting user is authenticated
    const token = authHeader.replace('Bearer ', '');
    console.log(`Authenticating with token starting with: ${token.substring(0, 10)}...`);
    
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !caller) {
      console.error("Auth error or no caller user:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token", details: authError?.message }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Caller authenticated:", caller.id);
    
    // Check if the caller is an admin by querying the profiles table
    const { data: callerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single();
      
    if (profileError) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to verify permissions", details: profileError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!callerProfile || callerProfile.role !== 'admin') {
      console.error("Caller is not admin:", callerProfile);
      return new Response(
        JSON.stringify({ error: "Forbidden: Only admins can create users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Admin permissions verified");
    
    // Get user data from request body
    let userData;
    try {
      userData = await req.json();
      console.log("Received user data:", JSON.stringify(userData));
    } catch (jsonError) {
      console.error("Error parsing request body:", jsonError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { fullName, email, password, role, permissions } = userData;
    
    console.log("User data received:", { fullName, email, role });
    
    if (!fullName || !email || !password) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields", 
          details: {
            fullName: !fullName ? "Full name is required" : undefined,
            email: !email ? "Email is required" : undefined,
            password: !password ? "Password is required" : undefined,
          }
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user with email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (existingUserError) {
      console.error("Error checking for existing user:", existingUserError);
    }
    
    if (existingUser) {
      console.error("User with email already exists:", email);
      return new Response(
        JSON.stringify({ error: "A user with this email already exists" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Set default role if not provided
    const userRole = role || 'user';
    
    // Set default permissions if not provided and role is not admin
    let userPermissions = permissions;
    if (userRole === 'admin') {
      userPermissions = {
        employees: {
          view: true,
          edit: true,
          delete: true
        },
        attendees: {
          view: true,
          edit: true
        },
        export: true
      };
    } else if (!userPermissions) {
      userPermissions = {
        employees: {
          view: true,
          edit: false,
          delete: false
        },
        attendees: {
          view: false,
          edit: false
        },
        export: false
      };
    }
    
    // Create the user with admin API
    console.log("Creating user with admin API...");
    try {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          fullName: fullName,
          role: userRole,
          permissions: userPermissions
        }
      });
      
      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (!newUser || !newUser.user) {
        console.error("No user created or returned");
        return new Response(
          JSON.stringify({ error: "Failed to create user" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log("User created successfully:", newUser.user.id);
      
      // Verify the user was created by checking the profiles table
      const { data: profile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', newUser.user.id)
        .single();
        
      if (profileFetchError) {
        console.error("Error fetching new user profile:", profileFetchError);
      } else {
        console.log("New user profile created:", profile);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          user: {
            id: newUser.user.id,
            email: newUser.user.email,
            fullName: fullName,
            role: userRole,
            permissions: userPermissions
          } 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (createUserError) {
      console.error("Error in createUser:", createUserError);
      return new Response(
        JSON.stringify({ 
          error: "Error creating user",
          details: createUserError.message || "Unknown error"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
})
