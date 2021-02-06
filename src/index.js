import React from "react";

import PWAPrompt from "./components/PWAPrompt";

const deviceCheck = () => {
  const isiOS = /iphone|ipad|ipod/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isChromeOrFF = /crios|fxios/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isiPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  const isStandalone =
    "standalone" in window.navigator && window.navigator.standalone;

  return (isiOS || isiPadOS) && !isStandalone && !isChromeOrFF;
};

const isiPadOSCheck = () => {
  const isiPadTablet = /ipad/.test(
    window.navigator.userAgent.toLowerCase()
  );
  const isiPadOS =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return isiPadTablet || isiPadOS
}

export default ({
  timesToShow = 1,
  promptOnVisit = 1,
  permanentlyHideOnDismiss = true,
  copyTitle = "Add to Home Screen",
  copyBody = "This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.",
  copyAddHomeButtonLabel = "2) Press 'Add to Home Screen'.",
  copyClosePrompt = "Cancel",
  delay = 1000,
  debug = false,
  onClose = () => { },
}) => {
  let promptData = JSON.parse(localStorage.getItem("iosPwaPrompt2"));

  if (promptData === null) {
    promptData = { isiOS: deviceCheck(), isiPadOS: isiPadOSCheck(), visits: 0 };
    localStorage.setItem("iosPwaPrompt2", JSON.stringify(promptData));
  }

  if (promptData.isiOS || debug) {
    const aboveMinVisits = promptData.visits + 1 >= promptOnVisit;
    const belowMaxVisits = promptData.visits + 1 < promptOnVisit + timesToShow;

    if (belowMaxVisits || debug) {
      localStorage.setItem(
        "iosPwaPrompt2",
        JSON.stringify({
          ...promptData,
          visits: promptData.visits + 1,
        })
      );

      if (aboveMinVisits || debug) {
        const copyShareButtonLabel = promptData.isiPadOS ? "1) Press the 'Share' button on the menu bar above." : "1) Press the 'Share' button on the menu bar below."
        return (
          <PWAPrompt
            delay={delay}
            copyTitle={copyTitle}
            copyBody={copyBody}
            copyAddHomeButtonLabel={copyAddHomeButtonLabel}
            copyShareButtonLabel={copyShareButtonLabel}
            copyClosePrompt={copyClosePrompt}
            permanentlyHideOnDismiss={permanentlyHideOnDismiss}
            promptData={promptData}
            maxVisits={timesToShow + promptOnVisit}
            onClose={onClose}
          />
        );
      }
    }
  }

  return null;
};
