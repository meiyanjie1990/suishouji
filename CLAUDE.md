# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**随手记** — Mei 的个人 AI 任务提醒 PWA。随便说一句话 → AI 听懂时间 → 到时间手机弹通知提醒。

## 技术架构

- **纯前端单文件** — `index.html` 包含全部 HTML + CSS + JS，无框架、无构建步骤
- **数据存储** — localStorage（`suishouji_tasks`），当前无后端同步
- **AI 解析** — 调用 DeepSeek API（`deepseek-chat` 模型），用自然语言提取任务标题和时间
- **通知机制** — 浏览器 Notification API，每 60 秒检查一次到期任务
- **PWA** — 有 `manifest.json`、Service Worker、可添加到手机主屏幕

## 文件结构

| 文件 | 作用 |
|------|------|
| `index.html` | 全部应用逻辑 |
| `manifest.json` | PWA 配置 |
| `sw.js` | Service Worker，离线缓存 |
| `version.json` | 版本号 |

## 数据结构

```json
{
  "tasks": [
    {
      "id": "t_1712345678_abc123",
      "title": "打电话给何喆妈确认上课时间",
      "dueDate": "2026-07-11T15:00",
      "hasTime": true,
      "status": "pending",
      "rawInput": "明天下午3点给何喆妈打电话",
      "createdAt": "2026-07-10T10:30:00.000Z"
    }
  ]
}
```

- `hasTime`: true = 有具体时间，到点通知；false = 全天任务，9am 提醒
- `status`: pending | done
- `notifiedIds` 存在另一个 localStorage key 里，避免重复通知

## 后续升级方向

1. **方案C（微信提醒）** — 接入微信 Pusher + GitHub Actions 每日定时推送
2. **GitHub 同步** — 参考五仁打卡的模式，用 GitHub API 做数据持久化
3. **重复任务** — 每天/每周重复的例行事项
