import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Share2,
  Download,
  Sparkles,
  Github,
  ArrowRight,
  Zap,
  Image as ImageIcon,
} from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
}

const steps: Step[] = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "1. Generate from Text",
    description: "Start with promotional copy",
    details: [
      "Navigate to 'Generate Text' from the sidebar",
      "Paste your promotional text (e.g., 'Weekend sale! 50% off everything')",
      "Select duration (15s, 30s, or 60s)",
      "Choose voice style and music style",
      "Click 'Generate Ad' and wait for AI processing",
    ],
  },
  {
    icon: <ImageIcon className="w-8 h-8" />,
    title: "2. Or Generate from Image",
    description: "Upload a promotional poster",
    details: [
      "Navigate to 'Generate Image' from the sidebar",
      "Upload a promotional poster or flyer image",
      "AI will automatically extract text from the image",
      "Customize voice and music settings",
      "Click 'Generate Ad' to create your audio",
    ],
  },
  {
    icon: <Download className="w-8 h-8" />,
    title: "3. Download Your Ad",
    description: "Save as MP3 for easy distribution",
    details: [
      "Once generation is complete, listen to the preview",
      "Review the generated script in the output section",
      "Click 'Download MP3' to save your ad locally",
      "File saves as 'promo-voice-[ID].mp3'",
      "Ready to use in your marketing campaigns",
    ],
  },
  {
    icon: <Share2 className="w-8 h-8" />,
    title: "4. Share Everywhere",
    description: "Multi-channel distribution made easy",
    details: [
      "Upload to YouTube as background music for videos",
      "Add to podcast platforms (Spotify, Apple Podcasts, etc.)",
      "Use in social media videos (TikTok, Instagram, Facebook)",
      "Embed in email marketing campaigns",
      "Share directly via messaging or cloud storage",
    ],
  },
  {
    icon: <Github className="w-8 h-8" />,
    title: "5. GitHub Integration",
    description: "Open source and collaborative",
    details: [
      "Source code available on GitHub",
      "Fork and customize for your needs",
      "Contribute improvements via pull requests",
      "Built with React, Node.js, and OpenAI APIs",
      "Licensed under MIT for commercial use",
    ],
  },
];

export default function TutorialPage() {
  const [expandedStep, setExpandedStep] = useState<number>(0);

  return (
    <div className="flex flex-col flex-1 overflow-auto lg:mt-0 mt-16">
      <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">How to Use PromoVoice</h1>
          <p className="text-lg text-muted-foreground">
            Create professional AI voice ads in 5 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="cursor-pointer transition-all hover:border-primary/50"
                onClick={() =>
                  setExpandedStep(expandedStep === index ? -1 : index)
                }
                data-testid={`tutorial-step-${index + 1}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-primary mt-1">{step.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {step.title}
                        <ArrowRight
                          className={`w-5 h-5 transition-transform ${
                            expandedStep === index ? "rotate-90" : ""
                          }`}
                        />
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded Details */}
                {expandedStep === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CardContent className="border-t pt-6">
                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-foreground/90">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
        >
          <div className="flex items-start gap-4">
            <Sparkles className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-foreground/80 mb-6">
                Create your first professional AI voice ad in seconds. Choose between
                text or image input, customize your settings, and download immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" data-testid="button-try-text">
                  <Zap className="w-5 h-5 mr-2" />
                  Try Text Generation
                </Button>
                <Button size="lg" variant="outline" data-testid="button-try-image">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Try Image Upload
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "What audio formats are supported?",
                a: "Generated ads are delivered as MP3 files, compatible with all platforms and devices.",
              },
              {
                q: "Can I edit the generated script?",
                a: "The script is generated by AI based on your input. For custom edits, regenerate with different input text.",
              },
              {
                q: "How long does generation take?",
                a: "Typically 30-60 seconds depending on ad length. Complex scripts may take a bit longer.",
              },
              {
                q: "Can I use ads commercially?",
                a: "Yes! Your generated ads are yours to use for any purpose, including commercial campaigns.",
              },
              {
                q: "Is there a limit to how many ads I can create?",
                a: "No limit! Create as many ads as you need.",
              },
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div className="h-12" />
      </div>
    </div>
  );
}
