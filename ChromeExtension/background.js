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

// use this to set custom shit later
// chrome.runtime.onInstalled.addListener(() => {
// chrome.action.setBadgeText({
//   text: 'OFF'
// });
// });
// let downloading = false;
// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  // if (downloading) return;
  // downloading = true;
  chrome.action.setBadgeText({
    text: "DL",
  });
  fetch(`http://localhost:3000/download?url=` + tab.url, { mode: "no-cors" }) // 'data/data.json' in my case
    .then(function (response) {
      // downloading = false;
      chrome.action.setBadgeText({
        text: "RD",
      });

      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log(data);
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
  // if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
  //   // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
  //   const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  //   // Next state will always be the opposite
  //   const nextState = prevState === 'ON' ? 'OFF' : 'ON';

  //   // Set the action badge to the next state
  //   await chrome.action.setBadgeText({
  //     tabId: tab.id,
  //     text: nextState
  //   });

  //   if (nextState === 'ON') {
  //     // Insert the CSS file when the user turns the extension on
  //     await chrome.scripting.insertCSS({
  //       files: ['focus-mode.css'],
  //       target: { tabId: tab.id }
  //     });
  //   } else if (nextState === 'OFF') {
  //     // Remove the CSS file when the user turns the extension off
  //     await chrome.scripting.removeCSS({
  //       files: ['focus-mode.css'],
  //       target: { tabId: tab.id }
  //     });
  //   }
  // }
});
