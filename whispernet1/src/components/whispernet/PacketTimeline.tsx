import { Activity } from "lucide-react";
import { Packet } from "@/pages/Index";
import { useEffect, useRef } from "react";

interface PacketTimelineProps {
  packets: Packet[];
}

export const PacketTimeline = ({ packets }: PacketTimelineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (packets.length === 0) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const plotHeight = height - 2 * padding;
    const plotWidth = width - 2 * padding;

    // Draw axes
    ctx.strokeStyle = "hsl(var(--muted-foreground))";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "hsl(var(--foreground))";
    ctx.font = "12px sans-serif";
    ctx.fillText("Time", width / 2, height - 10);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Packet Delay (ms)", 0, 0);
    ctx.restore();

    // Draw packets
    const maxDelay = Math.max(...packets.map((p) => p.delay));
    const minTime = packets[0]?.timestamp || 0;
    const maxTime = packets[packets.length - 1]?.timestamp || 0;
    const timeRange = maxTime - minTime || 1;

    packets.forEach((packet, index) => {
      const x = padding + (packet.timestamp - minTime) / timeRange * plotWidth;
      const y = height - padding - (packet.delay / maxDelay) * plotHeight;

      // Draw vertical line
      ctx.strokeStyle = packet.bit === 1 ? "hsl(217.2 91.2% 59.8%)" : "hsl(142.1 76.2% 36.3%)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, height - padding);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw dot
      ctx.fillStyle = packet.bit === 1 ? "hsl(217.2 91.2% 59.8%)" : "hsl(142.1 76.2% 36.3%)";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw legend
    ctx.fillStyle = "hsl(142.1 76.2% 36.3%)";
    ctx.beginPath();
    ctx.arc(width - 150, 30, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "hsl(var(--foreground))";
    ctx.fillText("Bit 0 (Short)", width - 140, 35);

    ctx.fillStyle = "hsl(217.2 91.2% 59.8%)";
    ctx.beginPath();
    ctx.arc(width - 150, 50, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "hsl(var(--foreground))";
    ctx.fillText("Bit 1 (Long)", width - 140, 55);
  }, [packets]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Packet Timeline</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Real-time visualization of packet timing intervals
      </p>
      <div className="bg-muted/30 rounded-lg p-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full"
          style={{ maxWidth: "100%" }}
        />
      </div>
      {packets.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No packets transmitted yet. Start a transmission to see the timeline.
        </p>
      )}
    </div>
  );
};
