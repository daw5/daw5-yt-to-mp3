import { Audio } from "yt-converter";
import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();
const port = 3000;
const directory = process.env.DIRECTORY;

app.use(cors());

const regex =
  /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;

const urlQueue = [];

let downloading = false;

app.get("/download", (req, res) => {
  urlQueue.push(req.query.url);
  res.send(true);
  if (downloading === false) downloadMp3();
});

app.get("/get-download-status", (req, res) => {
  if (urlQueue.length === 0) {
    console.log("All downloads have completed --");
    res.send({ downloadCompleted: true });
  } else res.send({ downloadCompleted: false });
});

async function downloadMp3() {
  const url = urlQueue.shift();
  downloading = true;

  if (!url.match(regex)) {
    return;
  }

  const downloadInfo = await Audio({
    url,
    directory,
    ffmpegPath: process.env.FFPMEGPATH,
  });

  console.log(downloadInfo);

  if (urlQueue.length > 0) {
    downloadMp3();
  } else {
    downloading = false;
  }
}

app.listen(port, () => {
  console.log(`Daw5 yt-to-mp3 listening on port ${port}`);
});
