import fs from "fs";

const STATE_FILE = "youtube_state.json";

// Fetch YouTube RSS feed
async function getLatestVideo(channelId) {
    const url =
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`YouTube returned ${response.status}`);
    }

    const xml = await response.text();

    // Get first <entry>
    const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/);

    if (!entry) {
        return null;
    }

    const block = entry[1];

    const videoId =
        block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];

    const title =
        block.match(/<title>(.*?)<\/title>/)?.[1];

    const published =
        block.match(/<published>(.*?)<\/published>/)?.[1];

    if (!videoId || !title) {
        return null;
    }

    return {
        id: videoId,
        title: decodeXML(title),
        published,
        url: `https://www.youtube.com/watch?v=${videoId}`
    };
}

// Decode basic XML entities
function decodeXML(str) {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

// Load previous video ID
function loadState() {
    if (!fs.existsSync(STATE_FILE)) {
        return null;
    }

    try {
        const data = JSON.parse(
            fs.readFileSync(STATE_FILE, "utf8")
        );

        return data.videoId;
    } catch {
        return null;
    }
}

// Save latest video ID
function saveState(videoId) {
    fs.writeFileSync(
        STATE_FILE,
        JSON.stringify({ videoId }, null, 2)
    );
}

// Send Discord message
async function sendDiscord(video, webhook) {
    const message = {
        content:
            `@everyone\n` +
            `**${video.title}**\n` +
            `Watch it here -> ${video.url}`
    };

    const response = await fetch(webhook, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    });

    if (!response.ok) {
        throw new Error(
            `Discord returned ${response.status}`
        );
    }
}

// Main
export default async function runYoutubeNotifier() {
    const channelId = process.env.YOUTUBE_CHANNEL_ID;
    const webhook = process.env.YOUTUBE_WEBHOOK;

    if (!channelId || !webhook) {
        console.error("Missing YOUTUBE_CHANNEL_ID or YOUTUBE_WEBHOOK");
        return;
    }

    const video = await getLatestVideo(channelId);

    if (!video) {
        console.log("No video found.");
        return;
    }

    console.log(`Latest video: ${video.title}`);
    console.log(`Video ID: ${video.id}`);

    const previousVideo = loadState();

    // First run — don't send the existing video
    if (!previousVideo) {
        console.log("First run. Saving current video.");
        saveState(video.id);
        return;
    }

    // Nothing new
    if (video.id === previousVideo) {
        console.log("No new video.");
        return;
    }

    // New video
    console.log("🎬 New video detected!");

    await sendDiscord(video, webhook);

    console.log("✅ Discord notification sent.");

    saveState(video.id);
}
