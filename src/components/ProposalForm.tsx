import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, ArrowRight } from "lucide-react";

interface ProposalFormProps {
  onGenerate: (data: ProposalData) => void;
}

export interface ProposalData {
  clientName: string;
  projectType: string;
  projectDescription: string;
  tone: string;
  industry: string;
  budget: string;
}

const ProposalForm = ({ onGenerate }: ProposalFormProps) => {
  const [formData, setFormData] = useState<ProposalData>({
    clientName: "",
    projectType: "",
    projectDescription: "",
    tone: "friendly",
    industry: "marketing",
    budget: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  const updateField = (field: keyof ProposalData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-8 bg-gradient-card shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name ✨</Label>
          <Input
            id="clientName"
            placeholder="Enter your client's name"
            value={formData.clientName}
            onChange={(e) => updateField("clientName", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select value={formData.industry} onValueChange={(value) => updateField("industry", value)}>
              <SelectTrigger id="industry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marketing">Marketing 📢</SelectItem>
                <SelectItem value="design">Design 🎨</SelectItem>
                <SelectItem value="coaching">Coaching 💡</SelectItem>
                <SelectItem value="tech">Technology 💻</SelectItem>
                <SelectItem value="consulting">Consulting 📊</SelectItem>
                <SelectItem value="other">Other 🌟</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type</Label>
            <Input
              id="projectType"
              placeholder="e.g., Website Redesign"
              value={formData.projectType}
              onChange={(e) => updateField("projectType", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="projectDescription">Project Description</Label>
          <Textarea
            id="projectDescription"
            placeholder="Tell us about the project scope, deliverables, and timeline..."
            value={formData.projectDescription}
            onChange={(e) => updateField("projectDescription", e.target.value)}
            required
            rows={5}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tone">Proposal Tone 🎭</Label>
            <Select value={formData.tone} onValueChange={(value) => updateField("tone", value)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly & Warm 😊</SelectItem>
                <SelectItem value="formal">Professional & Formal 👔</SelectItem>
                <SelectItem value="persuasive">Persuasive & Bold 💪</SelectItem>
                <SelectItem value="playful">Playful & Creative 🎉</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Estimated Budget (Optional)</Label>
            <Input
              id="budget"
              type="text"
              placeholder="$5,000 - $10,000"
              value={formData.budget}
              onChange={(e) => updateField("budget", e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" variant="hero" size="xl" className="w-full">
          <Sparkles className="mr-2 h-5 w-5" />
          Generate My Winning Proposal
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </form>
    </Card>
  );
};

export default ProposalForm;
