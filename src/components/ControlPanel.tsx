'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLotteryStore } from '@/store/lottery-store';
import { defaultConfig } from '@/config/lottery.config';
import { useLocale } from 'next-intl';

interface ControlPanelProps {
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onContinue: () => void;
}

export default function ControlPanel({ onStart, onStop, onReset, onContinue }: ControlPanelProps) {
  const t = useTranslations('lottery');
  const tPrizes = useTranslations('prizes');
  const locale = useLocale();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { status, selectedPrize, setSelectedPrize, participants, drawnIds } =
    useLotteryStore();

  const remainingCount = participants.length - drawnIds.length;
  const isIdle = status === 'idle';
  const isRolling = status === 'rolling';
  const isStopped = status === 'stopped';

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Get prize count
  const getCurrentPrizeCount = () => {
    const prize = defaultConfig.prizeLevels.find((p) => p.key === selectedPrize);
    return prize?.count || 1;
  };

  // 基础按钮样式
  const baseButtonClass = `
    relative p-3 rounded-lg font-semibold text-base
    transition-all duration-300 ease-out
    backdrop-blur-md
    border border-white/20
    shadow-lg shadow-black/20
    hover:shadow-xl hover:shadow-black/30
    hover:border-white/40
    hover:-translate-y-0.5
    active:translate-y-0 active:shadow-md
    disabled:opacity-40 disabled:cursor-not-allowed 
    disabled:hover:translate-y-0 disabled:hover:shadow-lg
    disabled:hover:border-white/20
  `;

  // 统一按钮样式
  const buttonClass = `
    ${baseButtonClass}
    bg-white/10
    text-white/90
    hover:bg-white/20
    hover:text-white
  `;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      {/* 玻璃态容器 */}
      <div className="flex items-center gap-3 px-6 py-4 
        bg-slate-900/40 backdrop-blur-xl 
        rounded-2xl border border-white/10
        shadow-2xl shadow-black/30">
        
        {/* Prize selector */}
        <div className="relative">
          <select
            value={selectedPrize}
            onChange={(e) => setSelectedPrize(e.target.value)}
            disabled={isRolling}
            className="appearance-none px-5 py-2.5 pr-10
              bg-white/10
              text-white font-semibold text-base
              rounded-lg border border-white/20
              outline-none cursor-pointer
              shadow-lg shadow-black/20
              transition-all duration-300
              hover:bg-white/20
              hover:border-white/40
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {defaultConfig.prizeLevels.map((prize) => (
              <option key={prize.key} value={prize.key} className="bg-slate-800 text-white">
                {locale === 'zh' ? prize.labelZh : prize.labelEn}
              </option>
            ))}
          </select>
          {/* 下拉箭头 */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="w-px h-8 bg-white/20"></div>

        {/* Start button */}
        <button
          onClick={onStart}
          disabled={!isIdle || remainingCount === 0}
          className={buttonClass}
          title={t('start')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Stop button */}
        <button
          onClick={onStop}
          disabled={!isRolling}
          className={`${buttonClass} ${isRolling ? 'animate-pulse' : ''}`}
          title={t('stop')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        </button>

        {/* Continue button */}
        <button
          onClick={onContinue}
          disabled={!isStopped}
          className={buttonClass}
          title={t('continue')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Reset button */}
        <button
          onClick={onReset}
          disabled={isRolling}
          className={buttonClass}
          title={t('reset')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* 分隔线 */}
        <div className="w-px h-8 bg-white/20"></div>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className={buttonClass}
          title={isFullscreen ? t('exitFullscreen') : t('fullscreen')}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>

        {/* 分隔线 */}
        <div className="w-px h-8 bg-white/20"></div>

        {/* Remaining count */}
        <div className="flex items-center gap-2 px-4 py-2 
          bg-white/5 rounded-lg border border-white/10">
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-white font-bold text-lg min-w-[2rem] text-center">{remainingCount}</span>
        </div>
      </div>
    </div>
  );
}
