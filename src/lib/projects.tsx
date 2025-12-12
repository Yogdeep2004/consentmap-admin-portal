import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, Person, ImageFile, DataEntry, ProjectEvent } from "./types";

interface ProjectsContextType {
  projects: Project[];
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addPerson: (projectId: string, person: Omit<Person, "id" | "timestamp">) => void;
  addImage: (projectId: string, image: Omit<ImageFile, "id" | "timestamp">) => void;
  addDataEntry: (projectId: string, entry: Omit<DataEntry, "id" | "timestamp">) => void;
  addEvent: (projectId: string, event: Omit<ProjectEvent, "id" | "timestamp">) => void;
  clearEvents: (projectId: string) => void;
  deletePerson: (projectId: string, personId: string) => void;
  deleteImage: (projectId: string, imageId: string) => void;
  deleteDataEntry: (projectId: string, entryId: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const PROJECTS_STORAGE_KEY = "consent-map-projects";

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Pre-seeded demo projects
const createDemoProjects = (): Project[] => [
  {
    id: "proj-1",
    name: "Marketing Campaign 2024",
    description: "Consent collection for Q1 marketing materials",
    owner: "admin@example.com",
    estimatedImageCount: 50,
    status: "active",
    images: [
      { id: "img-1", name: "hero-banner.jpg", size: 245000, uploadedBy: "admin@example.com", timestamp: Date.now() - 86400000 },
      { id: "img-2", name: "product-shot.png", size: 180000, uploadedBy: "user@example.com", timestamp: Date.now() - 43200000 },
    ],
    persons: [
      { id: "per-1", name: "John Doe", pid: "PID-001", consentFiles: ["consent-john.pdf"], notes: "Full consent granted", addedBy: "admin@example.com", timestamp: Date.now() - 86400000 },
      { id: "per-2", name: "Jane Smith", pid: "PID-002", consentFiles: ["consent-jane.pdf"], addedBy: "user@example.com", timestamp: Date.now() - 43200000 },
    ],
    dataEntries: [
      { id: "data-1", key: "Campaign Type", value: "Digital", addedBy: "admin@example.com", timestamp: Date.now() - 86400000 },
    ],
    events: [
      { id: "evt-1", type: "created", user: "admin@example.com", timestamp: Date.now() - 172800000, description: "Project created" },
      { id: "evt-2", type: "person_added", user: "admin@example.com", timestamp: Date.now() - 86400000, description: "Added John Doe" },
      { id: "evt-3", type: "image_uploaded", user: "admin@example.com", timestamp: Date.now() - 86400000, description: "Uploaded hero-banner.jpg" },
      { id: "evt-4", type: "person_added", user: "user@example.com", timestamp: Date.now() - 43200000, description: "Added Jane Smith" },
    ],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 43200000,
  },
  {
    id: "proj-2",
    name: "Product Launch Event",
    description: "Photo consent for annual product launch",
    owner: "user@example.com",
    estimatedImageCount: 100,
    status: "active",
    images: [],
    persons: [
      { id: "per-3", name: "Bob Wilson", consentFiles: [], addedBy: "user@example.com", timestamp: Date.now() - 3600000 },
    ],
    dataEntries: [],
    events: [
      { id: "evt-5", type: "created", user: "user@example.com", timestamp: Date.now() - 86400000, description: "Project created" },
      { id: "evt-6", type: "person_added", user: "user@example.com", timestamp: Date.now() - 3600000, description: "Added Bob Wilson" },
    ],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: "proj-3",
    name: "Annual Report 2023",
    description: "Employee photo consents for annual report",
    owner: "admin@example.com",
    estimatedImageCount: 30,
    status: "completed",
    images: [
      { id: "img-3", name: "team-photo.jpg", size: 520000, uploadedBy: "admin@example.com", timestamp: Date.now() - 604800000 },
    ],
    persons: [
      { id: "per-4", name: "Alice Brown", pid: "EMP-101", consentFiles: ["consent-alice.pdf"], addedBy: "admin@example.com", timestamp: Date.now() - 604800000 },
    ],
    dataEntries: [
      { id: "data-2", key: "Department", value: "Engineering", addedBy: "admin@example.com", timestamp: Date.now() - 604800000 },
    ],
    events: [
      { id: "evt-7", type: "created", user: "admin@example.com", timestamp: Date.now() - 1209600000, description: "Project created" },
    ],
    createdAt: Date.now() - 1209600000,
    updatedAt: Date.now() - 604800000,
  },
];

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      } else {
        // Initialize with demo projects
        const demoProjects = createDemoProjects();
        setProjects(demoProjects);
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(demoProjects));
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      const demoProjects = createDemoProjects();
      setProjects(demoProjects);
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  const createProject = (data: Partial<Project>): Project => {
    const newProject: Project = {
      id: generateId(),
      name: data.name || "Untitled Project",
      description: data.description,
      owner: data.owner || "unknown",
      estimatedImageCount: data.estimatedImageCount || 0,
      status: data.status || "active",
      images: [],
      persons: [],
      dataEntries: [],
      events: [{
        id: generateId(),
        type: "created",
        user: data.owner || "unknown",
        timestamp: Date.now(),
        description: "Project created",
      }],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id: string, data: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, updatedAt: Date.now() } : p
      )
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const addPerson = (projectId: string, person: Omit<Person, "id" | "timestamp">) => {
    const newPerson: Person = {
      ...person,
      id: generateId(),
      timestamp: Date.now(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, persons: [...p.persons, newPerson], updatedAt: Date.now() }
          : p
      )
    );
  };

  const addImage = (projectId: string, image: Omit<ImageFile, "id" | "timestamp">) => {
    const newImage: ImageFile = {
      ...image,
      id: generateId(),
      timestamp: Date.now(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, images: [...p.images, newImage], updatedAt: Date.now() }
          : p
      )
    );
  };

  const addDataEntry = (projectId: string, entry: Omit<DataEntry, "id" | "timestamp">) => {
    const newEntry: DataEntry = {
      ...entry,
      id: generateId(),
      timestamp: Date.now(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, dataEntries: [...p.dataEntries, newEntry], updatedAt: Date.now() }
          : p
      )
    );
  };

  const addEvent = (projectId: string, event: Omit<ProjectEvent, "id" | "timestamp">) => {
    const newEvent: ProjectEvent = {
      ...event,
      id: generateId(),
      timestamp: Date.now(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, events: [...p.events, newEvent] }
          : p
      )
    );
  };

  const clearEvents = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, events: [] } : p
      )
    );
  };

  const deletePerson = (projectId: string, personId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, persons: p.persons.filter((per) => per.id !== personId), updatedAt: Date.now() }
          : p
      )
    );
  };

  const deleteImage = (projectId: string, imageId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, images: p.images.filter((img) => img.id !== imageId), updatedAt: Date.now() }
          : p
      )
    );
  };

  const deleteDataEntry = (projectId: string, entryId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, dataEntries: p.dataEntries.filter((e) => e.id !== entryId), updatedAt: Date.now() }
          : p
      )
    );
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        createProject,
        updateProject,
        deleteProject,
        getProject,
        addPerson,
        addImage,
        addDataEntry,
        addEvent,
        clearEvents,
        deletePerson,
        deleteImage,
        deleteDataEntry,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
