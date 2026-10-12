chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "CHECK_ESPN_PAGE") {
    return;
  }

  const tabUrl = sender.tab?.url;

  if (!tabUrl) {
    sendResponse({ shouldBlock: false });
    return;
  }

  const url = new URL(tabUrl);

  const isEspn =
    url.hostname === "espn.com" || url.hostname.endsWith(".espn.com");

  const isWatch =
    url.pathname === "/watch" || url.pathname.startsWith("/watch/");

  sendResponse({
    shouldBlock: isEspn && !isWatch,
  });
});
