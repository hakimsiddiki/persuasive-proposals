import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Mail, Link2, Sparkles } from "lucide-react";
import { ProposalData } from "./ProposalForm";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import PricingTable from "./PricingTable";

interface ProposalPreviewProps {
  proposalData: ProposalData;
  generatedContent: string;
  emotionalScore: {
    warmth: number;
    clarity: number;
    confidence: number;
  };
}

const ProposalPreview = ({ proposalData, generatedContent, emotionalScore }: ProposalPreviewProps) => {
  const { toast } = useToast();
  const overallScore = Math.round(
    (emotionalScore.warmth + emotionalScore.clarity + emotionalScore.confidence) / 3
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent";
    return "text-muted-foreground";
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('proposal-content');
    const opt = {
      margin: 1,
      filename: `proposal-${proposalData.clientName.replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      toast({
        title: "PDF Downloaded! 📄",
        description: "Your proposal has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your proposal.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = () => {
    const subject = `Proposal for ${proposalData.clientName}`;
    const body = `Hi,\n\nPlease find my proposal below:\n\n${generatedContent}\n\nBest regards`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.location.href = mailtoLink;
    toast({
      title: "Opening Email Client 📧",
      description: "Your default email app will open with the proposal.",
    });
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied! 🔗",
        description: "The proposal link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Emotional Resonance Score Card */}
      <Card className="p-6 bg-gradient-card shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Proposal Confidence Score
          </h3>
          <Badge variant="secondary" className="text-2xl font-bold px-4 py-2">
            {overallScore}%
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(emotionalScore.warmth)}`}>
              {emotionalScore.warmth}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Warmth 💙</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(emotionalScore.clarity)}`}>
              {emotionalScore.clarity}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Clarity ✨</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(emotionalScore.confidence)}`}>
              {emotionalScore.confidence}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Confidence 💪</div>
          </div>
        </div>
      </Card>

      {/* Proposal Content Preview */}
      <Card id="proposal-content" className="p-8 bg-card shadow-soft">
        <div className="prose prose-slate max-w-none">
          <div className="mb-6 pb-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Proposal for {proposalData.clientName}
            </h2>
            <p className="text-muted-foreground">
              {proposalData.projectType} | {proposalData.industry}
            </p>
          </div>
          <div className="whitespace-pre-wrap text-foreground leading-relaxed">
            {generatedContent}
          </div>
        </div>
      </Card>

      {/* Pricing Table */}
      <PricingTable 
        items={[
          {
            service: "Discovery & Strategy",
            description: "Comprehensive research and planning phase",
            costUSD: 2000
          },
          {
            service: "Design & Development",
            description: "Custom-designed deliverables and implementation",
            costUSD: 5000
          },
          {
            service: "Testing & Launch",
            description: "Quality assurance and deployment support",
            costUSD: 1500
          },
          {
            service: "Post-Launch Support",
            description: "30 days of dedicated support and optimization",
            costUSD: 1000
          }
        ]}
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="hero" size="lg" className="flex-1" onClick={handleExportPDF}>
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button variant="accent" size="lg" className="flex-1" onClick={handleSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Send via Email
        </Button>
        <Button variant="outline" size="lg" onClick={handleShareLink}>
          <Link2 className="mr-2 h-4 w-4" />
          Share Link
        </Button>
      </div>
    </div>
  );
};

export default ProposalPreview;
