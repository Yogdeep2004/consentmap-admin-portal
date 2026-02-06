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
import { useToast } from "@/hooks/use-toast";

interface AddImagesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (images: { name: string; size: number; factor?: string; batchNumber?: string }[]) => void;
}

const FACTOR_OPTIONS = ["Normal", "Dark", "Bright"];

export function AddImagesModal({ open, onOpenChange, onSubmit }: AddImagesModalProps) {
  const [imageName, setImageName] = useState("");
  const [factor, setFactor] = useState("");
  const [customFactor, setCustomFactor] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
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

    const finalFactor = factor === "custom" ? customFactor.trim() : factor;

    onSubmit([{
      name: imageName.trim(),
      size: 0,
      factor: finalFactor || undefined,
      batchNumber: batchNumber.trim() || undefined,
    }]);

    setImageName("");
    setFactor("");
    setCustomFactor("");
    setBatchNumber("");
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Image added successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
