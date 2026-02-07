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
import { FileUpload } from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";

interface AddConsentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; consentFiles: string[]; consentMatched: boolean }) => void;
}

export function AddConsentModal({ open, onOpenChange, onSubmit }: AddConsentModalProps) {
  const [name, setName] = useState("");
  const [consentFileName, setConsentFileName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
    if (!consentFileName && files.length > 0) {
      setConsentFileName(files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      name: name.trim(),
      consentFiles: consentFileName.trim() ? [consentFileName.trim()] : [],
      consentMatched: false,
    });

    setName("");
    setConsentFileName("");
    setUploadedFiles([]);
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Consent entry added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Consent</DialogTitle>
          <DialogDescription>
            Add a new consent entry to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div className="grid gap-2">
              <Label>Consent File Upload</Label>
              <FileUpload onChange={handleFileUpload} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="consent">Consent File Name</Label>
              <Input
                id="consent"
                value={consentFileName}
                onChange={(e) => setConsentFileName(e.target.value)}
                placeholder="Auto-filled from upload or enter manually"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Consent</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
