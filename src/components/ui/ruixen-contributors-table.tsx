"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye } from "lucide-react";

type Contributor = {
  name: string;
  email: string;
  avatar: string;
  role: string;
};

type Project = {
  id: string;
  title: string;
  repo: string;
  status: "Active" | "Inactive" | "In Progress";
  team: string;
  tech: string;
  createdAt: string;
  contributors: Contributor[];
};

const data: Project[] = [
    {
      id: "1",
      title: "ShadCN Clone",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "UI Guild",
      tech: "Next.js",
      createdAt: "2024-06-01",
      contributors: [
        {
          name: "Srinath G",
          email: "srinath@example.com",
          avatar: "https://github.com/srinath.png",
          role: "UI Lead",
        },
        {
          name: "Kavya M",
          email: "kavya@example.com",
          avatar: "https://github.com/kavya.png",
          role: "Designer",
        },
      ],
    },
    {
      id: "2",
      title: "RUIXEN Components",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "In Progress",
      team: "Component Devs",
      tech: "React",
      createdAt: "2024-05-22",
      contributors: [
        {
          name: "Arjun R",
          email: "arjun@example.com",
          avatar: "https://github.com/arjun.png",
          role: "Developer",
        },
        {
          name: "Divya S",
          email: "divya@example.com",
          avatar: "https://github.com/divya.png",
          role: "QA",
        },
        {
          name: "Nikhil V",
          email: "nikhil@example.com",
          avatar: "https://github.com/nikhil.png",
          role: "UX",
        },
      ],
    },
    {
      id: "3",
      title: "CV Jobs Platform",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "CV Core",
      tech: "Spring Boot",
      createdAt: "2024-06-05",
      contributors: [
        {
          name: "Manoj T",
          email: "manoj@example.com",
          avatar: "https://github.com/manoj.png",
          role: "Backend Lead",
        },
      ],
    },
    {
      id: "4",
      title: "Ruixen UI Docs",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "Tech Writers",
      tech: "Markdown + Docusaurus",
      createdAt: "2024-04-19",
      contributors: [
        {
          name: "Sneha R",
          email: "sneha@example.com",
          avatar: "https://github.com/sneha.png",
          role: "Documentation",
        },
        {
          name: "Vinay K",
          email: "vinay@example.com",
          avatar: "https://github.com/vinay.png",
          role: "Maintainer",
        },
      ],
    },
    {
      id: "5",
      title: "Job Portal Analytics",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "Data Squad",
      tech: "Python",
      createdAt: "2024-03-30",
      contributors: [
        {
          name: "Aarav N",
          email: "aarav@example.com",
          avatar: "https://github.com/aarav.png",
          role: "Data Engineer",
        },
      ],
    },
    {
      id: "6",
      title: "Real-time Chat",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "Infra",
      tech: "Socket.io",
      createdAt: "2024-06-03",
      contributors: [
        {
          name: "Neha L",
          email: "neha@example.com",
          avatar: "https://github.com/neha.png",
          role: "DevOps",
        },
        {
          name: "Raghav I",
          email: "raghav@example.com",
          avatar: "https://github.com/raghav.png",
          role: "NodeJS Engineer",
        },
      ],
    },
    {
      id: "7",
      title: "RUX Theme Builder",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "Design Systems",
      tech: "Tailwind CSS",
      createdAt: "2024-05-10",
      contributors: [
        {
          name: "Ishita D",
          email: "ishita@example.com",
          avatar: "https://github.com/ishita.png",
          role: "Design Engineer",
        },
      ],
    },
    {
      id: "8",
      title: "Admin Dashboard",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "Dashboard Core",
      tech: "Remix",
      createdAt: "2024-05-28",
      contributors: [
        {
          name: "Rahul B",
          email: "rahul@example.com",
          avatar: "https://github.com/rahul.png",
          role: "Fullstack",
        },
      ],
    },
    {
      id: "9",
      title: "OpenCV Blog Engine",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "Platform",
      tech: "Node.js",
      createdAt: "2024-01-18",
      contributors: [
        {
          name: "Sanya A",
          email: "sanya@example.com",
          avatar: "https://github.com/sanya.png",
          role: "API Developer",
        },
        {
          name: "Harshit V",
          email: "harshit@example.com",
          avatar: "https://github.com/harshit.png",
          role: "Platform Architect",
        },
      ],
    },
    {
      id: "10",
      title: "Dark Mode Toggle Package",
      repo: "https://github.com/ruixenui/ruixen-buttons",
      status: "Active",
      team: "Component Devs",
      tech: "TypeScript",
      createdAt: "2024-06-02",
      contributors: [
        {
          name: "Meera C",
          email: "meera@example.com",
          avatar: "https://github.com/meera.png",
          role: "Package Maintainer",
        },
      ],
    },
  ];
  

type ColumnName = "Project" | "Repository" | "Team" | "Tech" | "Created At" | "Contributors" | "Status";

const allColumns: ColumnName[] = [
  "Project",
  "Repository",
  "Team",
  "Tech",
  "Created At",
  "Contributors",
  "Status",
];

function ContributorsTable() {
  const [visibleColumns, setVisibleColumns] = useState<ColumnName[]>([...allColumns]);
  const [statusFilter, setStatusFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");

  const filteredData = data.filter((project) => {
    return (
      (!statusFilter || project.status === statusFilter) &&
      (!techFilter || project.tech.toLowerCase().includes(techFilter.toLowerCase()))
    );
  });

  const toggleColumn = (col: ColumnName) => {
    setVisibleColumns((prev) =>
      prev.includes(col)
        ? prev.filter((c) => c !== col)
        : [...prev, col]
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Filter by tech..."
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="w-48"
          />
          <Input
            placeholder="Filter by status..."
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-48"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.includes("Project") && <TableHead>Project</TableHead>}
              {visibleColumns.includes("Repository") && <TableHead>Repository</TableHead>}
              {visibleColumns.includes("Team") && <TableHead>Team</TableHead>}
              {visibleColumns.includes("Tech") && <TableHead>Tech</TableHead>}
              {visibleColumns.includes("Created At") && <TableHead>Created At</TableHead>}
              {visibleColumns.includes("Contributors") && <TableHead>Contributors</TableHead>}
              {visibleColumns.includes("Status") && <TableHead>Status</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length ? (
              filteredData.map((project) => (
                <TableRow key={project.id}>
                  {visibleColumns.includes("Project") && (
                    <TableCell className="font-medium">{project.title}</TableCell>
                  )}
                  {visibleColumns.includes("Repository") && (
                    <TableCell>
                      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {project.repo.replace("https://", "")}
                      </a>
                    </TableCell>
                  )}
                  {visibleColumns.includes("Team") && <TableCell>{project.team}</TableCell>}
                  {visibleColumns.includes("Tech") && <TableCell>{project.tech}</TableCell>}
                  {visibleColumns.includes("Created At") && <TableCell>{project.createdAt}</TableCell>}
                  {visibleColumns.includes("Contributors") && (
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex -space-x-2">
                          {project.contributors.map((contributor, idx) => (
                            <Tooltip key={idx}>
                              <TooltipTrigger asChild>
                                <Avatar className="h-8 w-8 border-2 border-background">
                                  <AvatarImage src={contributor.avatar} alt={contributor.name} />
                                  <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-medium">{contributor.name}</p>
                                <p className="text-xs text-muted-foreground">{contributor.email}</p>
                                <p className="text-xs">{contributor.role}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  )}
                  {visibleColumns.includes("Status") && (
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "Active"
                            ? "default"
                            : project.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ContributorsTable;
