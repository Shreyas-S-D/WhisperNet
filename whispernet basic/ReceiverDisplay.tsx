import { Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReceiverDisplayProps {
  binaryStream: string;
  decodedText: string;
  isReceiving: boolean;
}

export const ReceiverDisplay = ({
  binaryStream,
  decodedText,
  isReceiving,
}: ReceiverDisplayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Receiver Module</h2>
        </div>
        {isReceiving && (
          <Badge variant="default" className="animate-pulse">
            Receiving
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Captures and reconstructs the hidden message
      </p>

      <div className="space-y-4">
        {/* Binary Stream Display */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="text-sm font-medium text-foreground mb-2">
            Binary Stream ({binaryStream.length} bits)
          </div>
          <div className="font-mono text-sm text-primary break-all max-h-32 overflow-y-auto">
            {binaryStream || "Waiting for transmission..."}
          </div>
        </div>

        {/* Decoded Message Display */}
        <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
          <div className="text-sm font-medium text-foreground mb-2">
            Decoded Message
          </div>
          <div className="text-lg font-semibold text-primary min-h-[3rem] flex items-center">
            {decodedText || "No message received"}
          </div>
        </div>

        {/* Reception Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Bits Received</div>
            <div className="text-2xl font-bold text-foreground">{binaryStream.length}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Characters</div>
            <div className="text-2xl font-bold text-foreground">
              {Math.floor(binaryStream.length / 8)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
