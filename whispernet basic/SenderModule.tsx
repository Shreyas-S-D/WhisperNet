import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { Packet } from "@/pages/Index";

interface SenderModuleProps {
  onPacketsGenerated: (packets: Packet[]) => void;
  isTransmitting: boolean;
  setIsTransmitting: (value: boolean) => void;
}

export const SenderModule = ({
  onPacketsGenerated,
  isTransmitting,
  setIsTransmitting,
}: SenderModuleProps) => {
  const [message, setMessage] = useState("");
  const [shortDelay, setShortDelay] = useState(100);
  const [longDelay, setLongDelay] = useState(300);

  const textToBinary = (text: string): string => {
    return text
      .split("")
      .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
      .join("");
  };

  const transmitMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message to transmit");
      return;
    }

    setIsTransmitting(true);
    const binary = textToBinary(message);
    const packets: Packet[] = [];
    let currentTime = Date.now();

    toast.success(`Transmitting: "${message}"`);

    for (let i = 0; i < binary.length; i++) {
      const bit = binary[i] === "1" ? 1 : 0;
      const delay = bit === 1 ? longDelay : shortDelay;

      await new Promise((resolve) => setTimeout(resolve, delay));
      currentTime += delay;

      packets.push({
        id: i,
        timestamp: currentTime,
        bit: bit as 0 | 1,
        delay,
      });

      onPacketsGenerated([...packets]);
    }

    setIsTransmitting(false);
    toast.success("Transmission complete!");
  };

  const stopTransmission = () => {
    setIsTransmitting(false);
    toast.info("Transmission stopped");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Sender Module</h2>
        <p className="text-sm text-muted-foreground">Encode text into packet timing</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="message">Message to Transmit</Label>
          <Input
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your secret message..."
            disabled={isTransmitting}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="short-delay">Short Delay (0) - ms</Label>
            <Input
              id="short-delay"
              type="number"
              value={shortDelay}
              onChange={(e) => setShortDelay(Number(e.target.value))}
              disabled={isTransmitting}
            />
          </div>
          <div>
            <Label htmlFor="long-delay">Long Delay (1) - ms</Label>
            <Input
              id="long-delay"
              type="number"
              value={longDelay}
              onChange={(e) => setLongDelay(Number(e.target.value))}
              disabled={isTransmitting}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!isTransmitting ? (
            <Button onClick={transmitMessage} className="flex-1">
              <Send className="mr-2 h-4 w-4" />
              Transmit
            </Button>
          ) : (
            <Button onClick={stopTransmission} variant="destructive" className="flex-1">
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
