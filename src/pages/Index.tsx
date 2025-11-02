import { useState } from "react";
import { Sparkles, Zap, Heart, TrendingUp, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import ProposalForm, { ProposalData } from "@/components/ProposalForm";
import ProposalPreview from "@/components/ProposalPreview";
import ProgressTracker from "@/components/ProgressTracker";
import heroBackground from "@/assets/hero-background.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalData | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [emotionalScore, setEmotionalScore] = useState({
    warmth: 0,
    clarity: 0,
    confidence: 0,
  });

  const generateProposal = async (data: ProposalData) => {
    setProposalData(data);
    setIsGenerating(true);
    setCurrentStep(2);

    toast.loading("✨ Crafting your winning proposal...", { id: "generating" });

    // Simulate AI generation
    setTimeout(() => {
      const mockProposal = generateMockProposal(data);
      const mockScores = {
        warmth: Math.floor(Math.random() * 20) + 80,
        clarity: Math.floor(Math.random() * 20) + 75,
        confidence: Math.floor(Math.random() * 20) + 85,
      };

      setGeneratedContent(mockProposal);
      setEmotionalScore(mockScores);
      setIsGenerating(false);
      setCurrentStep(3);

      toast.success("🎉 Your proposal is ready!", { id: "generating" });
    }, 2500);
  };

  const generateMockProposal = (data: ProposalData): string => {
    const toneIntros = {
      friendly: "Hey there! 👋 I'm excited to share this proposal with you.",
      formal: "Dear valued client, I am pleased to present this comprehensive proposal.",
      persuasive: "Ready to transform your business? Let me show you how we'll make it happen.",
      playful: "🎨 Let's create something amazing together! Here's how we'll do it.",
    };

    return `${toneIntros[data.tone as keyof typeof toneIntros]}

Project Overview
${data.projectDescription}

What We'll Deliver

Based on your needs for ${data.projectType} in the ${data.industry} industry, here's what you can expect:

• Strategic Planning & Research
  - Comprehensive market analysis
  - Competitor insights
  - Target audience identification

• Creative Execution
  - Custom-designed deliverables
  - Brand-aligned messaging
  - Professional quality outputs

• Implementation & Support
  - Seamless project management
  - Regular progress updates
  - Post-launch support

Timeline & Investment

${data.budget ? `Based on your budget of ${data.budget}, we've` : "We've"} designed a phased approach that ensures quality without compromise:

Phase 1: Discovery & Strategy (2 weeks)
Phase 2: Design & Development (4-6 weeks)
Phase 3: Testing & Launch (2 weeks)

Why Choose Us?

✨ Proven track record with ${data.industry} clients
💡 Innovative approach tailored to your goals
🚀 On-time delivery with transparent communication
💪 Dedicated support throughout and beyond

Next Steps

I'd love to schedule a call to discuss this proposal in detail and answer any questions you might have. Let's make ${data.projectType} a resounding success!

Looking forward to working together! 🎉

Best regards,
Your Partner in Success`;
  };

  const startOver = () => {
    setCurrentStep(1);
    setProposalData(null);
    setGeneratedContent("");
    setEmotionalScore({ warmth: 0, clarity: 0, confidence: 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="absolute top-0 right-0 p-6 z-10">
        <Button 
          variant="outline" 
          onClick={() => navigate("/pricing")}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Crown className="h-4 w-4 mr-2" />
          View Premium Plans
        </Button>
      </div>

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-20 px-6"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            AI-Powered Proposal Magic
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Create Proposals That
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Win Hearts </span>
            & Clients
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Craft emotionally resonant, high-converting proposals in minutes. Perfect for freelancers,
            consultants, and agencies who want to wow their clients ✨
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
              <Heart className="h-4 w-4 text-success" />
              <span className="text-sm font-medium">Emotionally Smart</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Conversion Focused</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProgressTracker currentStep={currentStep} />

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Let's Start With Your Project Details 📋</h2>
              <p className="text-muted-foreground">
                Tell us about your client and project, and we'll handle the rest!
              </p>
            </div>
            <ProposalForm onGenerate={generateProposal} />
          </div>
        )}

        {currentStep === 2 && isGenerating && (
          <div className="text-center py-20 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-hero animate-pulse shadow-glow">
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Generating Your Proposal ✨</h2>
              <p className="text-muted-foreground">
                Our AI is crafting the perfect proposal just for you...
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && proposalData && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold">Your Winning Proposal is Ready! 🎉</h2>
              <p className="text-muted-foreground">
                Review your proposal and export it when you're happy with the results
              </p>
            </div>
            <ProposalPreview
              proposalData={proposalData}
              generatedContent={generatedContent}
              emotionalScore={emotionalScore}
            />
            <div className="flex justify-center pt-6">
              <Button variant="outline" size="lg" onClick={startOver}>
                Create Another Proposal
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-hero text-primary-foreground py-12 px-6 mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-2xl font-bold">Ready to Win More Clients?</h3>
          <p className="text-primary-foreground/90">
            Join thousands of freelancers and agencies using Proposal Genie to close more deals
          </p>
          <p className="text-sm text-primary-foreground/80">
            🎁 Get 3 free proposals per month • ✨ Upgrade anytime for unlimited access
          </p>
          <Button 
            size="lg"
            variant="secondary"
            onClick={() => navigate("/pricing")}
            className="mt-4"
          >
            <Crown className="h-5 w-5 mr-2" />
            View Premium Plans
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
