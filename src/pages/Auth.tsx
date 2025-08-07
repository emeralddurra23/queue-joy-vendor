import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCode, Mail, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QRCodeScanner from "@/components/QRCodeScanner";
import { setupDemoUser } from "@/utils/setupDemoUser";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if this is the demo credentials and setup if needed
      if (email === 'admin@demo.com' && password === 'demo123') {
        const setupResult = await setupDemoUser();
        if (!setupResult.success) {
          toast({
            title: "Demo Setup Error",
            description: "Failed to setup demo user. Please try again.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome!",
          description: "You have been successfully logged in.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRScan = async (qrCode: string) => {
    setIsLoading(true);
    try {
      // Check if staff member exists with this QR badge code
      const { data: staff, error } = await supabase
        .from('staff')
        .select('*')
        .eq('qr_badge_code', qrCode)
        .single();

      if (error || !staff) {
        toast({
          title: "Invalid QR Badge",
          description: "QR badge not found. Please contact your administrator.",
          variant: "destructive",
        });
        return;
      }

      // For demo purposes, we'll simulate authentication
      // In a real implementation, you'd have a secure token exchange
      toast({
        title: "QR Login Successful",
        description: `Welcome ${staff.email}! QR authentication is ready for implementation.`,
      });
      
      setShowQRScanner(false);
    } catch (error) {
      toast({
        title: "QR Scan Error",
        description: "Failed to process QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            VoiceBridge Queue
          </CardTitle>
          <CardDescription>
            Vendor Sign In
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Login
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Staff Badge
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="qr" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Scan your staff badge QR code for instant access
                </p>
                {!showQRScanner ? (
                  <Button 
                    onClick={() => setShowQRScanner(true)}
                    className="w-full"
                    variant="secondary"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Open Camera Scanner
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <QRCodeScanner onScan={handleQRScan} />
                    <Button 
                      variant="outline" 
                      onClick={() => setShowQRScanner(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo credentials: admin@demo.com / demo123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;