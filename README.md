# Discord Contest Notifier Bot

A Discord bot that automatically fetches upcoming programming contests from major competitive programming platforms and posts them to dedicated Discord channels using webhooks.

## Features

* 🚀 Automated daily updates using cron jobs
* 📅 Fetches upcoming contests from:

  * LeetCode
  * Codeforces
  * CodeChef
  * AtCoder
* 🔔 Sends contest notifications to platform-specific Discord channels
* 🌐 Webhook-based messaging (no channel permissions required)
* ⏰ Runs automatically every day at **2:00 AM**
* 🛠️ Easy configuration through environment variables

---

## How It Works

Every day at **2:00 AM**, the bot:

1. Fetches upcoming contest data from supported platforms.
2. Formats contest information into Discord embeds/messages.
3. Sends the contests to their respective Discord channels via webhooks.

Example notification:

```text
📢 Upcoming Codeforces Contests

• Codeforces Round #1050 (Div. 2)
  Start: 2026-06-10 17:35 UTC
  Duration: 2h 15m

• Educational Codeforces Round 190
  Start: 2026-06-12 17:35 UTC
  Duration: 2h
```

---

## Supported Platforms

| Platform   | Status |
| ---------- | ------ |
| LeetCode   | ✅      |
| Codeforces | ✅      |
| CodeChef   | ✅      |
| AtCoder    | ✅      |

---

## Tech Stack

* Node.js
* TypeScript
* Discord Webhooks
* Cron Scheduler
* REST APIs / Web Scraping (depending on platform)

---

## Project Structure

```text
.
├── script/
│   ├── atcoder.js          
│   ├── codechef.js       
│   ├── codeforces.js     
│   ├── leetcode.js  
├── .env
├── index.js
├── package.json
└── README.md
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
LEETCODE_WEBHOOK_URL=
CODEFORCES_WEBHOOK_URL=
CODECHEF_WEBHOOK_URL=
ATCODER_WEBHOOK_URL=
```

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/HKNain/discord-bot.git
cd discord-bot
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Add your Discord webhook URLs.

### Run the Bot

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

---

## Scheduling

The bot is configured to run automatically every day at **2:00 AM**.

Example cron expression:

```text
0 2 * * *
```

---

## Adding a New Platform

1. Create a new contest fetcher inside `services/`.
2. Implement contest parsing and formatting.
3. Add a webhook configuration.
4. Register the fetcher in the scheduled job.

---

## Future Improvements

* Contest reminders before start time
* Daily/weekly contest summaries
* Contest role mentions
* Database-backed history tracking
* Slash commands for manual refresh
* Contest filtering by platform

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Author

**Hitesh Kumar**

GitHub: https://github.com/HKNain
