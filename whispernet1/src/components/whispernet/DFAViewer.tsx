import { useEffect, useState } from "react";
import { GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DFAViewerProps {
  binaryStream: string;
  onDecode: (text: string) => void;
}

export const DFAViewer = ({ binaryStream, onDecode }: DFAViewerProps) => {
  const [currentState, setCurrentState] = useState(0);
  const [buffer, setBuffer] = useState("");
  const [processedChars, setProcessedChars] = useState<string[]>([]);

  useEffect(() => {
    if (binaryStream.length === 0) {
      setCurrentState(0);
      setBuffer("");
      setProcessedChars([]);
      onDecode("");
      return;
    }

    // Process binary stream in chunks of 8 bits
    const chunks: string[] = [];
    for (let i = 0; i < binaryStream.length; i += 8) {
      const chunk = binaryStream.slice(i, i + 8);
      if (chunk.length === 8) {
        chunks.push(chunk);
      }
    }

    // Decode chunks to characters
    const decoded = chunks.map((chunk) => {
      const charCode = parseInt(chunk, 2);
      return String.fromCharCode(charCode);
    });

    setProcessedChars(decoded);
    onDecode(decoded.join(""));

    // Update current state based on buffer
    const lastChunk = binaryStream.slice(-8);
    setBuffer(lastChunk);
    setCurrentState(lastChunk.length);
  }, [binaryStream, onDecode]);

  const states = [
    { id: 0, label: "START", description: "Waiting for bits" },
    { id: 1, label: "B1", description: "1 bit received" },
    { id: 2, label: "B2", description: "2 bits received" },
    { id: 3, label: "B3", description: "3 bits received" },
    { id: 4, label: "B4", description: "4 bits received" },
    { id: 5, label: "B5", description: "5 bits received" },
    { id: 6, label: "B6", description: "6 bits received" },
    { id: 7, label: "B7", description: "7 bits received" },
    { id: 8, label: "ACCEPT", description: "Character complete" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">DFA State Machine</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Deterministic Finite Automaton for binary-to-text decoding
      </p>

      <div className="space-y-4">
        {/* Current Buffer */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-sm font-medium text-foreground mb-2">Current Buffer</div>
          <div className="font-mono text-lg text-primary">
            {buffer || "Empty"} {buffer && `(${buffer.length}/8 bits)`}
          </div>
        </div>

        {/* State Grid */}
        <div className="grid grid-cols-3 gap-2">
          {states.map((state) => (
            <div
              key={state.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                currentState === state.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-foreground">{state.label}</span>
                {currentState === state.id && (
                  <Badge variant="default">Active</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{state.description}</div>
            </div>
          ))}
        </div>

        {/* Processed Characters */}
        {processedChars.length > 0 && (
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="text-sm font-medium text-foreground mb-2">
              Decoded Characters ({processedChars.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {processedChars.map((char, index) => (
                <Badge key={index} variant="secondary" className="font-mono">
                  {char}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
