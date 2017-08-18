var WindowInfo = "";
var TabInfo = "";
function NewWindow() {
	windowscreate = browser.windows.create({
		height:600,
		width:600,
		type:"popup",
		url:browser.extension.getURL("HttpHeaderMain.html")
	})
}

function onWindowError(){
	console.error('Windows Error');
}

browser.browserAction.onClicked.addListener(NewWindow);	