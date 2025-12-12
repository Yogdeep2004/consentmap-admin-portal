import { useAuth } from "@/lib/auth";

export function usePermissions() {
  const { user } = useAuth();

  return {
    canEdit: user?.role === "admin",
    canDelete: user?.role === "admin",
    canAdd: true, // Both roles can add
    canUpload: true, // Both roles can upload
    canClearHistory: user?.role === "admin",
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };
}
