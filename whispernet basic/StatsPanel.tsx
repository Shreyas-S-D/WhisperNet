import { BarChart3, Clock, Zap } from "lucide-react";
import { Packet } from "@/pages/Index";
import { Badge } from "@/components/ui/badge";

interface StatsPanelProps {
  packets: Packet[];
  binaryStream: string;
  decodedText: string;
}

export const StatsPanel = ({ packets, binaryStream, decodedText }: StatsPanelProps) => {
  const totalPackets = packets.length;
  const avgDelay =
    packets.length > 0
      ? packets.reduce((sum, p) => sum + p.delay, 0) / packets.length
      : 0;
  const totalTime =
    packets.length > 1
      ? packets[packets.length - 1].timestamp - packets[0].timestamp
      : 0;
  const bitRate = totalTime > 0 ? (binaryStream.length / (totalTime / 1000)).toFixed(2) : "0";

  const zeroCount = binaryStream.split("0").length - 1;
  const oneCount = binaryStream.split("1").length - 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Statistics</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Real-time transmission metrics and analysis
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Packets */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Packets</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{totalPackets}</div>
        </div>

        {/* Average Delay */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Avg Delay</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{avgDelay.toFixed(0)} ms</div>
        </div>

        {/* Total Time */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Time</div>
          <div className="text-3xl font-bold text-foreground">{(totalTime / 1000).toFixed(2)} s</div>
        </div>

        {/* Bit Rate */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Bit Rate</div>
          <div className="text-3xl font-bold text-foreground">{bitRate} bps</div>
        </div>
      </div>

      {/* Bit Distribution */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="text-sm font-medium text-foreground mb-3">Bit Distribution</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Bit 0 (Short Delay)</span>
            <Badge variant="secondary">{zeroCount}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Bit 1 (Long Delay)</span>
            <Badge variant="secondary">{oneCount}</Badge>
          </div>
        </div>

        {/* Visual Bar */}
        {binaryStream.length > 0 && (
          <div className="mt-4">
            <div className="flex h-6 w-full rounded-md overflow-hidden">
              <div
                className="bg-green-500"
                style={{ width: `${(zeroCount / binaryStream.length) * 100}%` }}
              />
              <div
                className="bg-blue-500"
                style={{ width: `${(oneCount / binaryStream.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Message Info */}
      {decodedText && (
        <div className="bg-primary/10 border border-primary rounded-lg p-4">
          <div className="text-sm font-medium text-foreground mb-2">Message Stats</div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Characters: {decodedText.length}</div>
            <div>Bytes: {binaryStream.length / 8}</div>
            <div>Efficiency: {((decodedText.length / totalTime) * 1000).toFixed(2)} chars/sec</div>
          </div>
        </div>
      )}
    </div>
  );
};
