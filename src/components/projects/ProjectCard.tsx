
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { Eye, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planning":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "paused":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {project.description}
        </p>
        <div className="text-xs text-muted-foreground">
          <p>Created: {formatDistanceToNow(project.createdAt, { addSuffix: true })}</p>
          <p>Last updated: {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(project.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button 
          onClick={() => navigate(`/project/${project.id}`)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
