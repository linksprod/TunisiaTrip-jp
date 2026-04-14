
import { useState, useEffect } from 'react';

interface PlaceholderSuggestion {
  en: string;
  jp: string;
}

const placeholderSuggestions: PlaceholderSuggestion[] = [
  { en: 'Explore Djerba beaches...', jp: 'ジェルバのビーチを探索...' },
  { en: 'Visit El Jem amphitheater...', jp: 'エルジェム円形劇場を訪問...' },
  { en: 'Discover Tunis medina...', jp: 'チュニスのメディナを発見...' },
  { en: 'Experience Sahara desert...', jp: 'サハラ砂漠を体験...' },
  { en: 'Find Star Wars locations...', jp: 'スターウォーズの撮影地を探す...' },
  { en: 'Book hotels in Sousse...', jp: 'スースのホテルを予約...' },
  { en: 'Roman ruins in Dougga...', jp: 'ドゥッガのローマ遺跡...' },
  { en: 'Traditional crafts in Kairouan...', jp: 'カイルアンの伝統工芸...' },
  { en: 'Mountain oases adventure...', jp: '山のオアシス冒険...' },
  { en: 'Mediterranean cuisine...', jp: '地中海料理...' },
  { en: 'Desert camping tours...', jp: '砂漠キャンプツアー...' },
  { en: 'Ancient Carthage history...', jp: '古代カルタゴの歴史...' },
  { en: 'Berber villages exploration...', jp: 'ベルベル村の探索...' },
  { en: 'Museums and galleries...', jp: '博物館とギャラリー...' },
  { en: 'Transportation options...', jp: '交通オプション...' }
];

export const useDynamicPlaceholder = (language: string) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    const updatePlaceholder = () => {
      const suggestion = placeholderSuggestions[currentIndex];
      setPlaceholder(language === 'JP' ? suggestion.jp : suggestion.en);
    };

    updatePlaceholder();
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % placeholderSuggestions.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, language]);

  return placeholder;
};
