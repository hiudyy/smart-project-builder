
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import { useState, useEffect } from "react";
import { AIModel } from "@/types/project";
import { Search, Download, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ModelSearchProps {
  projectId?: string;
}

export function ModelSearch({ projectId }: ModelSearchProps) {
  const { downloadAiModel, isModelDownloading, currentProject } = useProject();
  const [searchQuery, setSearchQuery] = useState("");
  const [models, setModels] = useState<AIModel[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchInitialModels();
  }, []);

  const fetchInitialModels = async () => {
    setIsSearching(true);
    try {
      const results = await searchHuggingFaceModels("");
      setModels(results);
    } catch (error) {
      console.error("Error fetching initial models:", error);
      toast({
        title: "Error fetching models",
        description: "Failed to load AI models. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const searchHuggingFaceModels = async (query: string): Promise<AIModel[]> => {
    try {
      const url = query 
        ? `https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=12`
        : 'https://huggingface.co/api/models?sort=downloads&direction=-1&limit=12';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((model: any) => ({
        id: model.id,
        name: model.modelId,
        description: model.description || `${model.modelId} - ${model.pipeline_tag || 'AI model'}`,
        huggingFaceId: model.id,
        size: model.downloads ? `${model.downloads.toLocaleString()} downloads` : undefined,
      }));
    } catch (error) {
      console.error("Error searching models:", error);
      throw error;
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchHuggingFaceModels(searchQuery);
      setModels(results);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search models. Please try again.",
        variant: "destructive",
      });
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
          placeholder="Search AI models on Hugging Face..."
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
          {models.length > 0 ? (
            models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <CardTitle className="truncate">{model.name}</CardTitle>
                  <CardDescription className="truncate">{model.huggingFaceId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{model.description}</p>
                  {model.size && (
                    <p className="text-xs text-muted-foreground mt-2">{model.size}</p>
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
            ))
          ) : (
            <div className="col-span-3 text-center p-8">
              <p className="text-muted-foreground">No models found. Try a different search term.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
