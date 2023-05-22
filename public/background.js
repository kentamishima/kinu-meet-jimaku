// browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('Hello from the background')

//   browser.tabs.executeScript({
//     file: 'content-script.js'
//   })
// })
console.log('Hello from the background')
chrome.storage.local.get(['chromememo', 'highlight', 'highlight_set'], function (value) {
  console.log(value)
  if (!value.chromememo) {
    chrome.storage.local.set({ chromememo: { text: 'amazon' } }, function () { })
  }
  if (!value.highlight) {
    chrome.storage.local.set({ highlight: { mode: 'indention' } }, function () { })
  }
  if (!value.highlight_set) {
    chrome.storage.local.set({ highlight_set: { ngsales: { ary: ['hogehogehoge'] } } }, function () { })
  }
})
