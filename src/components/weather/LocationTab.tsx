
import React from "react";

type LocationTabProps = {
  name: string;
  region: string;
  isActive: boolean;
  onClick: () => void;
};

export const LocationTab = ({ name, region, isActive, onClick }: LocationTabProps) => (
  <div className="flex-shrink">
    <div 
      className={`rounded-[12px] border px-3 py-[12px] cursor-pointer transition-colors duration-300 ${
        isActive 
          ? "bg-[#347EFF] border-[#6AA0FF] shadow-md" 
          : "bg-white border-[#C0D6FB] hover:bg-blue-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-[10px]">
        <svg width="22" height="22" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[22px] h-[22px]">
          <g clipPath="url(#clip0_location)">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.4789 14.5201C13.3391 14.5201 14.1641 14.1654 14.7725 13.5339C15.3809 12.9024 15.723 12.0458 15.7234 11.1525C15.7234 10.2589 15.3816 9.40191 14.7731 8.77005C14.1646 8.13818 13.3394 7.7832 12.4789 7.7832C11.6184 7.7832 10.7931 8.13818 10.1847 8.77005C9.57621 9.40191 9.23438 10.2589 9.23438 11.1525C9.23481 12.0458 9.57683 12.9024 10.1852 13.5339C10.7937 14.1654 11.6187 14.5201 12.4789 14.5201Z" 
            stroke={isActive ? "white" : "#347EFF"} strokeWidth="1.74836" strokeLinecap="square"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M22.2131 11.1514C22.2131 19.5696 14.1019 24.6202 12.4796 24.6202C10.8574 24.6202 2.74609 19.5696 2.74609 11.1514C2.74781 8.47182 3.77407 5.90258 5.59927 4.00844C7.42447 2.1143 9.89924 1.05029 12.4796 1.05029C17.8541 1.05029 22.2131 5.57357 22.2131 11.1514Z" 
            stroke={isActive ? "white" : "#347EFF"} strokeWidth="1.74836" strokeLinecap="square"></path>
          </g>
          <defs>
            <clipPath id="clip0_location">
              <rect width="24.3338" height="25.2697" fill="white" transform="translate(0.3125 0.206055)"></rect>
            </clipPath>
          </defs>
        </svg>
        <div className={`font-inter ${isActive ? "text-white" : "text-[#1F1F20]"}`}>
          <span className={`${isActive ? "font-bold" : "font-normal"} text-[16px]`}>{name}</span>
          <span className="font-normal text-[14px] ml-1">({region})</span>
        </div>
      </div>
    </div>
  </div>
);
