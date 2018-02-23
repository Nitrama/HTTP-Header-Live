
function NewWindow() {
	windowscreate = chrome.windows.create({
		height:600,
		width:600,
		type:"popup",
		url:chrome.extension.getURL("HTTPHeaderMain.html")
	});
}
chrome.browserAction.onClicked.addListener(NewWindow);	