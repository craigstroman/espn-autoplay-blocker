console.log("Content script loaded:", window.location.href);

chrome.runtime.sendMessage({ type: "CHECK_ESPN_PAGE" }, (response) => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
    return;
  }

  if (!response?.shouldBlock) {
    console.log("Autoplay blocker disabled");
    return;
  }

  console.log("Autoplay blocker enabled");

  startAutoplayBlocker();
});

function startAutoplayBlocker() {
  document.addEventListener(
    "play",
    (event) => {
      const video = event.target;

      if (video instanceof HTMLVideoElement) {
        console.log("Blocking video:", video);
        video.pause();
      }
    },
    true,
  );

  function stopVideos() {
    document.querySelectorAll("video").forEach((video) => {
      video.autoplay = false;
      video.removeAttribute("autoplay");

      if (!video.paused) {
        video.pause();
      }
    });
  }

  stopVideos();

  const observer = new MutationObserver(() => {
    stopVideos();
  });

  function startObserver() {
    if (document.documentElement) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.documentElement) {
    startObserver();
  } else {
    document.addEventListener("DOMContentLoaded", startObserver, {
      once: true,
    });
  }
}
