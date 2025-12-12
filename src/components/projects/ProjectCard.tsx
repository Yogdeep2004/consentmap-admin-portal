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
import { ProjectProgress } from "@/components/ui/project-progress";
import { usePermissions } from "@/hooks/use-permissions";
import { useProjects } from "@/lib/projects";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { canEdit, canDelete } = usePermissions();
  const { deleteProject } = useProjects();
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

  const progress = project.estimatedImageCount > 0
    ? Math.min(100, Math.round(((project.persons.length + project.dataEntries.length) / project.estimatedImageCount) * 100))
    : 0;

  const getProgressColor = () => {
    if (progress === 100) return "bg-success";
    if (progress >= 50) return "bg-primary";
    return "bg-warning";
  };

  const handleDelete = () => {
    deleteProject(project.id);
    toast({ title: "Project deleted" });
    setDeleteDialogOpen(false);
  };

  const handleCardClick = () => {
    navigate(`/project/${project.id}`);
  };

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
          <p className="text-xs text-muted-foreground mb-3">{project.owner}</p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className={cn("text-sm font-medium", progress === 100 ? "text-success" : "text-foreground")}>
                {progress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", getProgressColor())}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <ProjectProgress project={project} compact />

          {/* Dates */}
          <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
            <p>Created: {formatDistanceToNow(project.createdAt, { addSuffix: true })}</p>
            <p>Last activity: {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</p>
          </div>
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
