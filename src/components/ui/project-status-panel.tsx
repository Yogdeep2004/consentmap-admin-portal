import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Person } from "@/lib/types";
import { Check, X, Users } from "lucide-react";

interface ProjectStatusPanelProps {
  persons: Person[];
  className?: string;
}

export function ProjectStatusPanel({ persons, className }: ProjectStatusPanelProps) {
  const total = persons.length;
  const matching = persons.filter((p) => p.consentMatched).length;
  const notMatching = total - matching;
  const matchPercentage = total > 0 ? (matching / total) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Consent Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Persons</span>
          <span className="font-medium">{total}</span>
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

        {total > 0 && notMatching > 0 && (
          <p className="text-xs text-warning flex items-center gap-1">
            ⚠️ {notMatching} person{notMatching > 1 ? "s" : ""} pending consent verification
          </p>
        )}
      </CardContent>
    </Card>
  );
}
