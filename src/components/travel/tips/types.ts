
export interface TipSlide {
  category: string;
  title: string;
  content: string;
  image: string;
}

export interface TipContentProps {
  slide: TipSlide;
}

export interface TipCircleProps {
  isActive?: boolean;
  image?: string;
  category?: string;
  onClick: () => void;
}
