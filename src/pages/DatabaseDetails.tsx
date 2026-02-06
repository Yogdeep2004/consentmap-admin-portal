import React from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/lib/projects";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "lucide-react";

const DatabaseDetails = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/30";
      case "completed":
        return "bg-primary/10 text-primary border-primary/30";
      case "on-hold":
        return "bg-warning/10 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Database className="h-8 w-8" />
          Database Details
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of all projects with image and consent statistics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Projects Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Total Images</TableHead>
                  <TableHead>Unique Images</TableHead>
                  <TableHead>Consent Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No projects found
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => {
                    const totalImages = project.images.length + (project.groupImages?.length || 0);
                    const uniqueImageNames = new Set(project.images.map((i) => i.name));
                    const uniqueImages = uniqueImageNames.size;
                    const consentUploaded = project.persons.filter((p) => p.consentFiles.length > 0).length;

                    return (
                      <TableRow
                        key={project.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{totalImages}</TableCell>
                        <TableCell>{uniqueImages}</TableCell>
                        <TableCell>{consentUploaded}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseDetails;
