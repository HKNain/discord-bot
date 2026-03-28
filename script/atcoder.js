import https from "https";
import dotenv from "dotenv";

dotenv.config();

const CREDS = {
  user : process.env.CLIST_USERNAME,
  key : process.env.CLIST_API_KEY,
}

export default function fetchAtCoder() {
  return new Promise((resolve) => {

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const url = `https://clist.by/api/v4/contest/?resource=atcoder.jp&start__gte=${encodeURIComponent(now)}&order_by=start&limit=50`;

    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
        Authorization: `ApiKey ${CREDS.user}:${CREDS.key}`,
      },
    };

    const req = https.get(url, options, (res) => {
      let data = "";

      res.on("data", (chunk) => (data += chunk));

      res.on("end", () => {
        try {
          if (!data || data.trim().length === 0) {
            throw new Error("Empty response");
          }

          const json = JSON.parse(data);

          const contests = (json.objects || [])
            .filter((c) => {
              const name = (c.event || "").toLowerCase();
              return (
                name.includes("beginner contest") ||
                name.includes("regular contest")
              );
            })
            .map((c) => ({
              platform: "atcoder",
              name: c.event,
              startTime: new Date(
                new Date(c.start).getTime() + 5.5 * 60 * 60 * 1000,
              ).toISOString(),
              url: c.href,
            }));

          resolve(contests);
        } catch (err) {
          console.error("Parse error:", err.message);
          resolve([]);
        }
      });
    });

    req.setTimeout(5000, () => {
      console.error("Request timeout");
      req.destroy();
      resolve([]);
    });

    req.on("error", (err) => {
      console.error("Request error:", err.message);
      resolve([]);
    });
  });
}
