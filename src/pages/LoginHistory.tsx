import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { usePermissions } from "@/hooks/use-permissions";
import { AuthEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, LogIn, LogOut, UserPlus, ShieldAlert } from "lucide-react";

const LoginHistory = () => {
  const navigate = useNavigate();
  const { getAuthEvents, clearAuthEvents } = useAuth();
  const { canViewLoginHistory } = usePermissions();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<AuthEvent[]>([]);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    if (canViewLoginHistory) {
      setEvents(getAuthEvents());
    }
  }, [canViewLoginHistory, getAuthEvents]);

  if (!canViewLoginHistory) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="border-destructive/50">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <ShieldAlert className="h-12 w-12 text-destructive" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-destructive">Permission Denied</h2>
              <p className="text-muted-foreground mt-2">
                Only administrators can view login history.
              </p>
            </div>
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleClearHistory = () => {
    clearAuthEvents();
    setEvents([]);
    setClearDialogOpen(false);
    toast({ title: "Login history cleared" });
  };

  const getEventIcon = (type: AuthEvent["type"]) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4 text-success" />;
      case "logout":
        return <LogOut className="h-4 w-4 text-warning" />;
      case "signup":
        return <UserPlus className="h-4 w-4 text-primary" />;
      default:
        return null;
    }
  };

  const getEventBadge = (type: AuthEvent["type"]) => {
    switch (type) {
      case "login":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/30">Login</Badge>;
      case "logout":
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">Logout</Badge>;
      case "signup":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">Sign Up</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Login History</CardTitle>
            <CardDescription>
              View all authentication events across the system
            </CardDescription>
          </div>
          {events.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setClearDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No login events recorded yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.type)}
                          {getEventBadge(event.type)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{event.userName}</TableCell>
                      <TableCell className="text-muted-foreground">{event.userEmail}</TableCell>
                      <TableCell>
                        <Badge variant={event.role === "admin" ? "default" : "secondary"}>
                          {event.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {format(new Date(event.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clear History Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Login History</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all login history records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearHistory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LoginHistory;
