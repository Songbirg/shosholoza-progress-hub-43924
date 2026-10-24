import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";

interface AdminAuthProps {
  children: React.ReactNode;
}

const ADMIN_EMAIL = "excel6963@gmail.com";
const ADMIN_PASSWORD = "Banele@123321";

const AdminAuth = ({ children }: AdminAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already authenticated in session storage
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple authentication check
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
    } else {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-yellow-400 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4">
                <Lock className="w-8 h-8 text-red-900" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Admin Login
              </h1>
              <p className="text-gray-400">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-yellow-400" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-12 bg-white/10 border-yellow-400/30 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-400" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-12 bg-white/10 border-yellow-400/30 text-white placeholder:text-gray-500"
                />
              </div>

              {error && (
                <div className="bg-red-600/20 border border-red-600 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-red-900 font-bold"
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full text-gray-400 hover:text-white"
              >
                Back to Home
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="bg-slate-800/90 border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-red-900"
        >
          <Lock className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
      {children}
    </>
  );
};

export default AdminAuth;
