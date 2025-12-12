// User & Auth Types
export type UserRole = "admin" | "user";

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

// Project Types
export interface ImageFile {
  id: string;
  name: string;
  size: number;
  uploadedBy: string;
  timestamp: number;
}

export interface Person {
  id: string;
  name: string;
  pid?: string;
  consentFiles: string[]; // Store file names, not File objects for localStorage
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
  estimatedImageCount: number;
  status: "active" | "completed" | "on-hold";
  images: ImageFile[];
  persons: Person[];
  dataEntries: DataEntry[];
  events: ProjectEvent[];
  createdAt: number;
  updatedAt: number;
}
