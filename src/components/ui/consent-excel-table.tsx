import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { Person } from "@/lib/types";
import { usePermissions } from "@/hooks/use-permissions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, X, AlertTriangle, Search, Filter, Columns, Edit2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConsentExcelTableProps {
  persons: Person[];
  onEditPerson?: (personId: string, data: Partial<Person>) => void;
  className?: string;
}

type FilterType = "all" | "matching" | "not-matching";
type SortField = "name" | "pid" | "timestamp" | "status";
type SortOrder = "asc" | "desc";

const allColumns = ["PID", "Name", "Status", "Consent Document", "Uploaded By", "Timestamp"] as const;

export function ConsentExcelTable({ persons, onEditPerson, className }: ConsentExcelTableProps) {
  const { canEditConsent } = usePermissions();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [visibleColumns, setVisibleColumns] = useState<string[]>([...allColumns]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Computed stats
  const total = persons.length;
  const matching = persons.filter((p) => p.consentMatched).length;
  const notMatching = total - matching;

  // Filter and sort persons
  const filteredPersons = useMemo(() => {
    let result = [...persons];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          (p.pid && p.pid.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filter === "matching") {
      result = result.filter((p) => p.consentMatched);
    } else if (filter === "not-matching") {
      result = result.filter((p) => !p.consentMatched);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "pid":
          comparison = (a.pid || "").localeCompare(b.pid || "");
          break;
        case "timestamp":
          comparison = a.timestamp - b.timestamp;
          break;
        case "status":
          comparison = Number(b.consentMatched) - Number(a.consentMatched);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [persons, searchQuery, filter, sortField, sortOrder]);

  const toggleColumn = (col: string) => {
    setVisibleColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleToggleConsent = (personId: string, currentStatus: boolean) => {
    if (!canEditConsent || !onEditPerson) return;
    onEditPerson(personId, { consentMatched: !currentStatus });
    setEditingId(null);
  };

  const getStatusIcon = (matched: boolean) => {
    if (matched) {
      return <Check className="h-4 w-4 text-success" />;
    }
    return <X className="h-4 w-4 text-destructive" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary Header */}
      <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Total:</span>
          <Badge variant="secondary">{total}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-success" />
          <span className="text-muted-foreground">Matching:</span>
          <Badge className="bg-success/10 text-success border-success/30">{matching}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <X className="h-4 w-4 text-destructive" />
          <span className="text-muted-foreground">Not Matching:</span>
          <Badge className="bg-destructive/10 text-destructive border-destructive/30">{notMatching}</Badge>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by PID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-1">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button
            variant={filter === "matching" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("matching")}
            className={filter === "matching" ? "" : "text-success border-success/30 hover:bg-success/10"}
          >
            <Check className="h-3 w-3 mr-1" />
            Matching
          </Button>
          <Button
            variant={filter === "not-matching" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("not-matching")}
            className={filter === "not-matching" ? "" : "text-destructive border-destructive/30 hover:bg-destructive/10"}
          >
            <X className="h-3 w-3 mr-1" />
            Not Matching
          </Button>
        </div>

        {/* Column Visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {allColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={visibleColumns.includes(col)}
                onCheckedChange={() => toggleColumn(col)}
              >
                {col}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.includes("PID") && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("pid")}
                >
                  PID {sortField === "pid" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.includes("Name") && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.includes("Status") && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("status")}
                >
                  Status {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {visibleColumns.includes("Consent Document") && (
                <TableHead>Consent Document</TableHead>
              )}
              {visibleColumns.includes("Uploaded By") && (
                <TableHead>Uploaded By</TableHead>
              )}
              {visibleColumns.includes("Timestamp") && (
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 text-right"
                  onClick={() => handleSort("timestamp")}
                >
                  Timestamp {sortField === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
              )}
              {canEditConsent && <TableHead className="w-[60px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPersons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + (canEditConsent ? 1 : 0)} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchQuery || filter !== "all"
                      ? "No matching records found"
                      : "No persons added yet"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPersons.map((person) => (
                <TableRow key={person.id}>
                  {visibleColumns.includes("PID") && (
                    <TableCell className="font-mono text-sm">
                      {person.pid || <span className="text-muted-foreground">-</span>}
                    </TableCell>
                  )}
                  {visibleColumns.includes("Name") && (
                    <TableCell className="font-medium">{person.name}</TableCell>
                  )}
                  {visibleColumns.includes("Status") && (
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(person.consentMatched)}
                            <Badge
                              variant="outline"
                              className={
                                person.consentMatched
                                  ? "bg-success/10 text-success border-success/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                              }
                            >
                              {person.consentMatched ? "Matched" : "Not Matched"}
                            </Badge>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {person.consentMatched
                            ? "Consent verified and matched"
                            : "Consent pending verification"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  )}
                  {visibleColumns.includes("Consent Document") && (
                    <TableCell>
                      {person.consentFiles.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[150px]">
                            {person.consentFiles[0]}
                          </span>
                          {person.consentFiles.length > 1 && (
                            <Badge variant="secondary" className="text-xs">
                              +{person.consentFiles.length - 1}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          No document
                        </span>
                      )}
                    </TableCell>
                  )}
                  {visibleColumns.includes("Uploaded By") && (
                    <TableCell className="text-sm text-muted-foreground">
                      {person.addedBy}
                    </TableCell>
                  )}
                  {visibleColumns.includes("Timestamp") && (
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {format(new Date(person.timestamp), "MMM d, yyyy")}
                    </TableCell>
                  )}
                  {canEditConsent && (
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleConsent(person.id, person.consentMatched)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Toggle consent status
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Responsive note for mobile */}
      <p className="text-xs text-muted-foreground text-center md:hidden">
        Scroll horizontally to see all columns
      </p>
    </div>
  );
}
