import { Audio } from "yt-converter";
import express from "express";
import "dotenv/config";

const app = express();
const port = 3000;

app.get("/download", (req, res) => {
  console.log("hey we console loggin hiya: ", req.query.url);
  res.send("Hello World!");
  downloadMp3(req.query.url);
});

async function downloadMp3(url) {
  const data = await Audio({
    url,
    directory: process.env.DIRECTORY,
    ffmpegPath: process.env.FFPMEGPATH,
  });

  console.log(data.message);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
