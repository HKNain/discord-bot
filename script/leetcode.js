import https from "https";

export default function fetchLeetCode() {
  return new Promise((resolve, reject) => {
    const query = JSON.stringify({
      query: `
        query {
          allContests {
            title
            startTime
            titleSlug
          }
        }
      `
    });

    const options = {
      hostname: "leetcode.com",
      path: "/graphql",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": query.length
      }
    };

    const req = https.request(options, res => {
      let data = "";

      res.on("data", chunk => data += chunk);

      res.on("end", () => {
        try {
          const json = JSON.parse(data);

          const contests = json.data.allContests
            .filter(c => c.startTime * 1000 > Date.now())
            .map(c => ({
              platform: "leetcode",
              name: c.title,
              startTime: new Date(c.startTime * 1000).toISOString(),
              url: `https://leetcode.com/contest/${c.titleSlug}`
            }));

          resolve(contests);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.write(query);
    req.end();
  });
}