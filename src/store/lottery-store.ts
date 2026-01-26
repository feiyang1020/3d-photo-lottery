'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participant } from '@/config/lottery.config';

export type LotteryStatus = 'idle' | 'rolling' | 'stopped';

interface LotteryState {
  // Status
  status: LotteryStatus;
  setStatus: (status: LotteryStatus) => void;

  // Participants
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;

  // Drawn IDs
  drawnIds: string[];
  addDrawnIds: (ids: string[]) => void;
  resetDrawnIds: () => void;

  // Current winners
  currentWinners: Participant[];
  setCurrentWinners: (winners: Participant[]) => void;
  clearCurrentWinners: () => void;

  // All winners history
  allWinners: { prize: string; winners: Participant[] }[];
  addWinners: (prize: string, winners: Participant[]) => void;
  clearAllWinners: () => void;

  // Selected prize
  selectedPrize: string;
  setSelectedPrize: (prize: string) => void;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set) => ({
      // Status
      status: 'idle',
      setStatus: (status) => set({ status }),

      // Participants
      participants: [],
      setParticipants: (participants) => set({ participants }),

      // Drawn IDs
      drawnIds: [],
      addDrawnIds: (ids) =>
        set((state) => ({ drawnIds: [...state.drawnIds, ...ids] })),
      resetDrawnIds: () => set({ drawnIds: [] }),

      // Current winners
      currentWinners: [],
      setCurrentWinners: (winners) => set({ currentWinners: winners }),
      clearCurrentWinners: () => set({ currentWinners: [] }),

      // All winners
      allWinners: [],
      addWinners: (prize, winners) =>
        set((state) => ({
          allWinners: [...state.allWinners, { prize, winners }],
        })),
      clearAllWinners: () => set({ allWinners: [], drawnIds: [] }),

      // Selected prize
      selectedPrize: 'fifth',
      setSelectedPrize: (prize) => set({ selectedPrize: prize }),

      // Loading
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'lottery-storage',
      partialize: (state) => ({
        drawnIds: state.drawnIds,
        allWinners: state.allWinners,
      }),
    }
  )
);
