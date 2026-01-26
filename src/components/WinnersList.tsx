'use client';

import { useTranslations } from 'next-intl';
import { useLotteryStore } from '@/store/lottery-store';
import Image from 'next/image';

export default function WinnersList() {
  const t = useTranslations('lottery');
  const { allWinners } = useLotteryStore();

  if (allWinners.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-30 max-w-[160px] max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="space-y-2">
        {allWinners.map((record, groupIndex) => (
          <div key={groupIndex} className="space-y-1">
            <div className="text-cyan-400 text-sm font-bold px-2">
              {record.prize}
            </div>
            {record.winners.map((winner) => (
              <div
                key={winner.id}
                className="flex items-center gap-2 px-2 py-1 bg-black/30 backdrop-blur-sm rounded animate-fadeIn"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400/75 flex-shrink-0">
                  <Image
                    src={winner.photo}
                    alt={winner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-white text-sm truncate">{winner.name}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
