var WindowInfo = "";
var TabInfo = "";
function NewWindow() {
	windowscreate = browser.windows.create({
		height:600,
		width:600,
		type:"popup",
		url:browser.extension.getURL("HttpHeaderMain.html")
	});
	windowscreate.then(onSubWindowCreated, onSubWindowError);
}

function onSubWindowError(){
	console.error('Windows Error');
}
function onSubWindowCreated(){
	console.log("Windows created")
}
browser.browserAction.onClicked.addListener(NewWindow);	