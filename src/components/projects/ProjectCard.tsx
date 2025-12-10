import React from "react";
import { MoreHorizontal, Image, Users, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  status: "Completed" | "In Progress" | "Pending";
  progress: number;
  images: number;
  tagged: number;
  consents: number;
  piiTypes: string[];
  createdDate: string;
  lastActivity: string;
  personInCharge: string;
}

const ProjectCard = ({
  title,
  description,
  imageUrl,
  status,
  progress,
  images,
  tagged,
  consents,
  piiTypes,
  createdDate,
  lastActivity,
  personInCharge,
}: ProjectCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "In Progress":
        return "bg-warning/10 text-warning";
      case "Pending":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getProgressColor = () => {
    if (progress === 100) return "bg-success";
    if (progress >= 50) return "bg-warning";
    return "bg-destructive";
  };

  const getStatusDot = () => {
    switch (status) {
      case "Completed":
        return "bg-success";
      case "In Progress":
        return "bg-warning";
      case "Pending":
        return "bg-destructive";
      default:
        return "bg-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-fade-in">
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className={cn("w-2.5 h-2.5 rounded-full", getStatusDot())} />
          <Button variant="ghost" size="icon" className="h-7 w-7 bg-card/80 backdrop-blur-sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-lg mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{description}</p>
        <p className="text-xs text-muted-foreground mb-2">{personInCharge}</p>
        
        <Badge className={cn("text-xs", getStatusColor())} variant="secondary">
          {status}
        </Badge>

        {/* Progress */}
        <div className="mt-4">
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
          <div className="text-center">
            <Image className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-semibold text-foreground">{images.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Images</p>
          </div>
          <div className="text-center">
            <Users className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-semibold text-foreground">{tagged.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Tagged</p>
          </div>
          <div className="text-center">
            <FileCheck className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-lg font-semibold text-foreground">{consents}</p>
            <p className="text-xs text-muted-foreground">Consents</p>
          </div>
        </div>

        {/* PII Types */}
        <div className="flex flex-wrap gap-1 mt-4">
          {piiTypes.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>

        {/* Dates */}
        <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
          <p>Created: {createdDate}</p>
          <p>Last activity: {lastActivity}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
