
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileNode } from "@/types/project";
import { useProject } from "@/contexts/ProjectContext";
import { useState, useEffect } from "react";
import { Save, Download } from "lucide-react";

interface FileEditorProps {
  projectId: string;
  file: FileNode | null;
}

export function FileEditor({ projectId, file }: FileEditorProps) {
  const { updateFile, downloadFile } = useProject();
  const [content, setContent] = useState("");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (file && file.type === "file") {
      setContent(file.content || "");
      setUnsavedChanges(false);
    }
  }, [file]);

  const handleSave = () => {
    if (file && file.type === "file") {
      updateFile(projectId, file.path, content);
      setUnsavedChanges(false);
    }
  };

  const handleDownload = () => {
    if (file && file.type === "file") {
      downloadFile(projectId, file.path);
    }
  };

  if (!file || file.type !== "file") {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground">Select a file to edit</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b bg-muted/30">
        <div className="font-mono text-sm">{file.path}</div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button 
            size="sm" 
            disabled={!unsavedChanges} 
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      <Textarea
        className="flex-1 resize-none font-mono border-0 rounded-none p-4"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setUnsavedChanges(true);
        }}
      />
    </div>
  );
}
