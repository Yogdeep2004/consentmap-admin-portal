import React from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Image, Users, FileCheck, Edit, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { usePermissions } from "@/hooks/use-permissions";
import { useDeleteProject } from "@/hooks/use-projects-query";
import { useToast } from "@/hooks/use-toast";
import { ProjectSummary } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: ProjectSummary;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { canEdit, canDelete } = usePermissions();
  const deleteProjectMutation = useDeleteProject();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const getStatusColor = () => {
    switch (project.status) {
      case "completed":
        return "bg-success/10 text-success";
      case "active":
        return "bg-primary/10 text-primary";
      case "on-hold":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusDot = () => {
    switch (project.status) {
      case "completed":
        return "bg-success";
      case "active":
        return "bg-primary";
      case "on-hold":
        return "bg-warning";
      default:
        return "bg-muted-foreground";
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id);
      toast({ title: "Project deleted" });
    } catch {
      toast({ title: "Failed to delete project", variant: "destructive" });
    }
    setDeleteDialogOpen(false);
  };

  const handleCardClick = () => {
    navigate(`/project/${project.id}`);
  };

  const createdAt = project.createdAt ? new Date(project.createdAt) : null;

  return (
    <>
      <div 
        className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-fade-in cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Header with gradient */}
        <div className="relative h-24 bg-gradient-to-br from-primary/20 to-primary/5 p-4">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full", getStatusDot())} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7 bg-card/80 backdrop-blur-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                {canEdit ? (
                  <DropdownMenuItem onClick={() => navigate(`/project/${project.id}`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuItem disabled>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </TooltipTrigger>
                    <TooltipContent>Admins can edit or delete</TooltipContent>
                  </Tooltip>
                )}
                {canDelete && (
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute bottom-3 left-4">
            <Badge className={cn("text-xs", getStatusColor())} variant="secondary">
              {project.status}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-1">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{project.description}</p>
          )}
          {project.createdBy && (
            <p className="text-xs text-muted-foreground mb-3">{project.createdBy}</p>
          )}

          {/* Summary stats */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {project.estimatedImageCount != null && (
              <span className="flex items-center gap-1">
                <Image className="h-3 w-3" />
                {project.estimatedImageCount} target
              </span>
            )}
            {project.piiTypes && project.piiTypes.length > 0 && (
              <span>{project.piiTypes.join(", ")}</span>
            )}
          </div>

          {/* Dates */}
          {createdAt && (
            <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
              <p>Created: {formatDistanceToNow(createdAt, { addSuffix: true })}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{project.name}" and all its data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;
