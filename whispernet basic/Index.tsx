import { useState } from "react";
import { SenderModule } from "@/components/whispernet/SenderModule";
import { PacketTimeline } from "@/components/whispernet/PacketTimeline";
import { DFAViewer } from "@/components/whispernet/DFAViewer";
import { ReceiverDisplay } from "@/components/whispernet/ReceiverDisplay";
import { StatsPanel } from "@/components/whispernet/StatsPanel";
import { Card } from "@/components/ui/card";
import { Shield, Wifi } from "lucide-react";

export interface Packet {
  id: number;
  timestamp: number;
  bit: 0 | 1;
  delay: number;
}

const Index = () => {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [binaryStream, setBinaryStream] = useState<string>("");
  const [decodedText, setDecodedText] = useState<string>("");
  const [isTransmitting, setIsTransmitting] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">WhisperNet</h1>
            <Wifi className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">
            Covert Communication Through Timing-Based Network Steganography
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sender Module */}
          <Card className="p-6">
            <SenderModule
              onPacketsGenerated={(newPackets) => {
                setPackets(newPackets);
                const binary = newPackets.map(p => p.bit).join("");
                setBinaryStream(binary);
              }}
              isTransmitting={isTransmitting}
              setIsTransmitting={setIsTransmitting}
            />
          </Card>

          {/* Receiver Display */}
          <Card className="p-6">
            <ReceiverDisplay
              binaryStream={binaryStream}
              decodedText={decodedText}
              isReceiving={isTransmitting}
            />
          </Card>
        </div>

        {/* Packet Timeline */}
        <Card className="p-6">
          <PacketTimeline packets={packets} />
        </Card>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DFA State Machine */}
          <Card className="p-6">
            <DFAViewer
              binaryStream={binaryStream}
              onDecode={(text) => setDecodedText(text)}
            />
          </Card>

          {/* Statistics Panel */}
          <Card className="p-6">
            <StatsPanel
              packets={packets}
              binaryStream={binaryStream}
              decodedText={decodedText}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
