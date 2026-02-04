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
  Table,
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateProject, deleteProject, addPerson, updatePerson, addImage, addGroupImage, addDataEntry, addEvent, clearEvents, deletePerson, deleteImage, deleteGroupImage, deleteDataEntry } = useProjects();
  const { user } = useAuth();
  const { canEdit, canDelete, canEditConsent } = usePermissions();
  const { toast } = useToast();

  const project = getProject(id || "");

  // Modal states
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [addImagesOpen, setAddImagesOpen] = useState(false);
  const [addDataOpen, setAddDataOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "person" | "image" | "groupImage" | "data"; id: string } | null>(null);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
      </div>
    );
  }

  const handleAddPerson = (data: { name: string; pid?: string; notes?: string; consentFiles: string[]; consentMatched: boolean }) => {
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

  const handleEditPerson = (personId: string, data: Partial<typeof project.persons[0]>) => {
    updatePerson(project.id, personId, data);
    addEvent(project.id, {
      type: "edited",
      user: user?.email || "unknown",
      description: `Updated consent status`,
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
    } else if (itemToDelete.type === "groupImage") {
      const image = project.groupImages.find((i) => i.id === itemToDelete.id);
      deleteGroupImage(project.id, itemToDelete.id);
      addEvent(project.id, {
        type: "deleted",
        user: user?.email || "unknown",
        description: `Deleted group image: ${image?.name}`,
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

      {/* Status and Progress Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <ProjectProgress project={project} />
          </CardContent>
        </Card>
        <ProjectStatusPanel persons={project.persons} />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="consent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consent" className="gap-2">
            <Table className="h-4 w-4" />
            Consent Table
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-2">
            <Users className="h-4 w-4" />
            Overview
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
                onEditPerson={canEditConsent ? handleEditPerson : undefined}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview">
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
                              {person.consentMatched ? "✓ Matched" : "✗ Not matched"}
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

            {/* Data Entries Panel */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Data ({project.dataEntries.length})
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setAddDataOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {project.dataEntries.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No data entries yet</p>
                    ) : (
                      project.dataEntries.map((entry) => (
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
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Single Person Images */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Photos ({project.images.length})
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
                                {(image.size / 1024).toFixed(1)} KB • {formatDistanceToNow(image.timestamp, { addSuffix: true })}
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

            {/* Group Images */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Group Photos ({project.groupImages.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {project.groupImages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No group photos uploaded yet</p>
                    ) : (
                      project.groupImages.map((image) => (
                        <div key={image.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            {image.url ? (
                              <img src={image.url} alt={image.name} className="h-10 w-10 rounded object-cover" />
                            ) : (
                              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium truncate max-w-[180px]">{image.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(image.size / 1024).toFixed(1)} KB • {formatDistanceToNow(image.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          {canDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setItemToDelete({ type: "groupImage", id: image.id })}
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
          </div>
        </TabsContent>
      </Tabs>

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
              Are you sure you want to delete this {itemToDelete?.type === "groupImage" ? "group image" : itemToDelete?.type}? This action cannot be undone.
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
