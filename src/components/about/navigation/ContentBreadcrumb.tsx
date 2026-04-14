
import { useTranslation } from "@/hooks/use-translation";
import { TranslateText } from "@/components/translation/TranslateText";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ContentBreadcrumbProps {
  activeTab: string;
}

export function ContentBreadcrumb({ activeTab }: ContentBreadcrumbProps) {
  const { currentLanguage } = useTranslation();

  const getActiveTabName = () => {
    if (currentLanguage === "JP") {
      switch(activeTab) {
        case 'overview': return "チュニジアの概要";
        case 'location': return "国の位置";
        case 'weather': return "チュニジアの天気";
        case 'languages': return "使用言語";
        case 'religions': return "宗教";
        default: return "チュニジアの概要";
      }
    }
    
    const labels: Record<string, string> = {
      'overview': 'Overview & Culture',
      'location': 'Country Location',
      'weather': 'Tunisian Weather',
      'languages': 'Spoken Languages',
      'religions': 'Practiced Religions'
    };
    
    return labels[activeTab] || 'Overview & Culture';
  };

  return (
    <div className="mb-4 sm:mb-6 overflow-x-auto hide-scrollbar">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-nowrap items-center">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap text-sm md:text-base">
              <TranslateText text="Home" language={currentLanguage} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="mx-2 text-gray-400">&gt;</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/about" className="text-gray-500 hover:text-blue-500 transition-colors whitespace-nowrap text-sm md:text-base">
              <TranslateText text="About Tunisia" language={currentLanguage} />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="mx-2 text-gray-400">&gt;</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-blue-500 whitespace-nowrap text-sm md:text-base">
              {getActiveTabName()}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
