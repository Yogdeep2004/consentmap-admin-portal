import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useProjects } from "@/lib/projects";
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
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateProject, deleteProject, addPerson, updatePerson, addImage, addEvent, clearEvents, deletePerson, deleteImage } = useProjects();
  const { user } = useAuth();
  const { canEdit, canDelete, canEditConsent } = usePermissions();
  const { toast } = useToast();

  const project = getProject(id || "");

  // Modal states
  const [addConsentOpen, setAddConsentOpen] = useState(false);
  const [addImagesOpen, setAddImagesOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "image" | "data"; id: string } | null>(null);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleAddConsent = (data: { name: string; consentFiles: string[]; consentMatched: boolean }) => {
    addPerson(project.id, {
      ...data,
      addedBy: user?.email || "unknown",
    });
    addEvent(project.id, {
      type: "person_added",
      user: user?.email || "unknown",
      description: `Added consent for ${data.name}`,
    });
  };

  const handleEditPerson = (personId: string, data: Partial<typeof project.persons[0]>) => {
    updatePerson(project.id, personId, data);
    addEvent(project.id, {
      type: "edited",
      user: user?.email || "unknown",
      description: `Updated consent status`,
    });
  };

  const handleAddImages = (images: { name: string; size: number; factor?: string; batchNumber?: string }[]) => {
    images.forEach((img) => {
      addImage(project.id, {
        name: img.name,
        size: img.size,
        uploadedBy: user?.email || "unknown",
        factor: img.factor,
        batchNumber: img.batchNumber,
      });
      addEvent(project.id, {
        type: "image_uploaded",
        user: user?.email || "unknown",
        description: `Uploaded ${img.name}${img.factor ? ` (${img.factor})` : ""}`,
      });
    });
  };

  const handleEditProject = (data: Partial<typeof project>) => {
    updateProject(project.id, data);
    addEvent(project.id, {
      type: "edited",
      user: user?.email || "unknown",
      description: "Updated project details",
    });
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    toast({ title: "Project deleted" });
    navigate("/dashboard");
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === "image") {
      const image = project.images.find((i) => i.id === itemToDelete.id);
      deleteImage(project.id, itemToDelete.id);
      addEvent(project.id, {
        type: "deleted",
        user: user?.email || "unknown",
        description: `Deleted image: ${image?.name}`,
      });
    }

    setItemToDelete(null);
    toast({ title: "Item deleted" });
  };

  const handleClearHistory = () => {
    clearEvents(project.id);
    toast({ title: "History cleared" });
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

  const allImages = [...project.images, ...(project.groupImages || [])];

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
            Created by: {project.createdBy || project.owner}
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
            <ProjectProgress project={project} />
          </CardContent>
        </Card>
        <ProjectStatusPanel persons={project.persons} images={allImages} />
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

        {/* Consent Excel Table Tab */}
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
                persons={project.persons}
                images={allImages}
                onEditPerson={canEditConsent ? handleEditPerson : undefined}
                onAddImage={() => setAddImagesOpen(true)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unique Images Tab */}
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
                consentForms={project.consentForms}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
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
      <EditProjectModal open={editProjectOpen} onOpenChange={setEditProjectOpen} project={project} onSubmit={handleEditProject} />

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
