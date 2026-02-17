import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Image, FileText } from "lucide-react";

const ImageDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = (location.state as any)?.item;

  if (!item) {
    return (
      <div className="p-6 lg:p-8 text-center">
        <p className="text-muted-foreground mb-4">No media item selected.</p>
        <Button variant="outline" onClick={() => navigate("/database-details")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/database-details")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Gallery
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {item.type === "Image" ? (
              <Image className="h-5 w-5 text-primary" />
            ) : (
              <FileText className="h-5 w-5 text-primary" />
            )}
            Media Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview */}
          <div className="rounded-lg border bg-muted/30 flex items-center justify-center overflow-hidden min-h-[300px]">
            {item.url ? (
              <img
                src={item.url}
                alt={item.name}
                className="max-h-[500px] w-auto object-contain"
              />
            ) : item.type === "Image" ? (
              <Image className="h-16 w-16 text-muted-foreground" />
            ) : (
              <FileText className="h-16 w-16 text-muted-foreground" />
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Unique Image ID
              </p>
              <p className="text-sm font-medium break-all">{item.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Type
              </p>
              <Badge
                variant="outline"
                className={
                  item.type === "Image"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-accent/10 text-accent-foreground border-accent/30"
                }
              >
                {item.type}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Detection Status
              </p>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-success">
                  Face Detected
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageDetails;
