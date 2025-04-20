
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";  // Using only Sonner toast
import MainLayout from "@/components/layout/MainLayout";
import { Moon, Sun } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      // Show success message and automatically redirect after a short delay
      toast.success("Login successful! Redirecting to dashboard...");
      
      // Automatically redirect after a short delay (1.5 seconds)
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Login failed. Please check your credentials.";
      
      // Use only Sonner toast for login errors
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="absolute top-4 right-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </button>
          </div>
          
          <div className="text-center mt-10">
            <img 
              src="https://i.ibb.co/DPfXmyDz/YDM-logo2-2.png" 
              alt="YDM Logo" 
              className="h-16 w-auto mx-auto mb-4"
            />
            <h2 className="text-3xl font-extrabold text-foreground mb-2">
              YDM TimeSheet
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Manage employee attendance and timesheets
            </p>
            
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Sign In
            </h3>
          </div>
          
          <div>
            <div className="bg-card shadow-md rounded-lg px-6 py-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm 
                               placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary 
                               text-foreground bg-background dark:text-white dark:bg-gray-800"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm 
                               placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary 
                               text-foreground bg-background dark:text-white dark:bg-gray-800"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                             text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 
                             focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
