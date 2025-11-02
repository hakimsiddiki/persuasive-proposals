import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // You can capture the order here if needed
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Payment token:', token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="w-24 h-24 text-green-500" />
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Thank you for upgrading to premium. Your account has been activated with all premium features.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
            size="lg"
          >
            Start Creating Proposals
          </Button>
          
          <Button 
            onClick={() => navigate("/pricing")}
            variant="outline"
            className="w-full"
          >
            View Pricing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;