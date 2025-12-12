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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AddPersonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; pid?: string; notes?: string; consentFiles: string[] }) => void;
}

export function AddPersonModal({ open, onOpenChange, onSubmit }: AddPersonModalProps) {
  const [name, setName] = useState("");
  const [pid, setPid] = useState("");
  const [notes, setNotes] = useState("");
  const [consentFileName, setConsentFileName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Person name is required",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      name: name.trim(),
      pid: pid.trim() || undefined,
      notes: notes.trim() || undefined,
      consentFiles: consentFileName ? [consentFileName] : [],
    });

    // Reset form
    setName("");
    setPid("");
    setNotes("");
    setConsentFileName("");
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Person consent added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Person Consent</DialogTitle>
          <DialogDescription>
            Add a new person's consent to this project.
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
                placeholder="Enter person's name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pid">PID (Optional)</Label>
              <Input
                id="pid"
                value={pid}
                onChange={(e) => setPid(e.target.value)}
                placeholder="Enter person ID"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="consent">Consent File Name</Label>
              <Input
                id="consent"
                value={consentFileName}
                onChange={(e) => setConsentFileName(e.target.value)}
                placeholder="e.g., consent-john.pdf"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this consent"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Person</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
