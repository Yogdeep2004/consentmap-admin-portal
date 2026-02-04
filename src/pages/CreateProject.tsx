import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Users, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FileUpload } from "@/components/ui/file-upload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useProjects } from "@/lib/projects";
import { useAuth } from "@/lib/auth";
import { ImageFile } from "@/lib/types";

const CreateProject = () => {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const { user } = useAuth();
  
  // Basic Info
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [imageCount, setImageCount] = useState("");
  const [projectInCharge, setProjectInCharge] = useState("");
  const [createdByUsername, setCreatedByUsername] = useState(user?.name || "");
  const [piiTypes, setPiiTypes] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  // File sections
  const [photos, setPhotos] = useState<File[]>([]);
  const [groupPhotos, setGroupPhotos] = useState<File[]>([]);
  const [consentForms, setConsentForms] = useState<File[]>([]);

  const handlePiiTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPiiTypes([...piiTypes, type]);
    } else {
      setPiiTypes(piiTypes.filter((t) => t !== type));
    }
  };

  const handlePhotosChange = useCallback((files: File[]) => {
    setPhotos(files);
  }, []);

  const handleGroupPhotosChange = useCallback((files: File[]) => {
    setGroupPhotos(files);
  }, []);

  const handleConsentFormsChange = useCallback((files: File[]) => {
    setConsentForms(files);
  }, []);

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const removeGroupPhoto = (index: number) => {
    setGroupPhotos(groupPhotos.filter((_, i) => i !== index));
  };

  const removeConsentForm = (index: number) => {
    setConsentForms(consentForms.filter((_, i) => i !== index));
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

    // Convert files to ImageFile format for storage
    // NOTE: In production, files should be uploaded to backend storage
    const photoImages: Omit<ImageFile, "id" | "timestamp">[] = photos.map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file), // Demo only - use backend storage in production
      uploadedBy: user?.email || "unknown",
    }));

    const groupPhotoImages: Omit<ImageFile, "id" | "timestamp">[] = groupPhotos.map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedBy: user?.email || "unknown",
    }));

    const consentFormFiles: Omit<ImageFile, "id" | "timestamp">[] = consentForms.map((file) => ({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedBy: user?.email || "unknown",
    }));

    const newProject = createProject({
      name: projectName.trim(),
      description: description.trim() || notes.trim() || undefined,
      owner: user?.email || "unknown",
      createdBy: createdByUsername.trim(),
      estimatedImageCount: parseInt(imageCount) || 0,
      status: "active",
      images: photoImages.map((img, i) => ({ ...img, id: `img-${i}`, timestamp: Date.now() })),
      groupImages: groupPhotoImages.map((img, i) => ({ ...img, id: `gimg-${i}`, timestamp: Date.now() })),
      consentForms: consentFormFiles.map((file, i) => ({ ...file, id: `cf-${i}`, timestamp: Date.now() })),
    });

    toast({
      title: "Success",
      description: "Project created successfully!",
    });
    
    navigate(`/project/${newProject.id}`);
  };

  const teamMembers = [
    { id: "john-doe", name: "John Doe" },
    { id: "jane-smith", name: "Jane Smith" },
    { id: "mike-johnson", name: "Mike Johnson" },
  ];

  const piiTypeOptions = [
    { id: "face", label: "Face" },
    { id: "biometric", label: "Biometric" },
    { id: "document", label: "Document" },
    { id: "other", label: "Other" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new privacy compliance project with consent management
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
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

              {/* Project In-charge */}
              <div className="space-y-3">
                <Label>Project In-charge</Label>
                <RadioGroup
                  value={projectInCharge}
                  onValueChange={setProjectInCharge}
                  className="flex flex-wrap gap-3"
                >
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={member.id} id={member.id} />
                      <Label htmlFor={member.id} className="font-normal cursor-pointer">
                        {member.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Description */}
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

            {/* Notes */}
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

        {/* Photos Section - Single Person */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Photos (Single Person)
            </CardTitle>
            <CardDescription>
              Upload individual person photos for consent tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload onChange={handlePhotosChange} />
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <Image className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate mt-1">{file.name}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group Photos Section */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Group Photos (Multi-Person)
            </CardTitle>
            <CardDescription>
              Upload group photos containing multiple individuals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload onChange={handleGroupPhotosChange} />
            {groupPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {groupPhotos.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-xs text-muted-foreground truncate mt-1">{file.name}</p>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeGroupPhoto(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consent Forms Section */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Consent Forms (PDF / Excel)
            </CardTitle>
            <CardDescription>
              Upload consent form templates or completed consent documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload onChange={handleConsentFormsChange} />
            {consentForms.length > 0 && (
              <div className="space-y-2">
                {consentForms.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg group">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-[300px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={() => removeConsentForm(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
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
