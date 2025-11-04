import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);
  const orderId = searchParams.get("token");
  const planId = searchParams.get("plan_id");
  const planName = searchParams.get("plan_name");

  useEffect(() => {
    const processPayment = async () => {
      if (!orderId || !planId || !planName) {
        toast({
          title: "Error",
          description: "Missing payment information",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        // Call webhook to process payment
        const { error } = await supabase.functions.invoke('paypal-webhook', {
          body: {
            orderId,
            userId: user.id,
            planId,
            planName,
          }
        });

        if (error) throw error;

        toast({
          title: "Success!",
          description: "Your subscription has been activated",
        });
      } catch (error) {
        console.error('Payment processing error:', error);
        toast({
          title: "Error",
          description: "Failed to activate subscription",
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [orderId, planId, planName, toast, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Payment Successful!</CardTitle>
          <CardDescription>
            {processing ? "Processing your payment..." : "Your payment has been processed successfully"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            {processing 
              ? "Please wait while we activate your subscription..."
              : "Thank you for upgrading! Your premium features are now active."}
          </p>
          <Button 
            onClick={() => navigate("/dashboard")} 
            className="w-full"
            disabled={processing}
          >
            {processing ? "Processing..." : "Go to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
