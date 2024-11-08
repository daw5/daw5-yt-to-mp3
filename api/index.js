import { Audio } from "yt-converter";
import express from "express";
import "dotenv/config";

const app = express();
const port = 3000;
const directory = process.env.DIRECTORY;
const regex =
  /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;

const urlQueue = [];

let downloading = false;

app.get("/download", (req, res) => {
  urlQueue.push(req.query.url);
  if (downloading === false) downloadMp3(res);
});

app.get("/get-download-status", (req, res) => {
  if (urlQueue.length === 0) res.send({ downloadComplete: true });
});

async function downloadMp3(res) {
  downloading = true;
  const url = urlQueue.shift();
  if (!url.match(regex)) {
    return;
  }

  await Audio({
    url,
    directory,
    ffmpegPath: process.env.FFPMEGPATH,
  });

  if (urlQueue.length > 0) {
    downloadMp3(res);
  } else {
    // we are sending the response too late for large downloads or groups of downloads, likely timing out on the chrome extension.
    // we are going to need to poll...use a setTimeout on the chrome extension to hit an endpoint here every 10 seconds until complete message is received
    // res.send(`Downloaded mp3 to: ${directory}`);
    // console.log("downloads have completed: ", url);
    downloading = false;
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
