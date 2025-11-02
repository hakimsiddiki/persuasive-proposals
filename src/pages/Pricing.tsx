import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchase = async (plan: string, amount: string) => {
    setLoading(plan);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: { plan, amount }
      });

      if (error) throw error;

      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for trying out our platform",
      features: [
        "3 proposals per month",
        "Basic emotional analysis",
        "Standard templates",
        "Email support",
        "PDF export"
      ],
      disabled: ["Unlimited proposals", "Advanced analytics", "Custom branding", "Priority support"],
      cta: "Current Plan",
      featured: false,
      planId: "free"
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For professionals who need more",
      features: [
        "Unlimited proposals",
        "Advanced emotional analysis",
        "All premium templates",
        "Priority email support",
        "Multi-format export (PDF, DOCX, HTML)",
        "Custom branding",
        "Analytics dashboard"
      ],
      disabled: [] as string[],
      cta: "Upgrade to Pro",
      featured: true,
      planId: "pro",
      amount: "29.00"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For teams and agencies",
      features: [
        "Everything in Pro",
        "Team collaboration (up to 10 users)",
        "API access",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security features"
      ],
      disabled: [] as string[],
      cta: "Upgrade to Enterprise",
      featured: false,
      planId: "enterprise",
      amount: "99.00"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features and take your proposals to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.planId}
              className={`relative ${
                plan.featured
                  ? "border-primary shadow-xl scale-105"
                  : "border-border"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.disabled.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 opacity-50">
                      <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.featured ? "default" : "outline"}
                  disabled={plan.planId === "free" || loading === plan.planId}
                  onClick={() => plan.amount && handlePurchase(plan.planId, plan.amount)}
                >
                  {loading === plan.planId ? "Processing..." : plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day money-back guarantee
          </p>
          <Button variant="link" onClick={() => window.location.href = "/"}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;