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

interface AddConsentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; consentFiles: string[]; consentMatched: boolean }) => void;
}

export function AddConsentModal({ open, onOpenChange, onSubmit }: AddConsentModalProps) {
  const [name, setName] = useState("");
  const [consentFileName, setConsentFileName] = useState("");
  const { toast } = useToast();

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
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Consent entry added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
              <Label htmlFor="consent">Consent File Name</Label>
              <Input
                id="consent"
                value={consentFileName}
                onChange={(e) => setConsentFileName(e.target.value)}
                placeholder="e.g., consent-form.pdf"
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
