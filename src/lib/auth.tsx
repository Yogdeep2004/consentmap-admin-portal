import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "./types";

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "consent-map-auth";

// Pre-seeded demo accounts
const DEMO_ACCOUNTS: Record<string, { name: string; role: UserRole }> = {
  "admin@example.com": { name: "Admin User", role: "admin" },
  "user@example.com": { name: "Demo User", role: "user" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, role: UserRole, name?: string) => {
    // Check if it's a demo account
    const demoAccount = DEMO_ACCOUNTS[email.toLowerCase()];
    
    const newUser: User = {
      email: email.toLowerCase(),
      name: name || demoAccount?.name || email.split("@")[0],
      role: demoAccount?.role || role,
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { DEMO_ACCOUNTS };
