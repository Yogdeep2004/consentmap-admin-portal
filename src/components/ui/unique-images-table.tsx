import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Upload, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniqueImagesTableProps {
  images: ImageFile[];
  consentForms: ImageFile[];
  onUpdateImage?: (imageId: string, data: Partial<ImageFile>) => void;
  className?: string;
}

type ImageStatus = "uploaded" | "pending" | "reviewed";

export function UniqueImagesTable({ images, consentForms, onUpdateImage, className }: UniqueImagesTableProps) {
  const { canEdit } = usePermissions();
  const [editingImage, setEditingImage] = useState<ImageFile | null>(null);
  const [editConsentFile, setEditConsentFile] = useState("");
  const [editStatus, setEditStatus] = useState<string>("");

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

  const handleEdit = (image: ImageFile) => {
    setEditingImage(image);
    const consent = getConsentForImage(image.name);
    setEditConsentFile(consent?.name || "");
    setEditStatus("uploaded");
  };

  const handleSaveEdit = () => {
    if (!editingImage) return;
    // In a real app, this would update the image metadata
    setEditingImage(null);
    setEditConsentFile("");
    setEditStatus("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image Name</TableHead>
              <TableHead>Consent Form</TableHead>
              <TableHead>Status</TableHead>
              {canEdit && <TableHead className="w-[60px]">Edit</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {uniqueImages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canEdit ? 4 : 3} className="text-center py-8">
                  <div className="text-muted-foreground">No images uploaded yet</div>
                </TableCell>
              </TableRow>
            ) : (
              uniqueImages.map((image) => {
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
                    <TableCell>
                      <Badge variant="secondary">
                        {consent ? "Reviewed" : "Pending"}
                      </Badge>
                    </TableCell>
                    {canEdit && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(image)}
                        >
                          <Edit2 className="h-3 w-3" />
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

      {/* Edit Dialog */}
      <Dialog open={!!editingImage} onOpenChange={(open) => !open && setEditingImage(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Image Details</DialogTitle>
            <DialogDescription>
              Update consent and status for {editingImage?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Consent File Name</Label>
              <Input
                value={editConsentFile}
                onChange={(e) => setEditConsentFile(e.target.value)}
                placeholder="e.g., consent-form.pdf"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingImage(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
