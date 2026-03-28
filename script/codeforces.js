import https from "https";

export default function fetchCodeforces() {
  return new Promise((resolve, reject) => {
    https.get("https://codeforces.com/api/contest.list", res => {
      let data = "";

      res.on("data", chunk => data += chunk);

      res.on("end", () => {
        try {
          const json = JSON.parse(data);

          const contests = json.result
            .filter(c => c.phase === "BEFORE")
            .map(c => ({
              platform: "codeforces",
              name: c.name,
              startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
              url: `https://codeforces.com/contest/${c.id}`
            }));

          resolve(contests);
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}