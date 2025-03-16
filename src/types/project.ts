
export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  createdAt: Date;
  updatedAt: Date;
  path: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  rootDirectory: FileNode;
  createdAt: Date;
  updatedAt: Date;
  status: 'planning' | 'in-progress' | 'completed' | 'paused';
  plan?: string;
  planApproved?: boolean;
  activeAiModel?: AIModel;
  steps?: ProjectStep[];
  currentStepIndex?: number;
}

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  order: number;
  dependency?: string; // ID of the step this depends on
  approved?: boolean;
  output?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  huggingFaceId: string;
  downloadedAt?: Date;
  size?: string;
}

export interface GithubConfig {
  repoUrl?: string;
  username?: string;
  connected: boolean;
}
