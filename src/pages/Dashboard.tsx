
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useProject } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Package } from "lucide-react";

const Dashboard = () => {
  const { projects, deleteProject } = useProject();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your AI-generated projects
          </p>
        </div>
        <Button onClick={() => navigate("/new-project")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to get started
          </p>
          <Button onClick={() => navigate("/new-project")}>
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
