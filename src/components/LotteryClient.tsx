'use client';

import { useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { useLotteryStore } from '@/store/lottery-store';
import { lotteryService } from '@/lib/lottery-service';
import ControlPanel from '@/components/ControlPanel';
import WinnerDisplay from '@/components/WinnerDisplay';
import WinnersList from '@/components/WinnersList';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { defaultConfig } from '@/config/lottery.config';

// Dynamic import for Three.js scene (client-side only)
const LotteryScene = dynamic(() => import('@/components/LotteryScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#144c7f] flex items-center justify-center">
      <div className="text-white text-2xl animate-pulse">Loading...</div>
    </div>
  ),
});

export default function LotteryClient() {
  const t = useTranslations('lottery');
  const tPrizes = useTranslations('prizes');
  const locale = useLocale();

  const {
    status,
    setStatus,
    participants,
    setParticipants,
    drawnIds,
    addDrawnIds,
    resetDrawnIds,
    currentWinners,
    setCurrentWinners,
    clearCurrentWinners,
    allWinners,
    addWinners,
    clearAllWinners,
    selectedPrize,
    isLoading,
    setIsLoading,
  } = useLotteryStore();

  // Load participants on mount
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const data = await lotteryService.getParticipants();
        setParticipants(data);
        // Restore drawn IDs
        lotteryService.setDrawnIds(drawnIds);
      } catch (error) {
        console.error('Failed to load participants:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadParticipants();
  }, []);

  // Get current prize label
  const getPrizeLabel = useCallback(() => {
    const prize = defaultConfig.prizeLevels.find((p) => p.key === selectedPrize);
    if (!prize) return '';
    return locale === 'zh' ? prize.labelZh : prize.labelEn;
  }, [selectedPrize, locale]);

  // Get prize count
  const getPrizeCount = useCallback(() => {
    const prize = defaultConfig.prizeLevels.find((p) => p.key === selectedPrize);
    return prize?.count || 1;
  }, [selectedPrize]);

  // Start lottery
  const handleStart = useCallback(() => {
    if (status !== 'idle') return;
    clearCurrentWinners();
    setStatus('rolling');
  }, [status, setStatus, clearCurrentWinners]);

  // Stop lottery and pick winners
  const handleStop = useCallback(async () => {
    if (status !== 'rolling') return;

    const count = getPrizeCount();
    const availableCount = participants.length - drawnIds.length;

    if (availableCount === 0) {
      setStatus('idle');
      return;
    }

    const actualCount = Math.min(count, availableCount);
    const winners = await lotteryService.drawWinners(actualCount);

    setCurrentWinners(winners);
    addDrawnIds(winners.map((w) => w.id));
    addWinners(getPrizeLabel(), winners);
    setStatus('stopped');
  }, [
    status,
    setStatus,
    getPrizeCount,
    participants.length,
    drawnIds.length,
    setCurrentWinners,
    addDrawnIds,
    addWinners,
    getPrizeLabel,
  ]);

  // Reset
  const handleReset = useCallback(() => {
    lotteryService.reset();
    resetDrawnIds();
    clearCurrentWinners();
    clearAllWinners();
    setStatus('idle');
  }, [setStatus, resetDrawnIds, clearCurrentWinners, clearAllWinners]);

  // Continue
  const handleContinue = useCallback(() => {
    clearCurrentWinners();
    setStatus('idle');
  }, [setStatus, clearCurrentWinners]);

  // Auto continue when stopped - give more time to see winner effect
  useEffect(() => {
    if (status === 'stopped' && currentWinners.length > 0) {
      // 不自动继续，让用户手动点击继续
      // const timer = setTimeout(() => {
      //   setStatus('idle');
      // }, 5000);
      // return () => clearTimeout(timer);
    }
  }, [status, currentWinners.length, setStatus]);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-[#144c7f] flex items-center justify-center">
        <div className="text-white text-4xl animate-pulse">{t('loading')}...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 3D Scene */}
      <LotteryScene participants={participants} />

      {/* Control Panel */}
      <ControlPanel
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onContinue={handleContinue}
      />

      {/* Winner Display */}
      <WinnerDisplay />

      {/* Winners List */}
      <WinnersList />

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Logo */}
      {defaultConfig.ui.logo && (
        <div className="fixed top-[5%] left-[5%] z-20 animate-float">
          <div className="text-white text-2xl font-bold">
            {locale === 'zh' ? defaultConfig.ui.title.zh : defaultConfig.ui.title.en}
          </div>
        </div>
      )}
    </div>
  );
}
