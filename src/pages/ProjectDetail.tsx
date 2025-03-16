
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ProjectPlanDisplay } from "@/components/projects/ProjectPlanDisplay";
import { FileExplorer } from "@/components/files/FileExplorer";
import { FileEditor } from "@/components/files/FileEditor";
import { Terminal } from "@/components/files/Terminal";
import { useProject } from "@/contexts/ProjectContext";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileNode } from "@/types/project";
import { ArrowLeft, Download, Github, Play, Cpu, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModelSearch } from "@/components/ai/ModelSearch";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    projects,
    setCurrentProject,
    currentProject,
    generateProjectPlan,
    approveProjectPlan,
    approveSingleStep,
    continueProjectExecution,
    downloadProject,
    deleteAiModel,
    connectGithub,
    pushToGithub,
  } = useProject();
  const navigate = useNavigate();
  
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [username, setUsername] = useState("");
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);
  const [isPushingToGithub, setIsPushingToGithub] = useState(false);

  useEffect(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project);
      } else {
        navigate("/dashboard");
      }
    }
  }, [projectId, projects, setCurrentProject, navigate]);

  const handleGeneratePlan = async () => {
    if (!currentProject) return;
    
    setIsGeneratingPlan(true);
    try {
      await generateProjectPlan(currentProject.id, currentProject.description);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleConnectGithub = () => {
    if (!currentProject) return;
    
    setIsConnectingGithub(true);
    try {
      connectGithub(currentProject.id, repoUrl, username);
    } finally {
      setIsConnectingGithub(false);
    }
  };

  const handlePushToGithub = async () => {
    if (!currentProject) return;
    
    setIsPushingToGithub(true);
    try {
      await pushToGithub(currentProject.id);
    } finally {
      setIsPushingToGithub(false);
    }
  };

  const handleDeleteModel = () => {
    if (!currentProject) return;
    
    if (confirm("Are you sure you want to delete the active AI model?")) {
      deleteAiModel(currentProject.id);
    }
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{currentProject.name}</h1>
            <p className="text-muted-foreground">{currentProject.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadProject(currentProject.id)}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect to GitHub</DialogTitle>
                <DialogDescription>
                  Link your project to a GitHub repository to push changes directly.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">GitHub Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo">Repository URL</Label>
                  <Input
                    id="repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                {currentProject.githubConfig?.connected && (
                  <Button
                    onClick={handlePushToGithub}
                    disabled={isPushingToGithub}
                  >
                    {isPushingToGithub ? "Pushing..." : "Push Changes"}
                  </Button>
                )}
                <Button
                  onClick={handleConnectGithub}
                  disabled={isConnectingGithub || !repoUrl || !username}
                >
                  {currentProject.githubConfig?.connected
                    ? "Update Connection"
                    : "Connect"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {!currentProject.plan && (
            <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan}>
              <Play className="h-4 w-4 mr-2" />
              {isGeneratingPlan ? "Generating..." : "Generate Plan"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {currentProject.activeAiModel ? (
          <div className="flex items-center justify-between p-2 bg-secondary rounded-md w-full">
            <div className="flex items-center">
              <Cpu className="h-4 w-4 mr-2 text-primary" />
              <div>
                <span className="text-sm font-medium">
                  {currentProject.activeAiModel.name}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  {currentProject.activeAiModel.huggingFaceId}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteModel}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md w-full">
            No AI model downloaded. Go to the AI Models tab to download one.
          </div>
        )}
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
          <TabsTrigger value="ai-models">AI Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          {currentProject.plan ? (
            <ProjectPlanDisplay
              project={currentProject}
              onApprovePlan={() => approveProjectPlan(currentProject.id)}
              onApproveSingleStep={(stepId) => approveSingleStep(currentProject.id, stepId)}
              onContinueExecution={() => continueProjectExecution(currentProject.id)}
            />
          ) : (
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">No Plan Generated Yet</h2>
              <p className="text-muted-foreground mb-6">
                Generate a project plan to start building your project
              </p>
              <Button onClick={handleGeneratePlan} disabled={isGeneratingPlan}>
                {isGeneratingPlan ? "Generating..." : "Generate Plan"}
              </Button>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="files" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
            <div className="border rounded-md overflow-hidden">
              <FileExplorer
                projectId={currentProject.id}
                fileTree={currentProject.rootDirectory}
                onSelectFile={setSelectedFile}
                selectedFilePath={selectedFile?.path}
              />
            </div>
            <div className="md:col-span-2 border rounded-md overflow-hidden">
              <FileEditor
                projectId={currentProject.id}
                file={selectedFile}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="terminal" className="mt-6">
          <div className="h-[400px] border rounded-md overflow-hidden">
            <Terminal projectId={currentProject.id} />
          </div>
        </TabsContent>
        
        <TabsContent value="ai-models" className="mt-6">
          <ModelSearch projectId={currentProject.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
