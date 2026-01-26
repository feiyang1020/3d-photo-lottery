import { Participant } from '@/config/lottery.config';
import defaultParticipants from '@/data/participants.json';
import lotteryConfig from '@/config/lottery.config';

/**
 * Lottery Service
 * Handles data fetching from API or local data
 */
class LotteryService {
  private drawnIds: Set<string> = new Set();

  /**
   * Get all participants
   */
  async getParticipants(): Promise<Participant[]> {
    if (lotteryConfig.api.enabled) {
      try {
        const response = await fetch(
          `${lotteryConfig.api.baseUrl}${lotteryConfig.api.endpoints.getUsers}`
        );
        if (!response.ok) {
          throw new Error('API request failed');
        }
        return response.json();
      } catch (error) {
        console.warn('API failed, falling back to local data:', error);
        return defaultParticipants as Participant[];
      }
    }
    return defaultParticipants as Participant[];
  }

  /**
   * Get available (not yet drawn) participants
   */
  async getAvailableParticipants(): Promise<Participant[]> {
    const all = await this.getParticipants();
    return all.filter((p) => !this.drawnIds.has(p.id));
  }

  /**
   * Draw random winners
   */
  async drawWinners(count: number): Promise<Participant[]> {
    if (lotteryConfig.api.enabled) {
      try {
        const response = await fetch(
          `${lotteryConfig.api.baseUrl}${lotteryConfig.api.endpoints.drawUsers}?count=${count}`
        );
        if (!response.ok) {
          throw new Error('API request failed');
        }
        const winners: Participant[] = await response.json();
        winners.forEach((w) => this.drawnIds.add(w.id));
        return winners;
      } catch (error) {
        console.warn('API failed, using local draw:', error);
        return this.localDraw(count);
      }
    }
    return this.localDraw(count);
  }

  /**
   * Local random draw
   */
  private async localDraw(count: number): Promise<Participant[]> {
    const available = await this.getAvailableParticipants();
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const winners = shuffled.slice(0, Math.min(count, shuffled.length));
    winners.forEach((w) => this.drawnIds.add(w.id));
    return winners;
  }

  /**
   * Reset drawn list
   */
  reset(): void {
    this.drawnIds.clear();
  }

  /**
   * Get drawn IDs
   */
  getDrawnIds(): string[] {
    return Array.from(this.drawnIds);
  }

  /**
   * Set drawn IDs (for restoring state)
   */
  setDrawnIds(ids: string[]): void {
    this.drawnIds = new Set(ids);
  }
}

export const lotteryService = new LotteryService();
export default lotteryService;
