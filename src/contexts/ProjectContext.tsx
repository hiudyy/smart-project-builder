
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, FileNode, AIModel, ProjectStep } from '@/types/project';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  createProject: (name: string, description: string) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  generateProjectPlan: (projectId: string, description: string) => Promise<string>;
  approveProjectPlan: (projectId: string) => void;
  approveSingleStep: (projectId: string, stepId: string) => void;
  continueProjectExecution: (projectId: string) => void;
  createFile: (projectId: string, parentPath: string, fileName: string, isFolder: boolean) => void;
  updateFile: (projectId: string, filePath: string, content: string) => void;
  deleteFile: (projectId: string, filePath: string) => void;
  downloadProject: (projectId: string) => void;
  downloadFile: (projectId: string, filePath: string) => void;
  executeCommand: (projectId: string, command: string) => Promise<string>;
  connectGithub: (projectId: string, repoUrl: string, username: string) => void;
  pushToGithub: (projectId: string) => Promise<boolean>;
  downloadAiModel: (modelId: string, modelName: string, modelDescription: string) => Promise<boolean>;
  deleteAiModel: (projectId: string) => void;
  searchAiModels: (query: string) => Promise<AIModel[]>;
  isModelDownloading: boolean;
}

function createInitialFileStructure(projectName: string): FileNode {
  return {
    id: uuidv4(),
    name: projectName,
    type: 'folder',
    children: [
      {
        id: uuidv4(),
        name: 'src',
        type: 'folder',
        children: [
          {
            id: uuidv4(),
            name: 'index.js',
            type: 'file',
            content: '// Your main entry point',
            createdAt: new Date(),
            updatedAt: new Date(),
            path: `/${projectName}/src/index.js`,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        path: `/${projectName}/src`,
      },
      {
        id: uuidv4(),
        name: 'README.md',
        type: 'file',
        content: `# ${projectName}\n\nThis is a new project created with AI Project Generator.`,
        createdAt: new Date(),
        updatedAt: new Date(),
        path: `/${projectName}/README.md`,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    path: `/${projectName}`,
  };
}

const mockAiModelResults: AIModel[] = [
  {
    id: 'llama3-8b',
    name: 'Llama 3 (8B)',
    description: 'Meta\'s Llama 3 8B parameter model optimized for various tasks',
    huggingFaceId: 'meta-llama/Llama-3-8B',
  },
  {
    id: 'mistralai-7b',
    name: 'Mistral AI (7B)',
    description: 'Mistral 7B parameter model optimized for code generation',
    huggingFaceId: 'mistralai/Mistral-7B-v0.1',
  },
  {
    id: 'phi-2',
    name: 'Phi-2',
    description: 'Microsoft\'s 2.7B parameter model with strong reasoning capabilities',
    huggingFaceId: 'microsoft/phi-2',
  },
];

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isModelDownloading, setIsModelDownloading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load projects from localStorage when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      const storedProjects = localStorage.getItem('projects');
      if (storedProjects) {
        try {
          const parsedProjects = JSON.parse(storedProjects);
          // Convert date strings back to Date objects
          const formattedProjects = parsedProjects.map((project: Project) => ({
            ...project,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt),
            rootDirectory: formatDatesInFileTree(project.rootDirectory),
          }));
          setProjects(formattedProjects);
        } catch (error) {
          console.error('Failed to parse stored projects', error);
        }
      }
    }
  }, [isAuthenticated]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Helper function to format dates in file tree
  const formatDatesInFileTree = (node: FileNode): FileNode => {
    const formattedNode = {
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
    };

    if (formattedNode.children) {
      formattedNode.children = formattedNode.children.map(formatDatesInFileTree);
    }

    return formattedNode;
  };

  const createProject = (name: string, description: string): Project => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      rootDirectory: createInitialFileStructure(name),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'planning',
    };

    setProjects((prev) => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    
    if (currentProject?.id === updatedProject.id) {
      setCurrentProject(updatedProject);
    }
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
    
    toast({
      title: 'Project deleted',
      description: 'The project has been deleted successfully',
    });
  };

  const generateProjectPlan = async (projectId: string, description: string): Promise<string> => {
    // Simulate AI-generated plan
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    toast({
      title: 'Generating project plan',
      description: 'Please wait while we analyze your request...',
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const planSteps: ProjectStep[] = [
      {
        id: uuidv4(),
        title: 'Project setup',
        description: 'Initialize project structure and dependencies',
        status: 'pending',
        order: 1,
        approved: false,
      },
      {
        id: uuidv4(),
        title: 'Core functionality',
        description: 'Implement main features and business logic',
        status: 'pending',
        order: 2,
        approved: false,
      },
      {
        id: uuidv4(),
        title: 'User interface',
        description: 'Build responsive UI components',
        status: 'pending',
        order: 3,
        approved: false,
      },
      {
        id: uuidv4(),
        title: 'Testing',
        description: 'Write unit and integration tests',
        status: 'pending',
        order: 4,
        approved: false,
      },
      {
        id: uuidv4(),
        title: 'Documentation',
        description: 'Create comprehensive documentation',
        status: 'pending',
        order: 5,
        approved: false,
      },
    ];
    
    const projectPlan = `# Project Plan: ${project.name}

## Overview
Based on your description, we'll create a complete project with the following main components:

## Implementation Steps
1. **Project setup**: Initialize project structure and dependencies
2. **Core functionality**: Implement main features and business logic
3. **User interface**: Build responsive UI components
4. **Testing**: Write unit and integration tests
5. **Documentation**: Create comprehensive documentation

## Timeline
Estimated completion time: 1-2 hours

## Requirements
- No additional dependencies required
- All code will be written in JavaScript/TypeScript
`;

    const updatedProject = {
      ...project,
      plan: projectPlan,
      status: 'planning',
      steps: planSteps,
      currentStepIndex: 0,
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    return projectPlan;
  };

  const approveProjectPlan = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...project,
      planApproved: true,
      status: 'in-progress',
      steps: project.steps?.map((step, index) => 
        index === 0 
          ? { ...step, status: 'in-progress', approved: true } 
          : step
      ),
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: 'Plan approved',
      description: 'Project execution has started',
    });
    
    // Simulate first step execution
    setTimeout(() => {
      simulateStepExecution(projectId, 0);
    }, 3000);
  };

  const simulateStepExecution = async (projectId: string, stepIndex: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.steps || stepIndex >= project.steps.length) {
      return;
    }
    
    // Mark current step as completed
    const updatedSteps = [...project.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      status: 'completed',
      output: `Successfully completed: ${updatedSteps[stepIndex].title}`,
    };
    
    // Move to next step if available
    const nextStepIndex = stepIndex + 1;
    if (nextStepIndex < updatedSteps.length) {
      updatedSteps[nextStepIndex] = {
        ...updatedSteps[nextStepIndex],
        status: 'in-progress',
      };
    }
    
    const updatedProject = {
      ...project,
      steps: updatedSteps,
      currentStepIndex: nextStepIndex < updatedSteps.length ? nextStepIndex : stepIndex,
      status: nextStepIndex >= updatedSteps.length ? 'completed' : 'in-progress',
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    // If auto-approved, continue with next step
    if (nextStepIndex < updatedSteps.length && project.planApproved) {
      setTimeout(() => {
        simulateStepExecution(projectId, nextStepIndex);
      }, 3000);
    }
  };

  const approveSingleStep = (projectId: string, stepId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.steps) {
      throw new Error('Project or steps not found');
    }
    
    const stepIndex = project.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) {
      throw new Error('Step not found');
    }
    
    const updatedSteps = [...project.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      approved: true,
    };
    
    const updatedProject = {
      ...project,
      steps: updatedSteps,
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: 'Step approved',
      description: `Step "${project.steps[stepIndex].title}" has been approved`,
    });
    
    // Simulate step execution
    setTimeout(() => {
      simulateStepExecution(projectId, stepIndex);
    }, 2000);
  };

  const continueProjectExecution = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.steps || project.currentStepIndex === undefined) {
      throw new Error('Project, steps, or current step index not found');
    }
    
    if (project.currentStepIndex >= project.steps.length) {
      toast({
        title: 'Project completed',
        description: 'All steps have been completed',
      });
      return;
    }
    
    const updatedProject = {
      ...project,
      planApproved: true, // Enable auto-approval for remaining steps
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: 'Continuing project',
      description: 'The remaining steps will be executed automatically',
    });
    
    // Start execution of current step
    setTimeout(() => {
      simulateStepExecution(projectId, project.currentStepIndex || 0);
    }, 1000);
  };

  // File operations
  const findNodeByPath = (root: FileNode, path: string): FileNode | null => {
    if (root.path === path) {
      return root;
    }
    
    if (root.children) {
      for (const child of root.children) {
        const found = findNodeByPath(child, path);
        if (found) {
          return found;
        }
      }
    }
    
    return null;
  };

  const findParentNode = (root: FileNode, path: string): FileNode | null => {
    const parentPath = path.substring(0, path.lastIndexOf('/'));
    return findNodeByPath(root, parentPath);
  };

  const createFile = (projectId: string, parentPath: string, fileName: string, isFolder: boolean) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const rootDir = { ...project.rootDirectory };
    const parentNode = findNodeByPath(rootDir, parentPath);
    
    if (!parentNode || parentNode.type !== 'folder') {
      throw new Error('Parent directory not found or is not a folder');
    }
    
    const newPath = `${parentPath}/${fileName}`;
    
    const newFile: FileNode = {
      id: uuidv4(),
      name: fileName,
      type: isFolder ? 'folder' : 'file',
      content: isFolder ? undefined : '',
      children: isFolder ? [] : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      path: newPath,
    };
    
    parentNode.children = [...(parentNode.children || []), newFile];
    
    const updatedProject = {
      ...project,
      rootDirectory: rootDir,
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: `${isFolder ? 'Folder' : 'File'} created`,
      description: `${fileName} has been created successfully`,
    });
  };

  const updateFile = (projectId: string, filePath: string, content: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const rootDir = { ...project.rootDirectory };
    const fileNode = findNodeByPath(rootDir, filePath);
    
    if (!fileNode || fileNode.type !== 'file') {
      throw new Error('File not found or is not a file');
    }
    
    fileNode.content = content;
    fileNode.updatedAt = new Date();
    
    const updatedProject = {
      ...project,
      rootDirectory: rootDir,
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: 'File updated',
      description: `${fileNode.name} has been updated successfully`,
    });
  };

  const deleteFile = (projectId: string, filePath: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const rootDir = { ...project.rootDirectory };
    const parentNode = findParentNode(rootDir, filePath);
    
    if (!parentNode || parentNode.type !== 'folder' || !parentNode.children) {
      throw new Error('Parent directory not found or is not a folder');
    }
    
    const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
    parentNode.children = parentNode.children.filter(child => child.name !== fileName);
    
    const updatedProject = {
      ...project,
      rootDirectory: rootDir,
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: 'File deleted',
      description: `${fileName} has been deleted successfully`,
    });
  };

  const downloadProject = (projectId: string) => {
    toast({
      title: 'Download started',
      description: 'Your project is being prepared for download',
    });
    
    // In a real implementation, this would create a zip file and initiate download
    setTimeout(() => {
      toast({
        title: 'Download complete',
        description: 'Your project has been downloaded successfully',
      });
    }, 2000);
  };

  const downloadFile = (projectId: string, filePath: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const fileNode = findNodeByPath(project.rootDirectory, filePath);
    if (!fileNode || fileNode.type !== 'file') {
      throw new Error('File not found or is not a file');
    }
    
    // In a real implementation, this would create a download link for the file
    toast({
      title: 'File downloaded',
      description: `${fileNode.name} has been downloaded successfully`,
    });
  };

  const executeCommand = async (projectId: string, command: string): Promise<string> => {
    // Simulate terminal command execution
    toast({
      title: 'Executing command',
      description: `$ ${command}`,
    });
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let output = '';
    
    if (command.startsWith('ls')) {
      output = 'index.js\npackage.json\nREADME.md\nsrc/';
    } else if (command.startsWith('echo')) {
      output = command.substring(5);
    } else if (command.startsWith('pwd')) {
      output = '/project/root';
    } else if (command.startsWith('npm')) {
      output = 'Simulating npm command...\nDone.';
    } else {
      output = `Command not recognized: ${command}`;
    }
    
    return output;
  };

  const connectGithub = (projectId: string, repoUrl: string, username: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...project,
      githubConfig: {
        repoUrl,
        username,
        connected: true,
      },
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: 'GitHub connected',
      description: `Your project is now connected to ${repoUrl}`,
    });
  };

  const pushToGithub = async (projectId: string): Promise<boolean> => {
    const project = projects.find(p => p.id === projectId);
    if (!project || !project.githubConfig?.connected) {
      throw new Error('Project not found or GitHub not connected');
    }
    
    toast({
      title: 'Pushing to GitHub',
      description: 'Uploading your files to GitHub repository...',
    });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: 'Push successful',
      description: 'Your files have been successfully pushed to GitHub',
    });
    
    return true;
  };

  const downloadAiModel = async (modelId: string, modelName: string, modelDescription: string): Promise<boolean> => {
    if (isModelDownloading) {
      toast({
        title: 'Model download in progress',
        description: 'Please wait for the current download to complete',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsModelDownloading(true);
    
    toast({
      title: 'Downloading AI model',
      description: `Downloading ${modelName}. This may take a while...`,
    });
    
    // Simulate download delay
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const model: AIModel = {
      id: modelId,
      name: modelName,
      description: modelDescription,
      huggingFaceId: `huggingface/${modelId}`,
      downloadedAt: new Date(),
      size: '1.2 GB',
    };
    
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        activeAiModel: model,
        updatedAt: new Date(),
      };
      
      updateProject(updatedProject);
    }
    
    setIsModelDownloading(false);
    
    toast({
      title: 'Model downloaded',
      description: `${modelName} has been downloaded successfully`,
    });
    
    return true;
  };

  const deleteAiModel = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    if (!project.activeAiModel) {
      toast({
        title: 'No model to delete',
        description: 'There is no active AI model for this project',
        variant: 'destructive',
      });
      return;
    }
    
    const modelName = project.activeAiModel.name;
    
    const updatedProject = {
      ...project,
      activeAiModel: undefined,
      updatedAt: new Date(),
    };
    
    updateProject(updatedProject);
    
    toast({
      title: 'Model deleted',
      description: `${modelName} has been deleted successfully`,
    });
  };

  const searchAiModels = async (query: string): Promise<AIModel[]> => {
    // Simulate API search
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!query.trim()) {
      return mockAiModelResults;
    }
    
    return mockAiModelResults.filter(model => 
      model.name.toLowerCase().includes(query.toLowerCase()) || 
      model.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      setCurrentProject,
      createProject,
      updateProject,
      deleteProject,
      generateProjectPlan,
      approveProjectPlan,
      approveSingleStep,
      continueProjectExecution,
      createFile,
      updateFile,
      deleteFile,
      downloadProject,
      downloadFile,
      executeCommand,
      connectGithub,
      pushToGithub,
      downloadAiModel,
      deleteAiModel,
      searchAiModels,
      isModelDownloading,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
