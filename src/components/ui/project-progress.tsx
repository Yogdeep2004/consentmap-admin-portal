import { Progress } from "@/components/ui/progress";
import { Users, Image, FileText } from "lucide-react";
import { Project } from "@/lib/types";

interface ProjectProgressProps {
  project: Project;
  compact?: boolean;
}

export function ProjectProgress({ project, compact = false }: ProjectProgressProps) {
  const totalEntries = project.persons.length + project.dataEntries.length;
  const consentsCount = project.persons.filter((p) => p.consentFiles.length > 0).length;
  const imagesCount = project.images.length;

  const progress = project.estimatedImageCount > 0
    ? Math.min(100, Math.round((totalEntries / project.estimatedImageCount) * 100))
    : 0;

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {project.persons.length}
        </span>
        <span className="flex items-center gap-1">
          <Image className="h-3 w-3" />
          {imagesCount}
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {consentsCount}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {project.persons.length} persons
        </span>
        <span className="flex items-center gap-1">
          <Image className="h-3.5 w-3.5" />
          {imagesCount} images
        </span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {consentsCount} consents
        </span>
      </div>
    </div>
  );
}
