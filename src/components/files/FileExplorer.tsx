
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileNode } from "@/types/project";
import { useProject } from "@/contexts/ProjectContext";
import { useState } from "react";
import { File, Folder, FolderPlus, FileUp, FileDown, Trash2 } from "lucide-react";

interface FileExplorerProps {
  projectId: string;
  fileTree: FileNode;
  onSelectFile: (node: FileNode) => void;
  selectedFilePath?: string;
}

export function FileExplorer({
  projectId,
  fileTree,
  onSelectFile,
  selectedFilePath,
}: FileExplorerProps) {
  const { createFile, deleteFile } = useProject();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([fileTree.path]));
  const [newFileName, setNewFileName] = useState("");
  const [newFileIsFolder, setNewFileIsFolder] = useState(false);
  const [currentFolderPath, setCurrentFolderPath] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const handleCreateFile = () => {
    if (newFileName) {
      createFile(projectId, currentFolderPath, newFileName, newFileIsFolder);
      setNewFileName("");
      setIsDialogOpen(false);
    }
  };

  const handleDeleteFile = (node: FileNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete ${node.name}?`)) {
      deleteFile(projectId, node.path);
    }
  };

  const renderFileNode = (node: FileNode, level = 0) => {
    const isFolder = node.type === "folder";
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = node.path === selectedFilePath;
    
    return (
      <div key={node.id} className="ml-2">
        <div
          className={`file-tree-item ${isSelected ? "bg-secondary" : ""}`}
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.path);
            } else {
              onSelectFile(node);
            }
          }}
        >
          <div className="flex items-center gap-2 flex-grow">
            {isFolder ? (
              <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <File className="h-4 w-4 text-gray-500" />
            )}
            <span>{node.name}</span>
          </div>
          
          <div className="flex items-center">
            {isFolder && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentFolderPath(node.path);
                  setIsDialogOpen(true);
                }}
              >
                <FolderPlus className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => handleDeleteFile(node, e)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {isFolder && isExpanded && node.children && (
          <div className="pl-2 border-l border-gray-200 ml-2 mt-1">
            {node.children.map((child) => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-2 font-semibold border-b">Files</div>
      {renderFileNode(fileTree)}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new {newFileIsFolder ? 'folder' : 'file'}</DialogTitle>
            <DialogDescription>
              Enter a name for the new {newFileIsFolder ? 'folder' : 'file'}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder={`Enter ${newFileIsFolder ? 'folder' : 'file'} name`}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setNewFileIsFolder(!newFileIsFolder)}
            >
              {newFileIsFolder ? <Folder className="h-4 w-4" /> : <File className="h-4 w-4" />}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateFile}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
