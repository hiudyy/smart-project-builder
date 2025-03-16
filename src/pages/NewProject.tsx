
import { NewProjectForm } from "@/components/projects/NewProjectForm";

const NewProject = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <NewProjectForm />
    </div>
  );
};

export default NewProject;
