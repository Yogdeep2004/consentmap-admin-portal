import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
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

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              className="bg-background/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="bg-background/50"
            />
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
