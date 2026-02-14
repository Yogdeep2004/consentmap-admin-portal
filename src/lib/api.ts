export const API_BASE = "http://localhost:8000/api/v1";

// === Types ===

export interface ProjectSummary {
  id: string;
  name: string;
  createdBy?: string;
  description?: string;
  estimatedImageCount?: number;
  status: string;
  cameraTypes?: string[];
  piiTypes?: string[];
  createdAt?: string;
}

export interface ProjectDetail extends ProjectSummary {
  images?: import("./types").ImageFile[];
  groupImages?: import("./types").ImageFile[];
  consentForms?: import("./types").ImageFile[];
  persons?: import("./types").Person[];
  dataEntries?: import("./types").DataEntry[];
  events?: import("./types").ProjectEvent[];
  updatedAt?: string | number;
  owner?: string;
}

export interface CreateProjectPayload {
  name: string;
  username: string;
  target_image_count: number;
  description?: string;
  notes?: string;
  camera_dslr: boolean;
  camera_mobile: boolean;
  pii_face: boolean;
  pii_objects: boolean;
  pii_document: boolean;
  pii_other: boolean;
  status?: string;
}

// === API Functions ===

export async function getProjects(): Promise<ProjectSummary[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  const json = await res.json();
  return json.data;
}

export async function getProject(id: string): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  const json = await res.json();
  return json.data;
}

export async function createProject(payload: CreateProjectPayload): Promise<ProjectDetail> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create project");
  const json = await res.json();
  return json.data;
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete project");
}
