import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  FolderKanban, 
  FilePlus, 
  Database,
  Eraser,
  ChevronsRight,
  Settings,
  LogOut,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useProjects } from "@/lib/projects";
import { usePermissions } from "@/hooks/use-permissions";
import { RoleBadge } from "@/components/ui/role-badge";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projects } = useProjects();
  const { canViewLoginHistory } = usePermissions();

  const navItems = [
    { icon: FolderKanban, title: "Projects", path: "/dashboard" },
    { icon: FilePlus, title: "Create Project", path: "/create-project" },
    { icon: Database, title: "Database Details", path: "/database-details" },
    { icon: Eraser, title: "Redaction Module", path: "/redaction" },
  ];

  // Add admin-only nav items
  const adminNavItems = canViewLoginHistory ? [
    { icon: History, title: "Login History", path: "/login-history" },
  ] : [];

  // Dynamic stats from projects
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalImages = projects.reduce((acc, p) => acc + p.images.length + (p.groupImages?.length || 0), 0);

  const quickStats = [
    { label: "Active Projects", value: activeProjects.toString() },
    { label: "Total Images", value: totalImages.toLocaleString() },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <nav
      className={cn(
        "sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-16",
        "border-sidebar-border bg-sidebar p-2 shadow-sm flex flex-col",
        className
      )}
    >
      {/* Logo Section */}
      <div className="mb-6 border-b border-sidebar-border pb-4">
        <div className="flex items-center gap-3 p-2">
          <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-white/10 shadow-sm">
            <span className="text-sidebar-foreground font-bold text-lg">C</span>
          </div>
          {open && (
            <div className="transition-opacity duration-200">
              <span className="block text-sm font-semibold text-sidebar-foreground">
                ConsentMap
              </span>
              <span className="block text-xs text-sidebar-foreground/70">
                Privacy Management
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        {user && (
          <div className={cn(
            "flex items-center gap-3 p-2 mt-2 rounded-md bg-white/5",
            !open && "justify-center"
          )}>
            <div className={cn(
              "size-8 rounded-full flex items-center justify-center font-medium text-sm",
              user.role === "admin" ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-sidebar-foreground"
            )}>
              {userInitials}
            </div>
            {open && (
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-sidebar-foreground truncate">{user.name}</span>
                <div className="flex items-center gap-2">
                  <span className="block text-xs text-sidebar-foreground/70 truncate">{user.email}</span>
                </div>
                <div className="mt-1">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex h-11 w-full items-center rounded-md transition-all duration-200",
                isActive
                  ? "bg-white/10 text-sidebar-foreground shadow-sm border-l-2 border-white/30"
                  : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
              )}
            >
              <div className="grid h-full w-12 place-content-center">
                <item.icon className="h-4 w-4" />
              </div>
              {open && (
                <span className="text-sm font-medium">{item.title}</span>
              )}
            </NavLink>
          );
        })}

        {/* Admin-only nav items */}
        {adminNavItems.length > 0 && (
          <>
            {open && (
              <div className="px-3 py-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wide">
                Admin
              </div>
            )}
            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "relative flex h-11 w-full items-center rounded-md transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-sidebar-foreground shadow-sm border-l-2 border-white/30"
                      : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
                  )}
                >
                  <div className="grid h-full w-12 place-content-center">
                    <item.icon className="h-4 w-4" />
                  </div>
                  {open && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </NavLink>
              );
            })}
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-sidebar-border pt-4">
        {/* Quick Stats */}
        {open && (
          <div className="mb-4">
            <div className="px-3 py-2 text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wide">
              Quick Stats
            </div>
            <div className="space-y-2 px-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex justify-between items-center py-1">
                  <span className="text-xs text-sidebar-foreground/70">{stat.label}</span>
                  <span className="text-sm font-semibold text-sidebar-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center rounded-md text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground transition-colors",
            open ? "gap-3 p-2" : "justify-center p-2"
          )}
        >
          <Settings className="h-4 w-4" />
          {open && <span className="text-sm font-medium">Settings</span>}
        </NavLink>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-sidebar-foreground/70 hover:text-red-400 hover:bg-red-500/10",
            open ? "justify-start gap-3 px-2" : "justify-center px-2"
          )}
        >
          <LogOut className="h-4 w-4" />
          {open && <span className="text-sm font-medium">Logout</span>}
        </Button>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full border-t border-white/10 mt-2 transition-colors hover:bg-white/10"
        >
          <div className="flex items-center p-3">
            <div className="grid size-10 place-content-center">
              <ChevronsRight
                className={cn(
                  "h-4 w-4 transition-transform duration-300 text-sidebar-foreground/70",
                  open && "rotate-180"
                )}
              />
            </div>
            {open && (
              <span className="text-sm font-medium text-sidebar-foreground/70">
                Hide
              </span>
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
