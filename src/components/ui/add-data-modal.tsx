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

interface AddDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { key: string; value: string }) => void;
}

export function AddDataModal({ open, onOpenChange, onSubmit }: AddDataModalProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!key.trim() || !value.trim()) {
      toast({
        title: "Error",
        description: "Both key and value are required",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      key: key.trim(),
      value: value.trim(),
    });

    // Reset form
    setKey("");
    setValue("");
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Data entry added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Data Entry</DialogTitle>
          <DialogDescription>
            Add a new data entry to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="key">Key *</Label>
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g., Campaign Type"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="value">Value *</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., Digital Marketing"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Data</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
