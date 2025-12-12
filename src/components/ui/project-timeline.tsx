import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ProjectEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePermissions } from "@/hooks/use-permissions";
import {
  Plus,
  UserPlus,
  ImagePlus,
  Database,
  Edit,
  Trash2,
  History,
  Trash,
} from "lucide-react";

interface ProjectTimelineProps {
  events: ProjectEvent[];
  onClearHistory?: () => void;
  maxItems?: number;
}

const eventIcons: Record<ProjectEvent["type"], React.ReactNode> = {
  created: <Plus className="h-3 w-3" />,
  person_added: <UserPlus className="h-3 w-3" />,
  image_uploaded: <ImagePlus className="h-3 w-3" />,
  data_added: <Database className="h-3 w-3" />,
  edited: <Edit className="h-3 w-3" />,
  deleted: <Trash2 className="h-3 w-3" />,
};

const eventColors: Record<ProjectEvent["type"], string> = {
  created: "bg-success text-success-foreground",
  person_added: "bg-primary text-primary-foreground",
  image_uploaded: "bg-info text-info-foreground",
  data_added: "bg-warning text-warning-foreground",
  edited: "bg-muted text-muted-foreground",
  deleted: "bg-destructive text-destructive-foreground",
};

export function ProjectTimeline({ events, onClearHistory, maxItems = 10 }: ProjectTimelineProps) {
  const { canClearHistory } = usePermissions();
  const sortedEvents = [...events].sort((a, b) => b.timestamp - a.timestamp).slice(0, maxItems);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <History className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-sm">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent Activity</h3>
        {canClearHistory && onClearHistory && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Trash className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear History</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all activity history for this project. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearHistory}>Clear History</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-2 pr-4">
          <AnimatePresence>
            {sortedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 p-2 rounded-lg bg-muted/30"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${eventColors[event.type]}`}
                >
                  {eventIcons[event.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{event.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.user.split("@")[0]} • {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
