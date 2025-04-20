
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
        JSON.stringify({ error: "Server configuration error", details: "Missing Supabase credentials" }),
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
        JSON.stringify({ error: "Unauthorized", details: "No authorization header provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify that the requesting user is authenticated
    const token = authHeader.replace('Bearer ', '');
    console.log(`Authenticating with token starting with: ${token.substring(0, 10)}...`);
    
    const { data: { user: caller }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: `Authentication failed: ${authError.message}` }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!caller) {
      console.error("No caller user found");
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Caller authenticated:", caller.id);
    
    // Check if the caller is an admin by querying the profiles table
    const { data: callerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, permissions')
      .eq('id', caller.id)
      .single();
      
    if (profileError) {
      console.error("Profile error:", profileError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to verify permissions", 
          details: `Could not retrieve caller's profile: ${profileError.message}` 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Caller profile:", callerProfile);
    
    if (!callerProfile) {
      console.error("No caller profile found");
      return new Response(
        JSON.stringify({ error: "Forbidden", details: "User profile not found" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (callerProfile.role !== 'admin') {
      console.error("Caller is not admin:", callerProfile.role);
      return new Response(
        JSON.stringify({ error: "Forbidden", details: "Only admins can create users" }),
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
        JSON.stringify({ error: "Bad Request", details: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { fullName, email, password, role, permissions } = userData;
    
    console.log("User data received:", { fullName, email, role });
    
    if (!fullName || !email || !password) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ 
          error: "Bad Request", 
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
        JSON.stringify({ error: "Bad Request", details: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Validate password length
    if (password.length < 6) {
      console.error("Password too short");
      return new Response(
        JSON.stringify({ error: "Bad Request", details: "Password must be at least 6 characters long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user with email already exists
    const { data: existingUsers, error: existingUserError } = await supabase.auth.admin.listUsers({});
      
    if (existingUserError) {
      console.error("Error checking for existing user:", existingUserError);
      return new Response(
        JSON.stringify({ 
          error: "Internal Server Error", 
          details: `Failed to check for existing user: ${existingUserError.message}` 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Check if user exists by email
    const emailExists = existingUsers?.users?.some(user => user.email === email);
    if (emailExists) {
      console.error("User with email already exists:", email);
      return new Response(
        JSON.stringify({ error: "Conflict", details: "A user with this email already exists" }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      const userMetadata = {
        full_name: fullName,  // For backwards compatibility
        fullName: fullName,   // For newer code
        role: userRole,
        permissions: userPermissions
      };
      
      console.log("User metadata:", JSON.stringify(userMetadata));
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: userMetadata
      });
      
      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(
          JSON.stringify({ 
            error: "Creation Failed", 
            details: `Failed to create user: ${createError.message}` 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (!newUser || !newUser.user) {
        console.error("No user created or returned");
        return new Response(
          JSON.stringify({ error: "Creation Failed", details: "Failed to create user: No user data returned" }),
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
        
        // Manually insert into profiles if the trigger didn't work
        if (profileFetchError.code === 'PGRST116') { // Record not found
          console.log("Profile not found, creating manually");
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: newUser.user.id,
              full_name: fullName,
              email: email,
              role: userRole,
              permissions: userPermissions
            });
            
          if (insertError) {
            console.error("Error inserting profile:", insertError);
          } else {
            console.log("Manually created profile for user");
          }
        }
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
    } catch (createUserError: any) {
      console.error("Error in createUser:", createUserError);
      return new Response(
        JSON.stringify({ 
          error: "Creation Failed",
          details: createUserError.message || "Unknown error during user creation"
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message || "Unknown server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
})
