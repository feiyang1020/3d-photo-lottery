'use client';

import { useTranslations } from 'next-intl';
import { useLotteryStore } from '@/store/lottery-store';
import Image from 'next/image';

export default function WinnerDisplay() {
  const t = useTranslations('lottery');
  const { currentWinners, status } = useLotteryStore();

  if (currentWinners.length === 0 || status === 'rolling') {
    return null;
  }

  const getGridClass = () => {
    const count = currentWinners.length;
    if (count === 1) return 'grid-cols-1 max-w-xs';
    if (count === 2) return 'grid-cols-2 max-w-lg';
    if (count <= 4) return 'grid-cols-2 max-w-2xl';
    return 'grid-cols-3 md:grid-cols-5 max-w-5xl';
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div
        className={`grid gap-4 p-4 ${getGridClass()} pointer-events-auto`}
      >
        {currentWinners.map((winner, index) => (
          <div
            key={winner.id}
            className="relative bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden animate-zoomIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="aspect-square relative">
              <Image
                src={winner.photo}
                alt={winner.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center py-2 px-2">
              <p className="text-lg font-bold truncate">{winner.name}</p>
              {winner.department && (
                <p className="text-sm text-gray-300 truncate">{winner.department}</p>
              )}
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 animate-glow pointer-events-none border-2 border-white/50 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
