import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Person, ImageFile } from "@/lib/types";
import { Check, X, Image } from "lucide-react";

interface ProjectStatusPanelProps {
  persons: Person[];
  images?: ImageFile[];
  className?: string;
}

export function ProjectStatusPanel({ persons, images = [], className }: ProjectStatusPanelProps) {
  const totalImages = images.length;
  const matching = persons.filter((p) => p.consentMatched).length;
  const notMatching = persons.length - matching;
  const matchPercentage = persons.length > 0 ? (matching / persons.length) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Image className="h-4 w-4" />
          Consent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Images</span>
          <span className="font-medium">{totalImages}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span className="text-muted-foreground">Matching</span>
            </div>
            <span className="font-medium text-success">{matching}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">Not Matching</span>
            </div>
            <span className="font-medium text-destructive">{notMatching}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Consent Match Rate</span>
            <span>{matchPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={matchPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}