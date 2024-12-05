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
  console.log("request recieved, let's download a url!!!!!!!!!");
  if (!req.query.url.match(regex)) {
    res.send(true);
    return;
  }

  urlQueue.push(req.query.url);
  res.send(true);
  if (downloading === false) downloadMp3();
});

app.get("/get-download-status", (req, res) => {
  console.log("we are being polled: ", urlQueue, downloading);
  if (urlQueue.length === 0) {
    console.log("All downloads have completed --");
    res.send({ downloadCompleted: true });
  } else res.send({ downloadCompleted: false });
});

async function downloadMp3() {
  const url = urlQueue.shift();
  downloading = true;
  console.log("before await audio: ", urlQueue, url);

  const downloadInfo = await Audio({
    url,
    directory,
    ffmpegPath: process.env.FFPMEGPATH,
  });

  // looks like the logic is sound, but with larger files, sometimes this thing errors out...error must be coming from within the lib, because the promise from the call to Audio() never returns!

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
