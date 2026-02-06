import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useProjects } from "@/lib/projects";
import { useAuth } from "@/lib/auth";

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const { user } = useAuth();
  
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [imageCount, setImageCount] = useState("");
  const [cameraTypes, setCameraTypes] = useState<string[]>([]);
  const [createdByUsername, setCreatedByUsername] = useState(user?.name || "");
  const [piiTypes, setPiiTypes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const handleCameraTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setCameraTypes([...cameraTypes, type]);
    } else {
      setCameraTypes(cameraTypes.filter((t) => t !== type));
    }
  };

  const handlePiiTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPiiTypes([...piiTypes, type]);
    } else {
      setPiiTypes(piiTypes.filter((t) => t !== type));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    if (!createdByUsername.trim()) {
      toast({
        title: "Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    if (piiTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one PII type",
        variant: "destructive",
      });
      return;
    }

    const newProject = createProject({
      name: projectName.trim(),
      description: description.trim() || notes.trim() || undefined,
      owner: user?.email || "unknown",
      createdBy: createdByUsername.trim(),
      estimatedImageCount: parseInt(imageCount) || 0,
      cameraTypes,
      status: "active",
    });

    toast({
      title: "Success",
      description: "Project created successfully!",
    });
    
    navigate(`/project/${newProject.id}`);
  };

  const cameraTypeOptions = [
    { id: "dslr", label: "DSLR" },
    { id: "mobile", label: "Mobile Phone" },
  ];

  const piiTypeOptions = [
    { id: "face", label: "Face" },
    { id: "objects", label: "Objects" },
    { id: "document", label: "Document" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new privacy compliance project with consent management
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">
                  Project Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Event Photography 2024"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  placeholder="Your name"
                  value={createdByUsername}
                  onChange={(e) => setCreatedByUsername(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Person creating this project</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="image-count">Target Count (Estimated Images)</Label>
                <Input
                  id="image-count"
                  type="number"
                  placeholder="e.g., 1000"
                  value={imageCount}
                  onChange={(e) => setImageCount(e.target.value)}
                />
              </div>

              {/* Type of Camera */}
              <div className="space-y-3">
                <Label>Type of Camera</Label>
                <div className="flex flex-wrap gap-6">
                  {cameraTypeOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`camera-${option.id}`}
                        checked={cameraTypes.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleCameraTypeChange(option.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`camera-${option.id}`} className="font-normal cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Project description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* PII Types */}
            <div className="space-y-3">
              <Label>
                PII Types <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-wrap gap-6">
                {piiTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={piiTypes.includes(option.id)}
                      onCheckedChange={(checked) =>
                        handlePiiTypeChange(option.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={option.id} className="font-normal cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional project notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" size="lg" className="gap-2">
            Create Project
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
