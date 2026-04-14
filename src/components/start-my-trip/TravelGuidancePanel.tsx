
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Info, MapPin, Phone, CreditCard, MessageCircle, AlertTriangle } from "lucide-react";
import { getPracticalInfo, getCulturalTips } from "@/utils/culturalGuide";

export function TravelGuidancePanel() {
  const practicalInfo = getPracticalInfo();
  const culturalTips = getCulturalTips('center');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          Tunisia Practical Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="currency">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Currency and Tipping
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{practicalInfo.currency}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recommended tipping:</h4>
                  {practicalInfo.tipping.map((tip, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="language">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Useful Arabic Phrases
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {practicalInfo.usefulPhrases.map((phrase, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="font-medium text-sm">{phrase.english}</div>
                    <div className="text-sm text-gray-600">{phrase.arabic}</div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="emergency">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Emergency Contacts
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {practicalInfo.emergency.map((contact, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{contact}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dress-code">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Dress Codes
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {practicalInfo.dressCode.map((code, index) => (
                  <div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="text-sm text-gray-600">{code}</div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cultural-tips">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Cultural Tips
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {culturalTips.slice(0, 5).map((tip, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3">
                    <h4 className="font-medium text-sm">{tip.category}</h4>
                    <p className="text-sm text-gray-600">{tip.tip}</p>
                    <Badge variant="secondary" className="text-xs mt-1">{tip.importance}</Badge>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
