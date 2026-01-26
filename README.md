# 3D Photo Lottery 🎰

A stunning 3D photo lottery/lucky draw application with rotating avatar sphere effects. Perfect for annual parties, company events, and giveaways.

一个炫酷的 3D 照片抽奖应用，支持头像球体旋转效果。适用于年会抽奖、公司活动、线下抽奖等场景。

## Features | 功能特性

- ✨ **3D Particle Effects** - Beautiful floating particle animation with participant avatars
- 🌍 **i18n Support** - Chinese and English language support
- ⚙️ **Configurable** - Easy to customize prizes, participants, and API endpoints
- 📱 **Responsive** - Works on desktop and mobile devices
- 💾 **State Persistence** - Drawn winners are saved across browser sessions
- 🎯 **Multiple Prize Levels** - Support for multiple prize tiers and random draws

## Quick Start | 快速开始

### Installation | 安装

```bash
# Clone the repository
git clone https://github.com/your-username/3d-photo-lottery.git
cd 3d-photo-lottery

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build | 构建

```bash
pnpm build
pnpm start
```

## Configuration | 配置

### Data Source | 数据源

By default, the app uses local JSON data at `src/data/participants.json`. You can:

1. **Edit local data** - Modify `src/data/participants.json` with your participants
2. **Use API** - Enable API mode in `src/config/lottery.config.ts`

默认使用 `src/data/participants.json` 中的本地数据。你可以：

1. **编辑本地数据** - 修改 `src/data/participants.json` 添加参与者
2. **使用 API** - 在 `src/config/lottery.config.ts` 中启用 API 模式

### Participant Data Format | 参与者数据格式

```json
{
  "id": "1",
  "name": "张三",
  "photo": "/avatars/avatar1.svg",
  "department": "技术部"
}
```

### API Configuration | API 配置

Edit `src/config/lottery.config.ts`:

```typescript
export const defaultConfig: LotteryConfig = {
  api: {
    enabled: true,  // Set to true to use API
    baseUrl: 'https://your-api.com',
    endpoints: {
      getUsers: '/api/lottery/users',      // GET - Returns participant list
      drawUsers: '/api/lottery/draw',      // GET ?count=N - Returns N random winners
    },
  },
  // ...
};
```

### Prize Levels | 奖项配置

```typescript
prizeLevels: [
  { key: 'special', labelZh: '特等奖', labelEn: 'Grand Prize', count: 1 },
  { key: 'first', labelZh: '一等奖', labelEn: 'First Prize', count: 1 },
  // Add more prize levels...
],
```

## Project Structure | 项目结构

```
lottery-3d/
├── src/
│   ├── app/
│   │   ├── [locale]/        # i18n routing
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── LotteryScene.tsx    # 3D particle scene
│   │   ├── LotteryClient.tsx   # Main client component
│   │   ├── ControlPanel.tsx    # Control buttons
│   │   ├── WinnerDisplay.tsx   # Winner showcase
│   │   ├── WinnersList.tsx     # Winners history
│   │   └── LanguageSwitcher.tsx
│   ├── config/
│   │   └── lottery.config.ts   # Configuration
│   ├── data/
│   │   └── participants.json   # Default participants
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── request.ts
│   │   └── messages/
│   │       ├── zh.json
│   │       └── en.json
│   ├── lib/
│   │   └── lottery-service.ts  # Data service
│   └── store/
│       └── lottery-store.ts    # State management
├── public/
│   └── avatars/                # Default avatar images
└── package.json
```

## API Endpoints | API 接口

If using API mode, your backend should implement:

### GET /api/lottery/users

Returns all participants:

```json
[
  { "id": "1", "name": "张三", "photo": "https://...", "department": "技术部" },
  { "id": "2", "name": "李四", "photo": "https://...", "department": "产品部" }
]
```

### GET /api/lottery/draw?count=N

Returns N random winners:

```json
[
  { "id": "1", "name": "张三", "photo": "https://...", "department": "技术部" }
]
```

## Tech Stack | 技术栈

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **3D Graphics**: Three.js + React Three Fiber
- **State Management**: Zustand
- **i18n**: next-intl
- **Styling**: Tailwind CSS

## License | 许可证

MIT License

## Contributing | 贡献

Pull requests are welcome! Please open an issue first to discuss what you would like to change.

欢迎提交 PR！请先开 issue 讨论你想要修改的内容。
