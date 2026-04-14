
import React from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface BreadcrumbNavProps {
  activeTabName: string;
}

export function BreadcrumbNav({ activeTabName }: BreadcrumbNavProps) {
  const { currentLanguage } = useTranslation();
  const shouldTranslate = currentLanguage !== 'EN';

  return (
    <div className="mb-4 sm:mb-6 overflow-x-auto hide-scrollbar">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-nowrap items-center">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap text-sm md:text-base">
              {shouldTranslate ? <TranslateText text="Home" language={currentLanguage} /> : "Home"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="mx-2 text-gray-400">&gt;</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/travel" className="text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap text-sm md:text-base">
              {shouldTranslate ? <TranslateText text="Travel Information" language={currentLanguage} /> : "Travel Information"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="mx-2 text-gray-400">&gt;</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-blue-500 whitespace-nowrap text-sm md:text-base">
              {shouldTranslate ? 
                <TranslateText text={activeTabName} language={currentLanguage} /> : 
                activeTabName
              }
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
