import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  QrCode, 
  User, 
  Clock, 
  CheckCircle, 
  Play, 
  Pause,
  Camera,
  Timer
} from "lucide-react";
import QRCodeScanner from "@/components/QRCodeScanner";

interface OrderStatus {
  taking: boolean;
  preparing: boolean;
  ready: boolean;
}

const CustomerInteraction = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({
    name: "Maria",
    ticketNumber: 9,
    ticketCode: "A3F5",
    arrivalTime: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  });
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({
    taking: true,
    preparing: false,
    ready: false
  });
  const [timers, setTimers] = useState({
    orderStart: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    prepStart: null as Date | null,
    readyTime: null as Date | null
  });
  
  const { toast } = useToast();

  const handleQRScan = (qrCode: string) => {
    // Simulate customer recognition
    const customers = [
      { name: "Maria", ticketNumber: 9, ticketCode: "A3F5" },
      { name: "John", ticketNumber: 10, ticketCode: "B4G6" },
      { name: "Sarah", ticketNumber: 11, ticketCode: "C5H7" },
    ];
    
    const customer = customers.find(c => c.ticketCode === qrCode) || customers[0];
    
    setCurrentCustomer({
      ...customer,
      arrivalTime: new Date()
    });
    
    toast({
      title: "Customer Recognized!",
      description: `${customer.name} - Ticket #${customer.ticketCode}`,
    });
    
    setShowScanner(false);
  };

  const updateOrderStatus = (stage: keyof OrderStatus) => {
    const newStatus = { ...orderStatus };
    const newTimers = { ...timers };
    
    if (stage === 'taking') {
      newStatus.taking = !newStatus.taking;
      if (newStatus.taking) {
        newTimers.orderStart = new Date();
      }
    } else if (stage === 'preparing') {
      newStatus.preparing = !newStatus.preparing;
      if (newStatus.preparing) {
        newStatus.taking = false;
        newTimers.prepStart = new Date();
      }
    } else if (stage === 'ready') {
      newStatus.ready = !newStatus.ready;
      if (newStatus.ready) {
        newStatus.preparing = false;
        newTimers.readyTime = new Date();
        toast({
          title: "Order Ready!",
          description: `${currentCustomer.name}'s order is ready for pickup.`,
        });
      }
    }
    
    setOrderStatus(newStatus);
    setTimers(newTimers);
  };

  const formatElapsedTime = (startTime: Date | null) => {
    if (!startTime) return "00:00";
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (orderStatus.ready) return 100;
    if (orderStatus.preparing) return 66;
    if (orderStatus.taking) return 33;
    return 0;
  };

  return (
    <div className="space-y-6">
      {/* Customer Arrival Alert */}
      <Card className="bg-secondary/5 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-secondary">
            <User className="h-5 w-5" />
            Customer #{currentCustomer.ticketNumber} is here!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">{currentCustomer.name}</p>
              <p className="text-muted-foreground">Ticket #{currentCustomer.ticketCode}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Arrived {Math.floor((Date.now() - currentCustomer.arrivalTime.getTime()) / 60000)} min ago
            </Badge>
          </div>
          
          {!showScanner ? (
            <Button 
              onClick={() => setShowScanner(true)}
              className="w-full"
              variant="secondary"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan Customer Ticket
            </Button>
          ) : (
            <div className="space-y-4">
              <QRCodeScanner onScan={handleQRScan} />
              <Button 
                variant="outline" 
                onClick={() => setShowScanner(false)}
                className="w-full"
              >
                Cancel Scan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Status Management */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
          <CardDescription>Track and update order progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Order Progress</span>
                <span>{getProgress()}%</span>
              </div>
              <Progress value={getProgress()} className="h-3" />
            </div>

            {/* Status Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`cursor-pointer transition-colors ${orderStatus.taking ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}`}>
                <CardContent 
                  className="pt-6 text-center"
                  onClick={() => updateOrderStatus('taking')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full ${orderStatus.taking ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      {orderStatus.taking ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                    </div>
                    <h3 className="font-semibold">Taking Order</h3>
                    {orderStatus.taking && timers.orderStart && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        {formatElapsedTime(timers.orderStart)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-colors ${orderStatus.preparing ? 'bg-secondary/10 border-secondary' : 'hover:bg-muted/50'}`}>
                <CardContent 
                  className="pt-6 text-center"
                  onClick={() => updateOrderStatus('preparing')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full ${orderStatus.preparing ? 'bg-secondary text-secondary-foreground' : 'bg-muted'}`}>
                      <Clock className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Preparing</h3>
                    {orderStatus.preparing && timers.prepStart && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        {formatElapsedTime(timers.prepStart)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={`cursor-pointer transition-colors ${orderStatus.ready ? 'bg-green-100 border-green-500' : 'hover:bg-muted/50'}`}>
                <CardContent 
                  className="pt-6 text-center"
                  onClick={() => updateOrderStatus('ready')}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full ${orderStatus.ready ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Ready</h3>
                    {orderStatus.ready && timers.readyTime && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="h-3 w-3" />
                        Completed
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-medium">{currentCustomer.name} (#{currentCustomer.ticketNumber})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ticket Code:</span>
                    <span className="font-mono">{currentCustomer.ticketCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Status:</span>
                    <Badge variant={orderStatus.ready ? "default" : orderStatus.preparing ? "secondary" : "outline"}>
                      {orderStatus.ready ? "Ready" : orderStatus.preparing ? "Preparing" : orderStatus.taking ? "Taking Order" : "Waiting"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerInteraction;