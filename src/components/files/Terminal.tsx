
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProject } from "@/contexts/ProjectContext";
import { useState } from "react";
import { Terminal as TerminalIcon } from "lucide-react";

interface TerminalProps {
  projectId: string;
}

interface CommandHistory {
  command: string;
  output: string;
}

export function Terminal({ projectId }: TerminalProps) {
  const { executeCommand } = useProject();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<CommandHistory[]>([
    { command: "ls", output: "index.js\npackage.json\nREADME.md\nsrc/\n" },
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteCommand = async () => {
    if (!command.trim()) return;
    
    setIsExecuting(true);
    try {
      const output = await executeCommand(projectId, command);
      setHistory((prev) => [...prev, { command, output }]);
      setCommand("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setHistory((prev) => [...prev, { command, output: `Error: ${errorMessage}` }]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="terminal h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center">
          <TerminalIcon className="h-4 w-4 mr-2" />
          <span>Terminal</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="text-white">$ {item.command}</div>
            <pre className="text-green-400 whitespace-pre-wrap mt-1">{item.output}</pre>
          </div>
        ))}
      </div>
      <div className="flex items-center p-2 border-t border-slate-800">
        <span className="text-white mr-2">$</span>
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isExecuting) {
              handleExecuteCommand();
            }
          }}
          className="bg-transparent border-0 text-green-400 flex-1"
          placeholder="Enter command..."
          disabled={isExecuting}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExecuteCommand}
          disabled={isExecuting || !command.trim()}
          className="ml-2 text-green-400 hover:text-green-500 hover:bg-slate-800"
        >
          Run
        </Button>
      </div>
    </div>
  );
}
