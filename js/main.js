chrome.runtime.onMessage.addListener(function (payload, sender, sendResponse) {
  if (payload.type == "widthValue") {
    if (localStorage.toggleState !== undefined) {
      if (JSON.parse(localStorage.toggleState) == false) {
        sendResponse("Extension is off");
        return;
      }

      if (JSON.parse(localStorage.toggleState) == true) {
        console.log("main.js toggleState", localStorage.toggleState);
        GenerateBorders(payload.data);
      }
    } else {
      console.log("Toggle state was never defined before on this page");
      GenerateBorders(0.00000001);
    }
  } else if (payload.type == "toggleState") {
    console.log("I should remove or add borders", payload.data);
    // extension turned off
    if (payload.data == false) {
      window.location.reload();
    } else {
      // extension getting turned on
      GenerateBorders(localStorage.borderWidth);
    }
  }
  StoreInLocalStorage(payload.type, payload.data);
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
