import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole, AuthEvent, RegisteredUser } from "./types";

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole, name?: string) => void;
  signup: (name: string, email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
  getAuthEvents: () => AuthEvent[];
  clearAuthEvents: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "consent-map-auth";
const AUTH_EVENTS_KEY = "consentmap:auth-events";
const USERS_STORAGE_KEY = "consentmap:users";

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Pre-seeded demo accounts
const DEMO_ACCOUNTS: Record<string, { name: string; role: UserRole; password: string }> = {
  "admin@example.com": { name: "Admin User", role: "admin", password: "admin123" },
  "user@example.com": { name: "Demo User", role: "user", password: "user123" },
  "collab@example.com": { name: "Collaborator User", role: "collaborator", password: "collab123" },
};

// Helper to get auth events from localStorage
const getStoredAuthEvents = (): AuthEvent[] => {
  try {
    const stored = localStorage.getItem(AUTH_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save auth events to localStorage
const saveAuthEvents = (events: AuthEvent[]) => {
  localStorage.setItem(AUTH_EVENTS_KEY, JSON.stringify(events));
};

// Helper to add an auth event
const addAuthEvent = (event: Omit<AuthEvent, "id" | "timestamp">) => {
  const events = getStoredAuthEvents();
  const newEvent: AuthEvent = {
    ...event,
    id: generateId(),
    timestamp: Date.now(),
  };
  events.unshift(newEvent); // Add to beginning for descending order
  saveAuthEvents(events);
};

// Helper to get registered users
const getRegisteredUsers = (): RegisteredUser[] => {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save registered users
const saveRegisteredUsers = (users: RegisteredUser[]) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
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
    const normalizedEmail = email.toLowerCase();
    
    // Check if it's a demo account
    const demoAccount = DEMO_ACCOUNTS[normalizedEmail];
    
    // Check if it's a registered user
    const registeredUsers = getRegisteredUsers();
    const registeredUser = registeredUsers.find(u => u.email === normalizedEmail);
    
    const finalRole = demoAccount?.role || registeredUser?.role || role;
    const finalName = name || demoAccount?.name || registeredUser?.name || email.split("@")[0];

    const newUser: User = {
      email: normalizedEmail,
      name: finalName,
      role: finalRole,
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

    // Record login event
    addAuthEvent({
      userEmail: newUser.email,
      userName: newUser.name,
      role: newUser.role,
      type: "login",
    });
  };

  const signup = (name: string, email: string, password: string, role: UserRole): { success: boolean; error?: string } => {
    const normalizedEmail = email.toLowerCase();
    
    // Check if email already exists in demo accounts
    if (DEMO_ACCOUNTS[normalizedEmail]) {
      return { success: false, error: "This email is already registered (demo account)" };
    }
    
    // Check if email already exists in registered users
    const registeredUsers = getRegisteredUsers();
    if (registeredUsers.some(u => u.email === normalizedEmail)) {
      return { success: false, error: "This email is already registered" };
    }

    // Create new registered user
    // NOTE: In production, passwords must be hashed and this should be done server-side
    const newRegisteredUser: RegisteredUser = {
      name,
      email: normalizedEmail,
      password, // WARNING: Storing plain text for demo only!
      role,
      createdAt: Date.now(),
    };

    registeredUsers.push(newRegisteredUser);
    saveRegisteredUsers(registeredUsers);

    // Record signup event
    addAuthEvent({
      userEmail: normalizedEmail,
      userName: name,
      role,
      type: "signup",
    });

    // Auto-login the new user
    const newUser: User = {
      email: normalizedEmail,
      name,
      role,
    };

    setUser(newUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));

    // Also record login event after signup
    addAuthEvent({
      userEmail: newUser.email,
      userName: newUser.name,
      role: newUser.role,
      type: "login",
    });

    return { success: true };
  };

  const logout = () => {
    // Record logout event before clearing user
    if (user) {
      addAuthEvent({
        userEmail: user.email,
        userName: user.name,
        role: user.role,
        type: "logout",
      });
    }

    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const getAuthEvents = (): AuthEvent[] => {
    return getStoredAuthEvents();
  };

  const clearAuthEvents = () => {
    localStorage.removeItem(AUTH_EVENTS_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, getAuthEvents, clearAuthEvents }}>
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
