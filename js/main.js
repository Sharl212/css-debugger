chrome.runtime.onMessage.addListener(function (payload, sender, sendResponse) {
  if (payload.type == "widthValue") {
    if (localStorage.toggleState !== undefined) {
      if (JSON.parse(localStorage.toggleState) == false) {
        sendResponse("Extension is off");
      }

      if (JSON.parse(localStorage.toggleState) == true) {
        console.log("main.js toggleState", localStorage.toggleState);
        GenerateBorders(payload.data);
      }
    } else {
      console.log("Toggle state was never defined before on this page");
      GenerateBorders(0.00000001);
    }
    StoreInLocalStorage(payload.type, payload.data);
  } else if (payload.type == "toggleState") {
    StoreInLocalStorage(payload.type, payload.data);
    console.log("I should remove or add borders", payload.data);
    // extension turned off
    if (payload.data == false) {
      window.location.reload();
    } else {
      // extension getting turned on
      GenerateBorders(localStorage.borderWidth);
    }
  } else if ((payload.type = "checkState")) {
    if (localStorage.toggleState !== undefined) {
      if (JSON.parse(localStorage.toggleState) == false) {
        sendResponse("off");
      }

      if (JSON.parse(localStorage.toggleState) == true) {
        sendResponse("on");
      }
    } else {
      StoreInLocalStorage("toggleState", true);
      sendResponse("on");
    }
  }
  sendResponse("thanks!");
});

// generate the stored value for that specific webpage
if (
  !!localStorage.toggleState &&
  JSON.parse(localStorage.toggleState) == true
) {
  if (!!localStorage.borderWidth) {
    GenerateBorders(localStorage.borderWidth);
  } else {
    GenerateBorders(0.00000001);
  }
} else {
  console.log("toggle state is not defined so I cant generate the borders");
}

function GenerateBorders(width) {
  const PageElements = document.querySelectorAll("*");
  for (let element of PageElements) {
    const generateColor = randomColor({ count: 1 });

    element.style["border"] = `${width}px solid ${generateColor}`;
  }
}

function StoreInLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

console.log(localStorage);
// GenerateBorders(1)
