import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddImagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (images: { name: string; size: number }[]) => void;
}

export function AddImagesModal({ open, onOpenChange, onSubmit }: AddImagesModalProps) {
  const [imageName, setImageName] = useState("");
  const [imageSize, setImageSize] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageName.trim()) {
      toast({
        title: "Error",
        description: "Image name is required",
        variant: "destructive",
      });
      return;
    }

    onSubmit([{
      name: imageName.trim(),
      size: parseInt(imageSize) || 0,
    }]);

    // Reset form
    setImageName("");
    setImageSize("");
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Images</DialogTitle>
          <DialogDescription>
            Add new images to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="imageName">Image Name *</Label>
              <Input
                id="imageName"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="e.g., photo-001.jpg"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageSize">File Size (bytes)</Label>
              <Input
                id="imageSize"
                type="number"
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                placeholder="e.g., 245000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Image</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
