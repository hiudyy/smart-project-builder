
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { useState, useEffect } from "react";
import { AIModel } from "@/types/project";
import { Search, Download, CheckCircle } from "lucide-react";

interface ModelSearchProps {
  projectId?: string;
}

export function ModelSearch({ projectId }: ModelSearchProps) {
  const { searchAiModels, downloadAiModel, isModelDownloading, currentProject } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<AIModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchInitialModels = async () => {
      setIsSearching(true);
      try {
        const results = await searchAiModels("");
        setModels(results);
      } finally {
        setIsSearching(false);
      }
    };

    fetchInitialModels();
  }, [searchAiModels]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchAiModels(searchQuery);
      setModels(results);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = async (model: AIModel) => {
    if (projectId) {
      await downloadAiModel(model.id, model.name, model.description);
    }
  };

  const isModelDownloaded = (modelId: string) => {
    return currentProject?.activeAiModel?.id === modelId;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          placeholder="Search AI models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
      </div>

      {isSearching ? (
        <div className="text-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Searching models...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((model) => (
            <Card key={model.id}>
              <CardHeader>
                <CardTitle>{model.name}</CardTitle>
                <CardDescription>{model.huggingFaceId}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{model.description}</p>
                {model.size && (
                  <p className="text-xs text-muted-foreground mt-2">Size: {model.size}</p>
                )}
              </CardContent>
              <CardFooter>
                {isModelDownloaded(model.id) ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Downloaded
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleDownload(model)}
                    disabled={isModelDownloading || !projectId}
                  >
                    {isModelDownloading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Model
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
