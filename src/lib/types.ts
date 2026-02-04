// User & Auth Types
export type UserRole = "admin" | "user";

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

// Auth Event Types (for login history tracking)
export interface AuthEvent {
  id: string;
  userEmail: string;
  userName: string;
  role: UserRole;
  timestamp: number;
  type: "login" | "logout" | "signup";
}

// Registered User (for signup persistence)
export interface RegisteredUser {
  name: string;
  email: string;
  password: string; // NOTE: In production, passwords must be hashed and stored server-side
  role: UserRole;
  createdAt: number;
}

// Project Types
export interface ImageFile {
  id: string;
  name: string;
  size: number;
  url?: string; // Object URL for preview (demo only - production should use backend storage)
  uploadedBy: string;
  timestamp: number;
}

export interface Person {
  id: string;
  name: string;
  pid?: string;
  consentFiles: string[]; // Store file names, not File objects for localStorage
  consentMatched: boolean; // Whether consent is verified/matched
  notes?: string;
  addedBy: string;
  timestamp: number;
}

export interface DataEntry {
  id: string;
  key: string;
  value: string;
  addedBy: string;
  timestamp: number;
}

export interface ProjectEvent {
  id: string;
  type: "created" | "person_added" | "image_uploaded" | "data_added" | "edited" | "deleted";
  user: string;
  timestamp: number;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner: string;
  createdBy: string; // Username of the person who created the project
  estimatedImageCount: number;
  status: "active" | "completed" | "on-hold";
  images: ImageFile[]; // Single-person photos
  groupImages: ImageFile[]; // Multi-person/group photos
  consentForms: ImageFile[]; // Consent form PDFs/Excel files
  persons: Person[];
  dataEntries: DataEntry[];
  events: ProjectEvent[];
  createdAt: number;
  updatedAt: number;
}
