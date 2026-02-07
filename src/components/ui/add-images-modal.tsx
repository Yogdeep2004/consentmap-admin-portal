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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";

interface AddImagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (images: { name: string; size: number; factor?: string; batchNumber?: string; url?: string }[]) => void;
}

const FACTOR_OPTIONS = ["Normal", "Dark", "Bright"];

export function AddImagesModal({ open, onOpenChange, onSubmit }: AddImagesModalProps) {
  const [imageName, setImageName] = useState("");
  const [factor, setFactor] = useState("");
  const [customFactor, setCustomFactor] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    // Auto-fill image name from first uploaded file if empty
    if (!imageName && files.length > 0) {
      setImageName(files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalName = imageName.trim() || (uploadedFiles.length > 0 ? uploadedFiles[0].name : "");

    if (!finalName) {
      toast({
        title: "Error",
        description: "Image name is required or upload a file",
        variant: "destructive",
      });
      return;
    }

    const finalFactor = factor === "custom" ? customFactor.trim() : factor;

    const url = uploadedFiles.length > 0 ? URL.createObjectURL(uploadedFiles[0]) : undefined;

    onSubmit([{
      name: finalName,
      size: uploadedFiles.length > 0 ? uploadedFiles[0].size : 0,
      factor: finalFactor || undefined,
      batchNumber: batchNumber.trim() || undefined,
      url,
    }]);

    setImageName("");
    setFactor("");
    setCustomFactor("");
    setBatchNumber("");
    setUploadedFiles([]);
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Image added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription>
            Add a new image to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="factor">Factor</Label>
              <Select value={factor} onValueChange={setFactor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select factor..." />
                </SelectTrigger>
                <SelectContent>
                  {FACTOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
              {factor === "custom" && (
                <Input
                  placeholder="Enter custom factor"
                  value={customFactor}
                  onChange={(e) => setCustomFactor(e.target.value)}
                />
              )}
            </div>

            {/* File Upload Dropbox */}
            <div className="grid gap-2">
              <Label>Image Upload</Label>
              <FileUpload onChange={handleFileUpload} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="imageName">Image Name</Label>
              <Input
                id="imageName"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="Auto-filled from upload or enter manually"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g., BATCH-001"
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