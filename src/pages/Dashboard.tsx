import React, { useState } from "react";
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

const mockProjects = [
  {
    id: 1,
    title: "Event Photography 2024",
    description: "Annual company event photography with consent tracking for all attendees",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    status: "Completed" as const,
    progress: 100,
    images: 1250,
    tagged: 1250,
    consents: 89,
    piiTypes: ["Face", "Document"],
    createdDate: "15/01/2024",
    lastActivity: "20/01/2024",
    personInCharge: "John Doe",
  },
  {
    id: 2,
    title: "Corporate Headshots Q1",
    description: "Professional headshots for company directory and marketing materials",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    status: "In Progress" as const,
    progress: 70,
    images: 500,
    tagged: 350,
    consents: 45,
    piiTypes: ["Face"],
    createdDate: "10/01/2024",
    lastActivity: "25/01/2024",
    personInCharge: "Jane Smith",
  },
  {
    id: 3,
    title: "Conference Documentation",
    description: "Tech conference with speakers and attendee documentation requiring consent management",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop",
    status: "Pending" as const,
    progress: 100,
    images: 800,
    tagged: 800,
    consents: 62,
    piiTypes: ["Face", "Document", "Biometric"],
    createdDate: "08/01/2024",
    lastActivity: "23/01/2024",
    personInCharge: "Mike Johnson",
  },
  {
    id: 4,
    title: "Training Workshop Series",
    description: "Internal training sessions documentation for HR compliance and records",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    status: "In Progress" as const,
    progress: 45,
    images: 320,
    tagged: 144,
    consents: 28,
    piiTypes: ["Face", "Document"],
    createdDate: "05/01/2024",
    lastActivity: "22/01/2024",
    personInCharge: "Sarah Wilson",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status.toLowerCase().replace(" ", "-") === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => navigate("/create-project")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
