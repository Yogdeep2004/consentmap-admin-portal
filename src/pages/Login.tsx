import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/auth";
import { UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    // Check if it's a demo account
    const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()];
    const finalRole = demoAccount?.role || role;

    login(email, finalRole);
    toast({
      title: "Welcome!",
      description: `Signed in as ${finalRole === "admin" ? "Admin" : "User"}`,
    });
    navigate("/dashboard");
  };

  const handleDemoLogin = (demoEmail: string) => {
    const account = DEMO_ACCOUNTS[demoEmail];
    if (account) {
      setEmail(demoEmail);
      setRole(account.role);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedShaderBackground />
      
      {/* Login Card */}
      <div className="relative bg-card/90 backdrop-blur-lg w-full max-w-md p-8 rounded-xl shadow-2xl z-10 flex flex-col gap-6 border border-border/50 animate-scale-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">ConsentMap</h1>
          <p className="text-xs text-muted-foreground mt-2">
            ConsentMap is not intended for collecting sensitive data in production
          </p>
        </div>

        {/* Demo Account Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => handleDemoLogin("admin@example.com")}
          >
            Demo Admin
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => handleDemoLogin("user@example.com")}
          >
            Demo User
          </Button>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Role Selector */}
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">Sign in as</Label>
            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as UserRole)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="role-user" />
                <Label htmlFor="role-user" className="font-normal cursor-pointer">User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="role-admin" />
                <Label htmlFor="role-admin" className="font-normal cursor-pointer">Admin</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground">
              {role === "admin" ? "Full access: Add, Edit, Upload, Delete" : "Limited access: Add, Upload only"}
            </p>
          </div>

          <Button type="submit" className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="#" className="text-primary hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
