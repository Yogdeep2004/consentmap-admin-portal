import { useAuth } from "@/lib/auth";

export function usePermissions() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isCollaborator = user?.role === "collaborator";

  return {
    canEdit: isAdmin, // Only admin can edit
    canDelete: isAdmin, // Only admin can delete
    canAdd: true, // All roles can add
    canUpload: true, // All roles can upload
    canClearHistory: isAdmin,
    canViewLoginHistory: isAdmin || isCollaborator, // Collaborator can view but not clear
    canEditConsent: isAdmin, // Only admin can edit consent settings
    canViewConsent: isAdmin || isCollaborator, // Collaborator can view consent section
    isAdmin,
    isCollaborator,
    isUser: user?.role === "user",
  };
}