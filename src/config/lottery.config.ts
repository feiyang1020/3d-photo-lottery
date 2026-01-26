/**
 * Lottery Configuration
 * 抽奖配置文件
 */

export interface Participant {
  id: string;
  name: string;
  photo: string;
  department?: string;
}

export interface PrizeLevel {
  key: string;
  labelZh: string;
  labelEn: string;
  count: number;
}

export interface LotteryConfig {
  // API Configuration | API 配置
  api: {
    enabled: boolean;
    baseUrl: string;
    endpoints: {
      getUsers: string;
      drawUsers: string;
    };
  };

  // Prize Levels | 奖项等级
  prizeLevels: PrizeLevel[];

  // UI Configuration | 界面配置
  ui: {
    title: {
      zh: string;
      en: string;
    };
    logo?: string;
    backgroundColor: string;
    particleCount: number;
  };
}

// Default Configuration | 默认配置
export const defaultConfig: LotteryConfig = {
  api: {
    enabled: false, // Set to true to use API | 设为 true 使用 API
    baseUrl: 'https://your-api.com',
    endpoints: {
      getUsers: '/api/lottery/users',
      drawUsers: '/api/lottery/draw',
    },
  },

  prizeLevels: [
    { key: 'random1', labelZh: '1人', labelEn: '1 Person', count: 1 },
    { key: 'random2', labelZh: '2人', labelEn: '2 People', count: 2 },
    { key: 'random3', labelZh: '3人', labelEn: '3 People', count: 3 },
    { key: 'random5', labelZh: '5人', labelEn: '5 People', count: 5 },
    { key: 'random10', labelZh: '10人', labelEn: '10 People', count: 10 },
  ],

  ui: {
    title: {
      zh: '年会抽奖',
      en: 'Lucky Draw',
    },
    logo: '/logo.png',
    backgroundColor: '#144c7f',
    particleCount: 7000,
  },
};

export default defaultConfig;
