import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  MessageSquare, 
  Smartphone, 
  Send,
  Clock,
  CheckCircle
} from "lucide-react";

interface NotificationHistory {
  id: string;
  customer: string;
  message: string;
  type: 'in_app' | 'sms' | 'whatsapp';
  sentAt: Date;
  delivered: boolean;
}

const NotificationControl = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("maria");
  const [notificationType, setNotificationType] = useState<'in_app' | 'sms' | 'whatsapp'>('in_app');
  const [customMessage, setCustomMessage] = useState("Your tacos are ready! 🌮");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const customers = [
    { id: "maria", name: "Maria", ticketNumber: 9, phone: "+1234567890" },
    { id: "john", name: "John", ticketNumber: 10, phone: "+1234567891" },
    { id: "sarah", name: "Sarah", ticketNumber: 11, phone: "+1234567892" },
  ];

  const [notificationHistory, setNotificationHistory] = useState<NotificationHistory[]>([
    {
      id: "1",
      customer: "John",
      message: "Your order is being prepared!",
      type: "in_app",
      sentAt: new Date(Date.now() - 10 * 60 * 1000),
      delivered: true
    },
    {
      id: "2", 
      customer: "Sarah",
      message: "Your quesadillas are ready! 🎉",
      type: "sms",
      sentAt: new Date(Date.now() - 5 * 60 * 1000),
      delivered: true
    }
  ]);

  const quickMessages = [
    "Your order is ready! 🎉",
    "Your tacos are ready! 🌮",
    "Your order is being prepared",
    "Please come to pickup counter",
    "Order will be ready in 5 minutes",
    "Thank you for your patience!"
  ];

  const sendNotification = async () => {
    setIsLoading(true);
    
    try {
      const customer = customers.find(c => c.id === selectedCustomer);
      if (!customer) return;

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newNotification: NotificationHistory = {
        id: Date.now().toString(),
        customer: customer.name,
        message: customMessage,
        type: notificationType,
        sentAt: new Date(),
        delivered: true
      };

      setNotificationHistory(prev => [newNotification, ...prev]);

      toast({
        title: "Notification Sent!",
        description: `${notificationType.toUpperCase()} sent to ${customer.name}`,
      });

      // Reset form
      setCustomMessage("Your tacos are ready! 🌮");
    } catch (error) {
      toast({
        title: "Failed to send notification",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'sms': return <Smartphone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Send Notification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Notification
          </CardTitle>
          <CardDescription>
            Send updates to customers about their order status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Select Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - Ticket #{customer.ticketNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Delivery Method</Label>
              <Select value={notificationType} onValueChange={(value: 'in_app' | 'sms' | 'whatsapp') => setNotificationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_app">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      In-App Notification
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      SMS Text
                    </div>
                  </SelectItem>
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Custom Message</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Quick Messages</Label>
            <div className="flex flex-wrap gap-2">
              {quickMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomMessage(message)}
                >
                  {message}
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={sendNotification} 
            disabled={isLoading || !customMessage.trim()}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Notification"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:bg-primary/5 transition-colors" onClick={() => {
          setCustomMessage("Your order is ready! 🎉");
          setNotificationType("in_app");
        }}>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold">Order Ready</h3>
            <p className="text-sm text-muted-foreground">Notify customer pickup</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-secondary/5 transition-colors" onClick={() => {
          setCustomMessage("Your order is being prepared");
          setNotificationType("in_app");
        }}>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
            <h3 className="font-semibold">In Progress</h3>
            <p className="text-sm text-muted-foreground">Update preparation status</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-accent/5 transition-colors" onClick={() => {
          setCustomMessage("Thank you for your patience!");
          setNotificationType("in_app");
        }}>
          <CardContent className="pt-6 text-center">
            <Bell className="h-8 w-8 text-accent-foreground mx-auto mb-2" />
            <h3 className="font-semibold">Courtesy Message</h3>
            <p className="text-sm text-muted-foreground">Send thank you note</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>History of sent notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationHistory.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notification.type)}
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium">{notification.customer}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm">{formatTimeAgo(notification.sentAt)}</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-500">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {notificationHistory.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notifications sent today</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationControl;