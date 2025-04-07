import { Audio } from "daw5-yt-converter";
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
let consoleAnimationInterval;

app.get("/download", (req, res) => {
  if (consoleAnimationInterval) clearInterval(consoleAnimationInterval);
  console.log("request recieved");

  if (!req.query.url.match(regex)) {
    res.send(true);
    return;
  }

  urlQueue.push(req.query.url);
  res.send(true);

  if (downloading === false) downloadMp3();
});

async function downloadMp3() {
  console.log(
    `Url is valid, downloading ${urlQueue[0]} now. Queue position: ${urlQueue.length}`
  );

  const url = urlQueue.shift();
  downloading = true;

  try {
    const downloadInfo = await Audio({
      url,
      directory,
      ffmpegPath: process.env.FFPMEGPATH,
      onDownloading: (d) => console.log(d),
    });

    console.log("Download Successful: ", downloadInfo?.message);
  } catch (error) {
    console.log("error: ", error);
  }

  if (urlQueue.length > 0) {
    downloadMp3();
  } else {
    consoleAnimationInterval = consoleAnimation();
    downloading = false;
  }
}

app.listen(port, () => {
  console.log(`Daw5 yt-to-mp3 listening on port ${port}`);
});

function consoleAnimation() {
  let P = ["\\", "|", "/", "-"];
  let x = 0;
  console.log("Awaiting new download requests...");
  return setInterval(function () {
    process.stdout.write("\r" + P[x++]);
    x &= 3;
  }, 250);
}
