import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegistering ? "/auth/register" : "/auth/login";
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Use AuthContext login instead of manually setting localStorage
      login(data.token, data.user);
      
      // Redirect to dashboard
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary text-white flex items-center justify-center font-display font-bold text-4xl shadow-ambient">
          S
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-bold text-on-background">
          StockWise
        </h2>
        <p className="mt-2 text-center text-sm text-on-surface-variant font-body-md">
          {isRegistering ? "Create a new account" : "Sign in to your account"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-ambient rounded-xl sm:px-10 border border-surface-variant">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-label-caps font-bold text-on-surface"
              >
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
                  className="appearance-none block w-full px-3 py-2 border border-surface-variant rounded-lg shadow-sm placeholder-outline focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-on-surface"
                  placeholder="admin@stockwise.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-label-caps font-bold text-on-surface"
              >
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
                  className="appearance-none block w-full px-3 py-2 border border-surface-variant rounded-lg shadow-sm placeholder-outline focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-surface text-on-surface"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
              >
                {loading ? "Please wait..." : (isRegistering ? "Register" : "Sign in")}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-primary hover:underline"
              >
                {isRegistering ? "Already have an account? Sign in" : "Need an account? Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
