import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ContributorsTable from "@/components/ui/ruixen-contributors-table";
import { ArrowLeft } from "lucide-react";

const DemoContributors = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Contributors Table Demo</CardTitle>
          <CardDescription>
            A demo of the Ruixen Contributors Table component with filtering, column visibility, and contributor avatars.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContributorsTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoContributors;
