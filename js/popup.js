let currTabId;

chrome.tabs.onActivated.addListener((tabId, changeInfo, tab) => {
  console.log("new window opened");
  chrome.tabs.get(tabId.tabId, function (tab) {
    currTabId = tab.id;
  });
});

document.addEventListener("DOMContentLoaded", async function load(event) {
  if (localStorage.toggleState == undefined) {
    console.log("init toggle button");
    await initToggleButtonFirstTime();
  } else {
    initToggleButtonAlwaysRun();
  }

  const form = document.querySelector(".input-container");
  const toggleButton = document.querySelector(".toggle-button");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    applyButtonClicked();
  });
  toggleButton.addEventListener("click", () => toggleButtonClicked());

  if (!!localStorage.borderWidth) {
    document.querySelector(".border-width").value = localStorage.borderWidth;
    applyButtonClicked();
  }
});

async function toggleButtonClicked() {
  let currState = JSON.parse(localStorage.toggleState);
  if (currState == true) {
    // turn off
    StoreInLocalStorage("toggleState", false);
    currState = false;
    document.querySelector(".toggle-button").src = "assets/red-button.svg";
  } else {
    StoreInLocalStorage("toggleState", true);
    currState = true;
    document.querySelector(".toggle-button").src = "assets/green-button.svg";
  }

  const currTabId = await getCurrentTabId();
  const payload = { data: currState, type: "toggleState" };

  chrome.tabs.sendMessage(currTabId, payload, function (response) {
    console.log(response);
  });
}

async function applyButtonClicked() {
  const width = document.querySelector(".border-width").value;
  const currTabId = await getCurrentTabId();
  const payload = { data: width, type: "widthValue" };
  StoreInLocalStorage("borderWidth", width);

  chrome.tabs.sendMessage(currTabId, payload, async function (response) {
    console.log(response);
    if (response == "Extension is off") {
      await notify("Settings are saved, but the extension is turned off!");
    }
  });
}
function initToggleButtonAlwaysRun() {
  let currState = JSON.parse(localStorage.toggleState);
  if (currState == true) {
    document.querySelector(".toggle-button").src = "assets/green-button.svg";
  } else {
    document.querySelector(".toggle-button").src = "assets/red-button.svg";
  }
}
async function initToggleButtonFirstTime() {
  const currTabId = await getCurrentTabId();
  const payload = { data: true, type: "toggleState" };
  StoreInLocalStorage("toggleState", true);
  document.querySelector(".toggle-button").src = "assets/green-button.svg";

  chrome.tabs.sendMessage(currTabId, payload, function (response) {
    console.log(response);
  });
}

// helpers
async function getCurrentTabId() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      currTabId = tabs[0].id;
      console.log(currTabId);
      resolve(currTabId);
    });
  });
}

function StoreInLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

async function notify(value) {
  document.querySelector(".message").innerText = value;
  document.querySelector(".notification").style.display = "block";

  setTimeout(() => {
    document.querySelector(".notification").style.display = "none";
  }, 3000);
}
