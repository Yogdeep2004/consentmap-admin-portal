import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Project, Person, ImageFile, DataEntry, ProjectEvent } from "./types";

interface ProjectsContextType {
  projects: Project[];
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addPerson: (projectId: string, person: Omit<Person, "id" | "timestamp">) => void;
  updatePerson: (projectId: string, personId: string, data: Partial<Person>) => void;
  addImage: (projectId: string, image: Omit<ImageFile, "id" | "timestamp">) => void;
  addGroupImage: (projectId: string, image: Omit<ImageFile, "id" | "timestamp">) => void;
  addConsentForm: (projectId: string, file: Omit<ImageFile, "id" | "timestamp">) => void;
  addDataEntry: (projectId: string, entry: Omit<DataEntry, "id" | "timestamp">) => void;
  addEvent: (projectId: string, event: Omit<ProjectEvent, "id" | "timestamp">) => void;
  clearEvents: (projectId: string) => void;
  deletePerson: (projectId: string, personId: string) => void;
  deleteImage: (projectId: string, imageId: string) => void;
  deleteGroupImage: (projectId: string, imageId: string) => void;
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
    name: "test project - 1",
    description: "Test project for consent mapping",
    owner: "admin@example.com",
    createdBy: "Admin User",
    estimatedImageCount: 50,
    status: "active",
    images: [],
    groupImages: [],
    consentForms: [],
    persons: [],
    dataEntries: [],
    events: [
      { id: "evt-1", type: "created", user: "admin@example.com", timestamp: Date.now() - 172800000, description: "Project created" },
    ],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 43200000,
  },
];

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (stored) {
        setProjects(JSON.parse(stored));
      } else {
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
      createdBy: data.createdBy || "unknown",
      estimatedImageCount: data.estimatedImageCount || 0,
      status: data.status || "active",
      images: data.images || [],
      groupImages: data.groupImages || [],
      consentForms: data.consentForms || [],
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

  const updatePerson = (projectId: string, personId: string, data: Partial<Person>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              persons: p.persons.map((per) =>
                per.id === personId ? { ...per, ...data } : per
              ),
              updatedAt: Date.now(),
            }
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

  const addGroupImage = (projectId: string, image: Omit<ImageFile, "id" | "timestamp">) => {
    const newImage: ImageFile = {
      ...image,
      id: generateId(),
      timestamp: Date.now(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, groupImages: [...p.groupImages, newImage], updatedAt: Date.now() }
          : p
      )
    );
  };

  const addConsentForm = (projectId: string, file: Omit<ImageFile, "id" | "timestamp">) => {
    const newFile: ImageFile = {
      ...file,
      id: generateId(),
      timestamp: Date.now(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, consentForms: [...p.consentForms, newFile], updatedAt: Date.now() }
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

  const deleteGroupImage = (projectId: string, imageId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, groupImages: p.groupImages.filter((img) => img.id !== imageId), updatedAt: Date.now() }
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
        updatePerson,
        addImage,
        addGroupImage,
        addConsentForm,
        addDataEntry,
        addEvent,
        clearEvents,
        deletePerson,
        deleteImage,
        deleteGroupImage,
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
