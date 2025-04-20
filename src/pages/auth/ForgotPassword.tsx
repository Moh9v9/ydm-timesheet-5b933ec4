
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Password reset instructions sent to your email.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send password reset email.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img 
              src="https://i.ibb.co/DPfXmyDz/YDM-logo2-2.png" 
              alt="YDM Logo" 
              className="h-16 w-auto mx-auto"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">
              Reset your password
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email to receive password reset instructions
            </p>
          </div>
          
          <div className="mt-8">
            <div className="bg-card shadow-md rounded-lg px-6 py-8">
              {isSubmitted ? (
                <div className="text-center space-y-4">
                  <svg
                    className="h-12 w-12 text-green-500 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent password reset instructions to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    (This is a demo app, no actual email will be sent)
                  </p>
                  <div className="pt-4">
                    <Link
                      to="/login"
                      className="text-primary hover:text-primary/80"
                    >
                      Back to login
                    </Link>
                  </div>
                </div>
              ) : (
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
                                 placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                               text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 
                               focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send reset instructions"}
                    </button>
                  </div>

                  <div className="text-center">
                    <Link to="/login" className="text-sm text-primary hover:text-primary/80">
                      Back to login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPassword;
