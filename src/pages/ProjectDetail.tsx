import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useProjects } from "@/lib/projects";
import { useAuth } from "@/lib/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { AddPersonModal } from "@/components/ui/add-person-modal";
import { AddImagesModal } from "@/components/ui/add-images-modal";
import { AddDataModal } from "@/components/ui/add-data-modal";
import { EditProjectModal } from "@/components/ui/edit-project-modal";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Upload,
  Edit,
  Trash2,
  UserPlus,
  ImagePlus,
  Database,
  Users,
  Image,
  FileText,
  MoreVertical,
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateProject, deleteProject, addPerson, addImage, addDataEntry, addEvent, clearEvents, deletePerson, deleteImage, deleteDataEntry } = useProjects();
  const { user } = useAuth();
  const { canEdit, canDelete } = usePermissions();
  const { toast } = useToast();

  const project = getProject(id || "");

  // Modal states
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [addImagesOpen, setAddImagesOpen] = useState(false);
  const [addDataOpen, setAddDataOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "person" | "image" | "data"; id: string } | null>(null);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleAddPerson = (data: { name: string; pid?: string; notes?: string; consentFiles: string[] }) => {
    addPerson(project.id, {
      ...data,
      addedBy: user?.email || "unknown",
    });
    addEvent(project.id, {
      type: "person_added",
      user: user?.email || "unknown",
      description: `Added ${data.name}`,
    });
  };

  const handleAddImages = (images: { name: string; size: number }[]) => {
    images.forEach((img) => {
      addImage(project.id, {
        name: img.name,
        size: img.size,
        uploadedBy: user?.email || "unknown",
      });
      addEvent(project.id, {
        type: "image_uploaded",
        user: user?.email || "unknown",
        description: `Uploaded ${img.name}`,
      });
    });
  };

  const handleAddData = (data: { key: string; value: string }) => {
    addDataEntry(project.id, {
      ...data,
      addedBy: user?.email || "unknown",
    });
    addEvent(project.id, {
      type: "data_added",
      user: user?.email || "unknown",
      description: `Added ${data.key}: ${data.value}`,
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

    if (itemToDelete.type === "person") {
      const person = project.persons.find((p) => p.id === itemToDelete.id);
      deletePerson(project.id, itemToDelete.id);
      addEvent(project.id, {
        type: "deleted",
        user: user?.email || "unknown",
        description: `Deleted person: ${person?.name}`,
      });
    } else if (itemToDelete.type === "image") {
      const image = project.images.find((i) => i.id === itemToDelete.id);
      deleteImage(project.id, itemToDelete.id);
      addEvent(project.id, {
        type: "deleted",
        user: user?.email || "unknown",
        description: `Deleted image: ${image?.name}`,
      });
    } else {
      const entry = project.dataEntries.find((e) => e.id === itemToDelete.id);
      deleteDataEntry(project.id, itemToDelete.id);
      addEvent(project.id, {
        type: "deleted",
        user: user?.email || "unknown",
        description: `Deleted data: ${entry?.key}`,
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

  return (
    <div className="space-y-6">
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
              <DropdownMenuItem onClick={() => setAddPersonOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Person
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddImagesOpen(true)}>
                <ImagePlus className="h-4 w-4 mr-2" />
                Add Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddDataOpen(true)}>
                <Database className="h-4 w-4 mr-2" />
                Add Data
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

      {/* Progress Card */}
      <Card>
        <CardContent className="pt-6">
          <ProjectProgress project={project} />
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Persons Panel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Persons ({project.persons.length})
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setAddPersonOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {project.persons.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No persons added yet</p>
                ) : (
                  project.persons.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="text-sm font-medium">{person.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {person.pid && `${person.pid} • `}
                          {person.consentFiles.length > 0 ? "Consent ✓" : "No consent"}
                        </p>
                      </div>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setItemToDelete({ type: "person", id: person.id })}
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

        {/* Images Panel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Image className="h-4 w-4" />
              Images ({project.images.length})
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setAddImagesOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {project.images.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No images uploaded yet</p>
                ) : (
                  project.images.map((image) => (
                    <div key={image.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="text-sm font-medium truncate max-w-[180px]">{image.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(image.size / 1024).toFixed(1)} KB • {formatDistanceToNow(image.timestamp, { addSuffix: true })}
                        </p>
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

        {/* Timeline Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectTimeline events={project.events} onClearHistory={handleClearHistory} />
          </CardContent>
        </Card>
      </div>

      {/* Data Entries */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Data Entries ({project.dataEntries.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setAddDataOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {project.dataEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No data entries yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {project.dataEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-xs text-muted-foreground">{entry.key}</p>
                    <p className="text-sm font-medium">{entry.value}</p>
                  </div>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setItemToDelete({ type: "data", id: entry.id })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddPersonModal open={addPersonOpen} onOpenChange={setAddPersonOpen} onSubmit={handleAddPerson} />
      <AddImagesModal open={addImagesOpen} onOpenChange={setAddImagesOpen} onSubmit={handleAddImages} />
      <AddDataModal open={addDataOpen} onOpenChange={setAddDataOpen} onSubmit={handleAddData} />
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
