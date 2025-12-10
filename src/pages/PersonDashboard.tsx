import React from "react";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

const stats = [
  { label: "Total Persons", value: "1,247", icon: Users, color: "text-info" },
  { label: "Consented", value: "892", icon: UserCheck, color: "text-primary" },
  { label: "Pending", value: "289", icon: Clock, color: "text-warning" },
  { label: "Declined", value: "66", icon: UserX, color: "text-destructive" },
];

const PersonDashboard = () => {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Person Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage individual consent records and person identification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Recent Person Records
        </h2>
        <p className="text-muted-foreground">
          Person records will be displayed here when projects are processed.
        </p>
      </div>
    </div>
  );
};

export default PersonDashboard;
