var TAB_ID
function notify(request) {
	//console.log("nöd nöd");
	request_ID = request.id
	
	////console.log(request.data)
	parser = new DOMParser()
	temp = parser.parseFromString(request.data, "text/html");
	post_data = temp.getElementById("post_" + request_ID).innerHTML
	if (post_data === undefined) {post_data = "";}
	document.getElementById("header_data").innerHTML = temp.getElementById("header_" + request_ID).innerHTML
	document.getElementById("post_data").innerHTML = post_data
}

function replay_send(){
	
	var querying = browser.tabs.query({active: true});
	querying.then(getInfoForTab, onError1);
}

function getInfoForTab(tabs) {
	////console.log (tabs)
	for (var tab of tabs) {
		if  (tab.url.indexOf("moz-extension") == -1)  {
			//console.log (tab.id)
			TAB_ID = tab.id
			var gettingInfo = browser.tabs.get(TAB_ID);
			gettingInfo.then(onGot, onError2);
		}
	}
}

function onGot(tabInfo){
	if  (tabInfo.url == document.getElementById("url").innerHTML){
		onReload();
		} else {
		var updating = browser.tabs.update(TAB_ID , {url: document.getElementById("url").innerHTML});
		updating.then(onReload, onError3);
	}
}

function onReload(){
	executing = browser.tabs.executeScript(TAB_ID, { 
		file: browser.extension.getURL("/site_include.js" )
	});
	executing.then(onExecuted, onError4);
}

function onExecuted(result) {
	//console.log("test:" + document.getElementById("post_data").innerHTML)
	post_data = document.getElementById("post_data").innerHTML.replace("&amp;" , "&")
	
	if (post_data === undefined) {post_data = "";}
	post_data = post_data.replace("<br>" , "") //FIX Firefox. Insert <BR> when <div> empty
	
	browser.tabs.sendMessage(TAB_ID, {
		header:document.getElementById("header_data").innerHTML,
		post:post_data,
		tab_id:TAB_ID
	});
}

function onError1(error) {
	//console.log(`Error1: ${error}`);
} 

function onError2(error) {
	//console.log(`Error2: ${error}`);
}

function onError3(error) {
	//console.log(`Error3: ${error}`);
} 

function onError4(error) {
	//console.log(`Error4: ${error}`);
} 

browser.runtime.onMessage.addListener(notify);	
document.getElementById("replay_send").onclick = replay_send;


