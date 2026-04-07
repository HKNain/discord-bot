import fs from "fs";
import fetch from "node-fetch"; // npm i node-fetch
import fetchCodeforces from "./script/codeforces.js";
import fetchLeetCode from "./script/leetcode.js";
import fetchCodeChef from "./script/codechef.js";
import fetchAtCoder from "./script/atcoder.js";
import dotenv from "dotenv";

dotenv.config();
const WEBHOOKS = {
  codeforces: process.env.CODEFORCES_WEBHOOK,
  leetcode: process.env.LEETCODE_WEBHOOK,
  codechef: process.env.CODECHEF_WEBHOOK,
  atcoder: process.env.ATCODER_WEBHOOK,
};

const PlatformName = {
  codeforces: "Codeforces",
  leetcode: "LeetCode",
  codechef: "CodeChef",
  atcoder: "AtCoder",
}

async function main() {
  try {
    const results = await Promise.all([
      fetchCodeforces(),
      fetchLeetCode(),
      fetchCodeChef(),
      fetchAtCoder(),
    ]);
    const allContests = results.flat();
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcomingContests = allContests.filter((c) => {
      const start = new Date(c.startTime);
      return start >= now && start <= next24h;
    });
    if (upcomingContests.length === 0) {
      return;
    }
    const contestsByPlatform = upcomingContests.reduce((acc, c) => {
      acc[c.platform] = acc[c.platform] || [];
      acc[c.platform].push(c);
      return acc;
    }, {});

    for (const [platform, contests] of Object.entries(contestsByPlatform)) {
      const webhook = WEBHOOKS[platform];
      if (!webhook) {
        console.log(`No webhook configured for ${platform}`);
        continue;
      }

      let message = `@everyone **Upcoming ${PlatformName[platform]} Contest**\n\n`;
      contests.forEach((c) => {
        const startTime = new Date(c.startTime).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        message += `• [${c.name}](${c.url}) at ${startTime}\n`;
      });

      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });
    }
  } catch (err) {
    console.error(err);
  }
}

main();
