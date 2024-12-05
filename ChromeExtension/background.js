// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.action.onClicked.addListener(async (tab) => {
  fetch(`http://localhost:3000/download?url=` + tab.url)
    .then(() => {
      setChromeBadgeText("DL");
      pollServerForDownloadStatus(tab.url);
    })
    .catch((err) => {
      console.log("Fetch Error x.x", err);
    });
});

function pollServerForDownloadStatus(url) {
  const pollingInterval = setInterval(() => {
    fetch(`http://localhost:3000/get-download-status`)
      .then((response) => response.json())
      .then((data) => {
        if (data.downloadCompleted) {
          clearInterval(pollingInterval);
          setChromeBadgeText("");
        }
      });
  }, 5000);
}

function setChromeBadgeText(text) {
  chrome.action.setBadgeText({
    text,
  });
}
