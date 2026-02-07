import React, { useState, useMemo, useRef } from "react";
import { ImageFile } from "@/lib/types";
import { usePermissions } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Upload, Image, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface UniqueImagesTableProps {
  images: ImageFile[];
  consentForms: ImageFile[];
  onUpdateImage?: (imageId: string, data: Partial<ImageFile>) => void;
  className?: string;
}

type FilterType = "all" | "uploaded" | "not-uploaded";

export function UniqueImagesTable({ images, consentForms, onUpdateImage, className }: UniqueImagesTableProps) {
  const { canEdit } = usePermissions();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Deduplicate images by name
  const uniqueImages = images.reduce<ImageFile[]>((acc, img) => {
    if (!acc.find((i) => i.name === img.name)) {
      acc.push(img);
    }
    return acc;
  }, []);

  const getConsentForImage = (imageName: string) => {
    return consentForms.find((cf) => cf.name.toLowerCase().includes(imageName.split(".")[0].toLowerCase()));
  };

  const filteredImages = useMemo(() => {
    let result = [...uniqueImages];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((img) => img.name.toLowerCase().includes(query));
    }

    if (filter === "uploaded") {
      result = result.filter((img) => !!getConsentForImage(img.name));
    } else if (filter === "not-uploaded") {
      result = result.filter((img) => !getConsentForImage(img.name));
    }

    return result;
  }, [uniqueImages, searchQuery, filter, consentForms]);

  const handleConsentUpload = (imageId: string, file: File) => {
    // In a real app this would upload the file
    toast({
      title: "Consent uploaded",
      description: `Consent form "${file.name}" linked successfully`,
    });
  };

  const triggerFileInput = (imageId: string) => {
    fileInputRefs.current[imageId]?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filters Row - same template as consent table */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "uploaded" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("uploaded")}
            className={filter === "uploaded" ? "" : "text-success border-success/30 hover:bg-success/10"}
          >
            <Check className="h-3 w-3 mr-1" />
            Uploaded
          </Button>
          <Button
            variant={filter === "not-uploaded" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("not-uploaded")}
            className={filter === "not-uploaded" ? "" : "text-destructive border-destructive/30 hover:bg-destructive/10"}
          >
            <X className="h-3 w-3 mr-1" />
            Not Uploaded
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image Name</TableHead>
              <TableHead>Consent Form</TableHead>
              {canEdit && <TableHead className="w-[60px]">Edit</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredImages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 3 : 2} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchQuery || filter !== "all" ? "No matching images found" : "No images uploaded yet"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredImages.map((image) => {
                const consent = getConsentForImage(image.name);
                return (
                  <TableRow key={image.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {image.url ? (
                          <img src={image.url} alt={image.name} className="h-8 w-8 rounded object-cover" />
                        ) : (
                          <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                            <Image className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-sm truncate max-w-[200px]">{image.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {consent ? (
                        <Badge className="bg-success/10 text-success border-success/30">
                          <Upload className="h-3 w-3 mr-1" />
                          Uploaded
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Not Uploaded
                        </Badge>
                      )}
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <input
                          type="file"
                          className="hidden"
                          ref={(el) => { fileInputRefs.current[image.id] = el; }}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleConsentUpload(image.id, file);
                            e.target.value = "";
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => triggerFileInput(image.id)}
                          title="Upload consent form"
                        >
                          <Upload className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}