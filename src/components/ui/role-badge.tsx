import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, User, Users } from "lucide-react";
import { UserRole } from "@/lib/types";

interface RoleBadgeProps {
  role: UserRole;
  showTooltip?: boolean;
}

export function RoleBadge({ role, showTooltip = true }: RoleBadgeProps) {
  const isAdmin = role === "admin";
  const isCollaborator = role === "collaborator";

  const badge = (
    <Badge
      variant="outline"
      className={
        isAdmin
          ? "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20"
          : isCollaborator
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
          : "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
      }
    >
      {isAdmin ? (
        <Shield className="h-3 w-3 mr-1" />
      ) : isCollaborator ? (
        <Users className="h-3 w-3 mr-1" />
      ) : (
        <User className="h-3 w-3 mr-1" />
      )}
      {isAdmin ? "Admin" : isCollaborator ? "Collaborator" : "User"}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">
          {isAdmin
            ? "Full access: Add, Edit, Upload, Delete"
            : isCollaborator
            ? "View admin content, Add & Upload — no editing or deleting"
            : "Limited access: Add, Upload only"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
