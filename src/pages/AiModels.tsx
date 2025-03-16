
import { ModelSearch } from "@/components/ai/ModelSearch";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AiModels = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
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
            <h1 className="text-3xl font-bold">AI Models</h1>
          </div>
          <p className="text-muted-foreground">
            Browse and download AI models directly from Hugging Face
          </p>
        </div>
      </div>

      <ModelSearch />
    </div>
  );
};

export default AiModels;
