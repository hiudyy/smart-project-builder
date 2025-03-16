
import { NewProjectForm } from "@/components/projects/NewProjectForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewProject = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="mr-2"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Project</h1>
      </div>
      <NewProjectForm />
    </div>
  );
};

export default NewProject;
