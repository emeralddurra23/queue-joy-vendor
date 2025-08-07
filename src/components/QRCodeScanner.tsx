import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X } from "lucide-react";

interface QRCodeScannerProps {
  onScan: (qrCode: string) => void;
}

const QRCodeScanner = ({ onScan }: QRCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment" // Use back camera if available
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        setError(null);
      }
    } catch (err) {
      setError("Camera access denied or not available");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleManualInput = () => {
    const qrCode = prompt("Enter QR code manually:");
    if (qrCode) {
      onScan(qrCode);
    }
  };

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={handleManualInput} variant="outline">
          Enter QR Code Manually
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg"></div>
          </div>
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Camera className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleManualInput} 
            variant="outline" 
            className="flex-1"
          >
            Manual Entry
          </Button>
          <Button 
            onClick={() => onScan("DEMO_QR_CODE")} 
            variant="secondary"
            className="flex-1"
          >
            Demo Scan
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Position the QR code within the frame above
        </p>
      </div>
    </Card>
  );
};

export default QRCodeScanner;