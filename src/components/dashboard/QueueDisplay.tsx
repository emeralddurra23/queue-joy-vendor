import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, CheckCircle, Circle, PlayCircle } from "lucide-react";

interface QueueItem {
  ticketNumber: number;
  customerName: string;
  status: 'waiting' | 'ordering' | 'preparing' | 'ready';
  waitTime: number;
  ticketCode: string;
}

const QueueDisplay = () => {
  const currentServing = 8;
  const queueData: QueueItem[] = [
    { ticketNumber: 9, customerName: "John", status: "waiting", waitTime: 3, ticketCode: "B4G6" },
    { ticketNumber: 10, customerName: "Sarah", status: "waiting", waitTime: 6, ticketCode: "C5H7" },
    { ticketNumber: 11, customerName: "Mike", status: "waiting", waitTime: 9, ticketCode: "D6I8" },
    { ticketNumber: 12, customerName: "Lisa", status: "waiting", waitTime: 12, ticketCode: "E7J9" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'default';
      case 'ordering': return 'secondary';
      case 'preparing': return 'outline';
      case 'ready': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <Circle className="h-4 w-4" />;
      case 'ordering': return <PlayCircle className="h-4 w-4" />;
      case 'preparing': return <Clock className="h-4 w-4" />;
      case 'ready': return <CheckCircle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Serving */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            Now Serving
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold text-primary">#{currentServing}</div>
            <Progress value={80} className="flex-1 ml-6" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Maria - Ticket #A3F5 (Ordering)</p>
        </CardContent>
      </Card>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Status</CardTitle>
          <CardDescription>Next customers in line</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {queueData.map((item) => (
              <div
                key={item.ticketNumber}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <span className="font-bold text-lg">#{item.ticketNumber}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.customerName}</p>
                    <p className="text-sm text-muted-foreground">Ticket {item.ticketCode}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.waitTime} min</p>
                    <p className="text-xs text-muted-foreground">Est. wait</p>
                  </div>
                  <Badge variant={getStatusColor(item.status) as any}>
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {queueData.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No customers in queue</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total in Queue</p>
                <p className="text-2xl font-bold">{queueData.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Wait</p>
                <p className="text-2xl font-bold">7.5 min</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ready Orders</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueueDisplay;