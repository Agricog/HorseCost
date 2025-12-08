import { useState, useEffect } from 'react';
export interface PlayerProgress {
  badges: string[]; // 'Novice', 'Bronze', 'Silver', 'Gold', 'Champion'
  highScore: number;
  gamesPlayed: number;
  unlockedItems: string[]; // Future customization
}
const INITIAL_PROGRESS: PlayerProgress = {
  badges: [],
  highScore: 0,
  gamesPlayed: 0,
  unlockedItems: []
};
export function useProgress() {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const saved = localStorage.getItem('horse-care-progress');
    return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
  });
  useEffect(() => {
    localStorage.setItem('horse-care-progress', JSON.stringify(progress));
  }, [progress]);
  const saveGameResult = (score: number) => {
    setProgress(prev => {
      const newBadges = [...prev.badges];
      let earnedBadge = '';
      if (score >= 1500) earnedBadge = 'Champion';
      else if (score >= 1000) earnedBadge = 'Gold';
      else if (score >= 500) earnedBadge = 'Silver';
      else if (score > 0) earnedBadge = 'Bronze';
      if (earnedBadge && !newBadges.includes(earnedBadge)) {
        newBadges.push(earnedBadge);
      }
      return {
        ...prev,
        highScore: Math.max(prev.highScore, score),
        gamesPlayed: prev.gamesPlayed + 1,
        badges: newBadges
      };
    });
  };
  const hasBadge = (badge: string) => progress.badges.includes(badge);
  return {
    progress,
    saveGameResult,
    hasBadge
  };
}
