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
        console.log('Demo credentials detected, setting up demo user...');
        const setupResult = await setupDemoUser();
        
        if (!setupResult.success) {
          console.error('Demo setup failed:', setupResult.error);
          toast({
            title: "Demo Setup Error",
            description: "Failed to setup demo user. Please try the QR code option with 'DEMO_QR_123'.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (setupResult.needsConfirmation) {
          toast({
            title: "Demo User Created",
            description: "Demo user created but requires email confirmation. Please use QR code 'DEMO_QR_123' to login instead.",
            variant: "default",
          });
          setIsLoading(false);
          return;
        }

        // If setup was successful and no confirmation needed, proceed with login
        if (setupResult.user) {
          toast({
            title: "Demo Login Successful!",
            description: "Welcome to the VoiceBridge Queue demo.",
          });
          navigate("/dashboard");
          setIsLoading(false);
          return;
        }
      }

      // Regular login flow for non-demo users
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Invalid Credentials",
            description: "Please check your email and password.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link, or contact support.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
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
      console.log('Processing QR code:', qrCode);
      
      // Special handling for demo QR code
      if (qrCode === 'DEMO_QR_123') {
        console.log('Demo QR code detected, setting up demo user...');
        const setupResult = await setupDemoUser();
        
        if (setupResult.success && setupResult.user) {
          // For demo QR, we'll create a session directly
          toast({
            title: "Demo QR Login Successful!",
            description: "Welcome to the VoiceBridge Queue demo via QR code.",
          });
          navigate("/dashboard");
          setShowQRScanner(false);
          setIsLoading(false);
          return;
        } else {
          toast({
            title: "Demo Setup Error",
            description: "Failed to setup demo user. Please try email login instead.",
            variant: "destructive",
          });
          setShowQRScanner(false);
          setIsLoading(false);
          return;
        }
      }

      // Query the staff table for the QR badge code
      const { data: staffData, error } = await supabase
        .from('staff')
        .select('*, vendors(*)')
        .eq('qr_badge_code', qrCode)
        .single();

      if (error || !staffData) {
        console.error('QR code lookup error:', error);
        toast({
          title: "QR Code Not Found",
          description: "This QR code is not recognized. Please contact your manager or try the demo code 'DEMO_QR_123'.",
          variant: "destructive",
        });
        setShowQRScanner(false);
        setIsLoading(false);
        return;
      }

      toast({
        title: "QR Code Recognized!",
        description: `Welcome ${staffData.email} from ${staffData.vendors?.name}! Implementing secure authentication...`,
      });

      // TODO: Implement secure token-based authentication for QR codes
      // For now, we'll simulate the authentication process
      setTimeout(() => {
        toast({
          title: "QR Authentication",
          description: "QR-based secure authentication will be fully implemented soon. Please use email login for now.",
          variant: "default",
        });
      }, 1500);
      
    } catch (error) {
      console.error('QR scan error:', error);
      toast({
        title: "Error",
        description: "Failed to process QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowQRScanner(false);
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
          
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Demo Access:</p>
            <p className="text-sm text-muted-foreground">
              Email: admin@demo.com / demo123
            </p>
            <p className="text-sm text-muted-foreground">
              QR Code: DEMO_QR_123
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Try QR login if email confirmation is required
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;