import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "@/lib/auth";
import { RoleBadge } from "@/components/ui/role-badge";
import { AdminHeaderMenu } from "@/components/ui/admin-header-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const DashboardLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 h-14 shrink-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Page title could go here */}
          </div>
          <div className="flex items-center gap-3">
            {user && <RoleBadge role={user.role} />}
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
            </Button>
            <AdminHeaderMenu />
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
