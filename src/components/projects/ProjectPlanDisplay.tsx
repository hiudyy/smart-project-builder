
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/ui/markdown";
import { Project, ProjectStep } from "@/types/project";

interface ProjectPlanDisplayProps {
  project: Project;
  onApprovePlan: () => void;
  onApproveSingleStep: (stepId: string) => void;
  onContinueExecution: () => void;
}

export function ProjectPlanDisplay({
  project,
  onApprovePlan,
  onApproveSingleStep,
  onContinueExecution,
}: ProjectPlanDisplayProps) {
  if (!project.plan) {
    return null;
  }

  const getStepStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100 animate-pulse-slow";
      case "completed":
        return "text-green-600 bg-green-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Project Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Markdown content={project.plan} />
          {!project.planApproved && (
            <div className="mt-6">
              <Button onClick={onApprovePlan}>Approve Plan & Start Execution</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {project.steps && project.steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Execution Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {project.steps.map((step: ProjectStep) => (
                <div key={step.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${getStepStatusClass(step.status)}`}>
                      {step.status}
                    </div>
                  </div>
                  
                  {step.output && (
                    <div className="mt-2 text-sm bg-muted p-3 rounded-md">
                      <pre className="whitespace-pre-wrap">{step.output}</pre>
                    </div>
                  )}
                  
                  {step.status === "in-progress" && !project.planApproved && (
                    <div className="mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => onApproveSingleStep(step.id)}
                      >
                        Approve Step
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {project.status === "in-progress" && !project.planApproved && (
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={onContinueExecution}
                >
                  Continue Automatic Execution
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
