import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Users, Clock, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-primary">VoiceBridge Queue</h1>
              <span className="text-muted-foreground">Virtual Queue System</span>
            </div>
            <Button onClick={() => navigate("/auth")} size="lg">
              Vendor Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 mb-16">
          <h2 className="text-5xl font-bold text-primary mb-6">
            Streamline Your Food Market Queue
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Manage customer queues efficiently with real-time updates, QR code scanning, 
            and instant notifications. Perfect for food trucks, farmers markets, and food courts.
          </p>
          <Button 
            onClick={() => navigate("/auth")} 
            size="lg" 
            className="text-lg px-8 py-4 h-auto"
          >
            Access Vendor Portal
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <QrCode className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>QR Code Scanning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instant customer recognition and staff badge authentication
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <CardTitle>Real-time Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Live queue display with wait times and customer status tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track order progress from taking to preparing to ready
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-secondary mx-auto mb-4" />
              <CardTitle>Analytics & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Daily summaries, peak hour analysis, and performance insights
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Try the Demo</CardTitle>
            <CardDescription className="text-lg">
              Experience the full vendor portal with sample data
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Demo credentials: <strong>admin@demo.com</strong> / <strong>demo123</strong>
            </p>
            <Button 
              onClick={() => navigate("/auth")} 
              size="lg"
              variant="secondary"
              className="text-lg px-8"
            >
              Launch Demo Portal
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/30 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 VoiceBridge Queue. Virtual queue management for food markets.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
