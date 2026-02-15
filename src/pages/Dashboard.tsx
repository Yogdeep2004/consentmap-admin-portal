import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectCard from "@/components/projects/ProjectCard";

/**
 * This type matches EXACTLY what your backend returns
 * from GET /api/v1/projects
 */
interface ProjectSummary {
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

const Dashboard = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/projects");

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const result = await response.json();

      // Defensive check
      if (!result?.data || !Array.isArray(result.data)) {
        throw new Error("Invalid API response format");
      }

      setProjects(result.data);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="p-8">Loading projects...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading projects: {error}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Manage consent mapping and privacy compliance across your image datasets
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => navigate("/create-project")}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={{
              ...project,
              // ensure safe defaults so ProjectCard does not crash
              persons: [],
              dataEntries: [],
            }}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No projects found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
