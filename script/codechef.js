import https from "https";

export default function fetchCodeChef() {
  return new Promise((resolve, reject) => {
    https.get("https://www.codechef.com/api/list/contests/all", res => {
      let data = "";

      res.on("data", chunk => data += chunk);

      res.on("end", () => {
        try {
          const json = JSON.parse(data);

          const contests = json.future_contests
            .filter(c => 
              c.contest_name.toLowerCase().includes("starters")
            )
            .map(c => ({
              platform: "codechef",
              name: c.contest_name,
              startTime: new Date(c.contest_start_date_iso).toISOString(),
              url: `https://www.codechef.com/${c.contest_code}`
            }));

          resolve(contests);
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}