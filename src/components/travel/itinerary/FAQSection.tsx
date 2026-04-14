
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQItem } from "./types";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface FAQSectionProps {
  faqItems: FAQItem[];
}

export function FAQSection({ faqItems }: FAQSectionProps) {
  const { currentLanguage } = useTranslation();

  return (
    <section className="mt-16 mb-12">
      <div className="w-full bg-white font-inter rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="text-blue-500 text-xl mb-3 font-medium">
          <TranslateText text="FAQ" language={currentLanguage} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          <TranslateText 
            text="Frequently Asked Questions about Atlantis Voyages" 
            language={currentLanguage} 
          />
        </h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gray-50 rounded-lg overflow-hidden border-none"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline bg-[#F6F8FB] text-gray-900 font-medium rounded-lg">
                <span className="text-lg sm:text-xl">
                  <TranslateText text={item.question} language={currentLanguage} />
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 py-4 text-gray-700">
                <div className="flex gap-8">
                  <div className="w-2 bg-blue-500 rounded-full"></div>
                  <p className="text-base sm:text-lg font-light leading-relaxed">
                    <TranslateText text={item.answer} language={currentLanguage} />
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
