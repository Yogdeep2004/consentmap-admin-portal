import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FolderKanban, 
  FilePlus, 
  User, 
  Eraser,
  ChevronsRight,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { icon: FolderKanban, title: "Projects", path: "/dashboard" },
    { icon: FilePlus, title: "Create Project", path: "/create-project" },
    { icon: User, title: "Person Dashboard", path: "/person-dashboard" },
    { icon: Eraser, title: "Redaction Module", path: "/redaction" },
  ];

  const quickStats = [
    { label: "Active Projects", value: "12" },
    { label: "Pending Requests", value: "5" },
    { label: "Total PIDs", value: "1,247" },
    { label: "Redacted Images", value: "3,892" },
  ];

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
          <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-primary shadow-sm">
            <span className="text-primary-foreground font-bold text-lg">C</span>
          </div>
          {open && (
            <div className="transition-opacity duration-200">
              <span className="block text-sm font-semibold text-foreground">
                ConsentMap
              </span>
              <span className="block text-xs text-muted-foreground">
                Privacy Management
              </span>
            </div>
          )}
        </div>

        {/* User Info */}
        {open && (
          <div className="flex items-center gap-3 p-2 mt-2 rounded-md bg-muted/50">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              AU
            </div>
            <div>
              <span className="block text-sm font-medium text-foreground">Admin User</span>
              <span className="block text-xs text-muted-foreground">admin@company.com</span>
            </div>
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
                  ? "bg-primary/10 text-primary shadow-sm border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
      </div>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-sidebar-border pt-4">
        {/* Quick Stats */}
        {open && (
          <div className="mb-4">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Quick Stats
            </div>
            <div className="space-y-2 px-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex justify-between items-center py-1">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
            open ? "gap-3 p-2" : "justify-center p-2"
          )}
        >
          <Settings className="h-4 w-4" />
          {open && <span className="text-sm font-medium">Settings</span>}
        </NavLink>

        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full border-t border-sidebar-border mt-2 transition-colors hover:bg-muted"
        >
          <div className="flex items-center p-3">
            <div className="grid size-10 place-content-center">
              <ChevronsRight
                className={cn(
                  "h-4 w-4 transition-transform duration-300 text-muted-foreground",
                  open && "rotate-180"
                )}
              />
            </div>
            {open && (
              <span className="text-sm font-medium text-muted-foreground">
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
