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
  const { login, signup, user } = useAuth();
  const { toast } = useToast();
  
  // Form mode
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  
  // Sign-up only fields
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    const result = signup(name, email, password, role);
    
    if (!result.success) {
      toast({
        title: "Error",
        description: result.error || "Failed to create account",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account created!",
      description: `Welcome, ${name}! Signed in as ${role === "admin" ? "Admin" : "User"}`,
    });
    navigate("/dashboard");
  };

  const handleDemoLogin = (demoEmail: string) => {
    const account = DEMO_ACCOUNTS[demoEmail];
    if (account) {
      setEmail(demoEmail);
      setRole(account.role);
      setIsSignUp(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Reset form
    setName("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedShaderBackground />
      
      {/* Login/SignUp Card */}
      <div className="relative bg-card/90 backdrop-blur-lg w-full max-w-md p-8 rounded-xl shadow-2xl z-10 flex flex-col gap-6 border border-border/50 animate-scale-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">ConsentMap</h1>
          <p className="text-xs text-muted-foreground mt-2">
            ConsentMap is not intended for collecting sensitive data in production
          </p>
        </div>

        {/* Demo Account Buttons - Only show on login */}
        {!isSignUp && (
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
        )}

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-4">
          {/* Name field - Sign up only */}
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50"
              />
            </div>
          )}

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

          {/* Confirm Password - Sign up only */}
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50"
              />
            </div>
          )}

          {/* Role Selector */}
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">{isSignUp ? "Register as" : "Sign in as"}</Label>
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
              {role === "admin" 
                ? "Full access: Add, Edit, Upload, Delete" 
                : "Limited access: Add, Upload only"
              }
            </p>
            {isSignUp && (
              <p className="text-xs text-warning mt-1">
                ⚠️ Demo only - In production, role selection requires admin approval
              </p>
            )}
          </div>

          <Button type="submit" className="w-full mt-2">
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            type="button"
            onClick={toggleMode}
            className="text-primary hover:underline font-medium"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
