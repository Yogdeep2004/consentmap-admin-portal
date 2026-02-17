import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectsQuery } from "@/hooks/use-projects-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Image, FileText, Loader2 } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  type: "Image" | "Consent";
  url?: string;
  projectId: string;
}

const DatabaseDetails = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading, error } = useProjectsQuery();

  // Collect all images and consent maps from all projects into a flat list
  const mediaItems = useMemo<MediaItem[]>(() => {
    const items: MediaItem[] = [];
    for (const project of projects) {
      const p = project as any;
      if (Array.isArray(p.images)) {
        for (const img of p.images) {
          items.push({
            id: img.id ?? img.name,
            name: img.name,
            type: "Image",
            url: img.url,
            projectId: project.id,
          });
        }
      }
      if (Array.isArray(p.consentForms)) {
        for (const cf of p.consentForms) {
          items.push({
            id: cf.id ?? cf.name,
            name: cf.name,
            type: "Consent",
            url: cf.url,
            projectId: project.id,
          });
        }
      }
    }
    return items;
  }, [projects]);

  const handleClick = (item: MediaItem) => {
    navigate(`/image-details/${encodeURIComponent(item.name)}`, {
      state: { item },
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Image className="h-8 w-8" />
          Media Gallery
        </h1>
        <p className="text-muted-foreground mt-1">
          All uploaded images and consent maps across projects
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-destructive">
          Failed to load media.
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No uploaded media found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <Card
              key={`${item.type}-${item.id}`}
              className="cursor-pointer hover:ring-2 hover:ring-primary/40 transition-shadow overflow-hidden"
              onClick={() => handleClick(item)}
            >
              <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {item.url ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : item.type === "Image" ? (
                  <Image className="h-10 w-10 text-muted-foreground" />
                ) : (
                  <FileText className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-3 space-y-1.5">
                <p className="text-xs font-medium truncate" title={item.name}>
                  {item.name}
                </p>
                <Badge
                  variant="outline"
                  className={
                    item.type === "Image"
                      ? "bg-primary/10 text-primary border-primary/30 text-[10px]"
                      : "bg-accent/10 text-accent-foreground border-accent/30 text-[10px]"
                  }
                >
                  {item.type === "Image" ? (
                    <Image className="h-3 w-3 mr-1" />
                  ) : (
                    <FileText className="h-3 w-3 mr-1" />
                  )}
                  {item.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DatabaseDetails;
