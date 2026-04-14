
export interface SEOKeyword {
  text: string;
  category: 'core' | 'destination' | 'long-tail';
  priority: number;
  isActive: boolean;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string[];
  ogImage: OpenGraphImage;
}

export interface OpenGraphImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface PageSEOFormValues {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
}

export interface GeneralSEOFormValues {
  title: string;
  description: string;
  ogImage: string;
}

export interface LanguageSpecificSEO {
  EN: {
    [key: string]: PageSEOFormValues | GeneralSEOFormValues;
  };
  JP: {
    [key: string]: PageSEOFormValues | GeneralSEOFormValues;
  };
}
