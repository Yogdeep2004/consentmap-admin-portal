import React from "react";
import { Eraser, Image, CheckCircle, AlertCircle } from "lucide-react";

const stats = [
  { label: "Total Images", value: "3,892", icon: Image, color: "text-info" },
  { label: "Redacted", value: "3,456", icon: CheckCircle, color: "text-primary" },
  { label: "Pending", value: "436", icon: AlertCircle, color: "text-warning" },
];

const RedactionModule = () => {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Redaction Module</h1>
        <p className="text-muted-foreground mt-1">
          Manage image redaction for privacy compliance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl border border-border p-6 animate-fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {stat.label}
            </h3>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Eraser className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Redaction Queue
          </h2>
        </div>
        <p className="text-muted-foreground">
          Images pending redaction will appear here. Select a project to begin processing.
        </p>
      </div>
    </div>
  );
};

export default RedactionModule;
