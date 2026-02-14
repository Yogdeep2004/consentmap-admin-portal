import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useProjectQuery, useDeleteProject } from "@/hooks/use-projects-query";
import { useAuth } from "@/lib/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ProjectProgress } from "@/components/ui/project-progress";
import { ProjectTimeline } from "@/components/ui/project-timeline";
import { ProjectStatusPanel } from "@/components/ui/project-status-panel";
import { ConsentExcelTable } from "@/components/ui/consent-excel-table";
import { UniqueImagesTable } from "@/components/ui/unique-images-table";
import { AddConsentModal } from "@/components/ui/add-consent-modal";
import { AddImagesModal } from "@/components/ui/add-images-modal";
import { EditProjectModal } from "@/components/ui/edit-project-modal";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ImagePlus,
  FileText,
  Image,
  Table,
  Images,
  Loader2,
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProjectQuery(id || "");
  const deleteProjectMutation = useDeleteProject();
  const { user } = useAuth();
  const { canEdit, canDelete, canEditConsent } = usePermissions();
  const { toast } = useToast();

  // Modal states
  const [addConsentOpen, setAddConsentOpen] = useState(false);
  const [addImagesOpen, setAddImagesOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "image" | "data"; id: string } | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  // Safe access to arrays
  const images = project.images ?? [];
  const groupImages = project.groupImages ?? [];
  const consentForms = project.consentForms ?? [];
  const persons = project.persons ?? [];
  const dataEntries = project.dataEntries ?? [];
  const events = project.events ?? [];
  const allImages = [...images, ...groupImages];

  const handleAddConsent = (data: { name: string; consentFiles: string[]; consentMatched: boolean }) => {
    // TODO: Replace with API call when backend supports it
    toast({ title: "Consent added (API integration pending)" });
  };

  const handleAddImages = (imagesData: { name: string; size: number; factor?: string; batchNumber?: string; url?: string }[]) => {
    // TODO: Replace with API call when backend supports it
    toast({ title: "Images added (API integration pending)" });
  };

  const handleEditProject = (data: any) => {
    // TODO: Replace with API call when backend supports it
    toast({ title: "Project updated (API integration pending)" });
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      toast({ title: "Project deleted" });
      navigate("/dashboard");
    } catch {
      toast({ title: "Failed to delete project", variant: "destructive" });
    }
  };

  const handleDeleteItem = () => {
    // TODO: Replace with API call when backend supports it
    setItemToDelete(null);
    toast({ title: "Item deleted (API integration pending)" });
  };

  const handleClearHistory = () => {
    // TODO: Replace with API call when backend supports it
    toast({ title: "History cleared (API integration pending)" });
  };

  const handleEditPerson = (personId: string, data: any) => {
    // TODO: Replace with API call when backend supports it
    toast({ title: "Person updated (API integration pending)" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/30";
      case "completed":
        return "bg-primary/10 text-primary border-primary/30";
      case "on-hold":
        return "bg-warning/10 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge variant="outline" className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground ml-12">{project.description}</p>
          )}
          <p className="text-sm text-muted-foreground ml-12">
            Created by: {project.createdBy || project.owner || "Unknown"}
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setAddConsentOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                Add Consent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddImagesOpen(true)}>
                <ImagePlus className="h-4 w-4 mr-2" />
                Add Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {canEdit ? (
            <Button variant="outline" onClick={() => setEditProjectOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" disabled>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </TooltipTrigger>
              <TooltipContent>Admins can edit or delete</TooltipContent>
            </Tooltip>
          )}

          {canDelete && (
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Status and Progress Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <ProjectProgress project={project as any} />
          </CardContent>
        </Card>
        <ProjectStatusPanel persons={persons} images={allImages} />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="consent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consent" className="gap-2">
            <Table className="h-4 w-4" />
            Consent Table
          </TabsTrigger>
          <TabsTrigger value="unique-images" className="gap-2">
            <Images className="h-4 w-4" />
            Unique Images
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consent">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Consent Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConsentExcelTable
                persons={persons}
                images={allImages}
                onEditPerson={canEditConsent ? handleEditPerson : undefined}
                onAddImage={() => setAddImagesOpen(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unique-images">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Images className="h-5 w-5" />
                Unique Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UniqueImagesTable
                images={allImages}
                consentForms={consentForms}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Image className="h-4 w-4" />
                All Images ({allImages.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setAddImagesOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {allImages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No images uploaded yet</p>
                  ) : (
                    allImages.map((image) => (
                      <div key={image.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          {image.url ? (
                            <img src={image.url} alt={image.name} className="h-10 w-10 rounded object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                              <Image className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium truncate max-w-[180px]">{image.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {image.factor && `${image.factor} • `}
                              {image.batchNumber && `Batch: ${image.batchNumber} • `}
                              {formatDistanceToNow(image.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setItemToDelete({ type: "image", id: image.id })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddConsentModal open={addConsentOpen} onOpenChange={setAddConsentOpen} onSubmit={handleAddConsent} />
      <AddImagesModal open={addImagesOpen} onOpenChange={setAddImagesOpen} onSubmit={handleAddImages} />
      <EditProjectModal open={editProjectOpen} onOpenChange={setEditProjectOpen} project={project as any} onSubmit={handleEditProject} />

      {/* Delete Project Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{project.name}" and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Item Dialog */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetail;
