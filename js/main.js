window.addEventListener("load", onload, { once: false });

let DemoOverlay;
let DemoContainer;
let DemoFrame;

let DemoRunning = false;

const DemoButton = {
  onclick: function(button) {
    
    if (DemoRunning === true) {
      return;
    }
    DemoRunning = true;

    let demoSrc = button.dataset.src;
    let width = button.dataset.width;
    let height = button.dataset.height;

    DemoFrame.width = width;
    DemoFrame.height = height;
    DemoFrame.setAttribute("src", `/demos/${demoSrc}`);

    DemoOverlay.removeAttribute("hidden");
  }
};

function hideDemo() {
  if (DemoRunning === false) {
    return;
  }
  DemoRunning = false;

  DemoFrame.setAttribute("src", "about:blank");

  DemoOverlay.setAttribute("hidden", "");
}



function onload() {
  Array.from(
    document.getElementsByClassName("demo-button")
  ).forEach(button => {
    button.addEventListener("click", (_event) => DemoButton.onclick(button));
  });

  DemoOverlay = document.getElementById("demo-overlay");
  DemoContainer = document.getElementById("demo-container");
  DemoFrame = document.getElementById("demo-frame");
}