import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, Mail, Link2, Sparkles } from "lucide-react";
import { ProposalData } from "./ProposalForm";

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
  const overallScore = Math.round(
    (emotionalScore.warmth + emotionalScore.clarity + emotionalScore.confidence) / 3
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-accent";
    return "text-muted-foreground";
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
      <Card className="p-8 bg-card shadow-soft">
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

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="hero" size="lg" className="flex-1">
          <FileDown className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
        <Button variant="accent" size="lg" className="flex-1">
          <Mail className="mr-2 h-4 w-4" />
          Send via Email
        </Button>
        <Button variant="outline" size="lg">
          <Link2 className="mr-2 h-4 w-4" />
          Share Link
        </Button>
      </div>
    </div>
  );
};

export default ProposalPreview;
