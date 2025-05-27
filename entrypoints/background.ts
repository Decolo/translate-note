export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  
  // Handle action click to open sidepanel
  browser.action.onClicked.addListener((tab) => {
    if (tab.id && tab.windowId) {
      browser.sidePanel.open({ tabId: tab.id, windowId: tab.windowId });
    }
  });
});
