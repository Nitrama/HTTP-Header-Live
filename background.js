
function NewWindow() {
	windowscreate = chrome.windows.create({
		height:600,
		width:800,
		type:"popup",
		url:chrome.extension.getURL("HTTPHeaderMain.html")
    });
}
chrome.browserAction.onClicked.addListener(NewWindow);	

function handleInstalled(details) {
    browser.tabs.create({
        url: "https://github.com/Nitrama/HTTP-Header-Live/blob/master/release/README.md"
    });
}
//browser.runtime.onInstalled.addListener(handleInstalled);
