
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar } from "@/components/ui/avatar";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface TestimonialCardProps {
  date: string;
  location: string;
  title: string;
  content: string;
  personName: string;
  personRole: string;
  personImage: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  date,
  location,
  title,
  content,
  personName,
  personRole,
  personImage,
}) => {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();

  // Special case for Japanese translations for Takashi Ito
  const getJapaneseContent = () => {
    if (currentLanguage === "JP" && personName === "Takashi Ito") {
      return "カルタゴの廃墣を歩いていると鳥肌が立ちました。現地のガイドは何でも知っていました - そして食べ物！あの辛いハリッサはコーヒーよりも私を目覚めさせました。教育と冒険の完璧な組み合わせです。";
    }
    return content;
  };

  const getJapaneseTitle = () => {
    if (currentLanguage === "JP" && personName === "Takashi Ito") {
      return "今まで受けた最高の歴史の授業";
    }
    return title;
  };

  if (isMobile) {
    return (
      <div className="bg-[#F6F7FB] rounded-xl p-5">
        <div className="flex items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-[60px] h-[60px] rounded-[20px]">
              <img 
                src={personImage} 
                alt={personName} 
                className="w-full h-full object-cover rounded-[20px]"
              />
            </Avatar>
            <div>
              <p className="text-lg font-semibold">
                <TranslateText text={personName} language={currentLanguage} />
              </p>
              <p className="text-sm text-gray-600">
                {currentLanguage === "JP" && personRole === "Japanese" ? "日本人" : 
                  <TranslateText text={personRole} language={currentLanguage} />
                }
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-2">
          <p className="text-[#9BB0D6] text-sm">
            <TranslateText text={date} language={currentLanguage} />
          </p>
          <h3 className="text-[#1F1F20] text-xl font-semibold mt-2">
            {currentLanguage === "JP" && personName === "Takashi Ito" ? 
              getJapaneseTitle() : 
              <TranslateText text={title} language={currentLanguage} />
            }
          </h3>
        </div>
        
        <div className="text-[#1F1F20] text-base font-light leading-6 mb-3">
          {currentLanguage === "JP" && personName === "Takashi Ito" ? 
            getJapaneseContent() : 
            <TranslateText text={content} language={currentLanguage} />
          }
        </div>
        
        <div className="flex justify-end">
          <div className="bg-blue-500 text-white px-3 py-1 text-xs rounded-3xl">
            <TranslateText text={location} language={currentLanguage} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start">
      {/* Profile section with reduced left spacing */}
      <div className="w-[15%] pr-4">
        <div className="flex flex-col items-center text-[#1F1F20]">
          <div className="w-[130px] aspect-square rounded-[34px]">
            <img 
              src={personImage} 
              alt={personName} 
              className="w-full h-full object-cover rounded-[34px]"
            />
          </div>
          <p className="text-lg font-normal mt-2 text-center">
            {currentLanguage === "JP" && personRole === "Japanese" ? "日本人" : 
              <TranslateText text={personRole} language={currentLanguage} />
            }
          </p>
          <p className="text-xl font-semibold mt-2 text-center">
            <TranslateText text={personName} language={currentLanguage} />
          </p>
        </div>
      </div>

      {/* Testimonial content with increased width to balance spacing */}
      <div className="w-[85%] bg-[#F6F7FB] rounded-xl p-6 md:p-10">
        <div className="flex justify-between items-center flex-wrap gap-5">
          <p className="text-[#9BB0D6] text-lg">
            <TranslateText text={date} language={currentLanguage} />
          </p>
          <div className="bg-blue-500 text-white px-6 py-2 rounded-3xl">
            {currentLanguage === "JP" && location === "Carthage, Tunisia" ? 
              "カルタゴ、チュニジア" : 
              <TranslateText text={location} language={currentLanguage} />
            }
          </div>
        </div>
        
        <h3 className="text-[#1F1F20] text-2xl font-semibold mt-6">
          {currentLanguage === "JP" && personName === "Takashi Ito" ? 
            getJapaneseTitle() : 
            <TranslateText text={title} language={currentLanguage} />
          }
        </h3>
        
        <div className="mt-4 text-[#1F1F20] text-xl font-light leading-7">
          {currentLanguage === "JP" && personName === "Takashi Ito" ? 
            getJapaneseContent() : 
            <TranslateText text={content} language={currentLanguage} />
          }
        </div>
      </div>
    </div>
  );
};

export function TestimonialsSection(): JSX.Element {
  const { currentLanguage } = useTranslation();
  
  const testimonials = [
    {
      date: "2023.06.15",
      location: "Sidi Bou Said, Tunisia",
      title: "I felt so safe traveling alone here!",
      content: "Never expected Tunisia to be this welcoming! The women looked out for me, the food was amazing (try the brik!), and those blue-and-white streets were magical. Already planning my next trip!",
      personName: "Ji-Won Park",
      personRole: "South Korean",
      personImage: "https://cdn.builder.io/api/v1/image/assets/62d9bdcbd9e942429261da212732eafc/f3b9cbcbf0f8a0b210578454bb4c403751d8fced"
    },
    {
      date: "2023.09.22",
      location: "Carthage, Tunisia",
      title: "Best history lesson I've ever had",
      content: "Walking through Carthage's ruins gave me chills. The local guides knew everything - and the food! That spicy harissa woke me up better than coffee. Perfect mix of education and adventure.",
      personName: "Takashi Ito",
      personRole: "Japanese",
      personImage: "https://cdn.builder.io/api/v1/image/assets/62d9bdcbd9e942429261da212732eafc/883ca7180b5a4e36831ed56a5ffb939a50862218"
    },
    {
      date: "2023.11.08",
      location: "Douz, Tunisia",
      title: "This country surprised me every day",
      content: "From desert sunsets to Mediterranean beaches, Tunisia kept amazing me. The people were so proud to share their culture. Pro tip: bargain with a smile in the souks - it's all part of the fun!",
      personName: "Seung-Ho Kim",
      personRole: "South Korean",
      personImage: "https://cdn.builder.io/api/v1/image/assets/62d9bdcbd9e942429261da212732eafc/9595977f7bde2b15c505deb3b86cdb78efcb70fa"
    }
  ];

  return (
    <div className="flex flex-col items-center w-full bg-white font-inter">
      <div className="w-full max-w-[1200px] rounded-[10px] shadow-[0px_0px_0px_1.956px_rgba(0,0,0,0.05)] p-[24px] md:p-[32px] lg:p-[42px]">
        <div className="flex flex-col mb-6 md:mb-8">
          <div className="text-[#347EFF] text-[16px] md:text-[18px] lg:text-[20px] text-left">
            {currentLanguage === "JP" ? "お客様の声" : 
              <TranslateText text="Testimonials" language={currentLanguage} />
            }
          </div>
          <div className="text-[#1F1F20] text-[22px] md:text-[28px] lg:text-[36px] font-semibold leading-tight text-left">
            {currentLanguage === "JP" ? "アトランティスでのチュニジア旅行について人々が語っていること" : 
              <TranslateText text="What People Say About Traveling to Tunisia With Atlantis" language={currentLanguage} />
            }
          </div>
        </div>

        <div className="mt-6 md:mt-12 space-y-6 md:space-y-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              date={testimonial.date}
              location={testimonial.location}
              title={testimonial.title}
              content={testimonial.content}
              personName={testimonial.personName}
              personRole={testimonial.personRole}
              personImage={testimonial.personImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestimonialsSection;
