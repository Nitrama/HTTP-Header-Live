//console.log("mööööööööööööp")
var EXLUDE_ITEMS = {}
var WEBREQUEST_DATA = {}
var TAB_ID = ""
var REQUESTID

StorageChange()

chrome.webRequest.onBeforeRequest.addListener(
function (test) {test["typ"] = "onBeforeRequest"; setdata_webRequest(test)},
{urls: ["<all_urls>"]},
["requestBody"]
);
chrome.webRequest.onBeforeSendHeaders.addListener(
function (test) {test["typ"] = "onBeforeSendHeaders"; setdata_webRequest(test)},
{urls: ["<all_urls>"]},
["requestHeaders"]
);	
chrome.webRequest.onHeadersReceived.addListener(
function (test) {test["typ"] = "onHeadersReceived"; setdata_webRequest(test)},
{urls: ["<all_urls>"]},
["responseHeaders"]
);	
chrome.webRequest.onAuthRequired.addListener(
function (test) {test["typ"] = "onAuthRequired"; setdata_webRequest(test)},
{urls: ["<all_urls>"]},
["responseHeaders"]
);	
chrome.webRequest.onErrorOccurred.addListener(
function (test) {test["typ"] = "onErrorOccurred"; setdata_webRequest(test)},
{urls: ["<all_urls>"]}
);
chrome.webRequest.onBeforeRedirect.addListener(
function (test) {test["typ"] = "onBeforeRedirect"; setdata_webRequest(test)},
{urls: ["<all_urls>"]}
);
chrome.webRequest.onCompleted.addListener(
function (test) {test["typ"] = "onCompleted"; setdata_webRequest(test)},
{urls: ["<all_urls>"]}
);

function setdata_webRequest(e) {
	if (document.getElementById("capture_checkbox").checked == true){
		if (not_on_exlude_list(e.url)){
			//console.log(e)
			if (e.requestId.indexOf("fakeRequest") >= 0){
				return;
			}
			i = 1;
			if (e.typ == "onBeforeRequest"){
				while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
					i++;
				}
				WEBREQUEST_DATA[e.requestId + "-" + i] = {}
				WEBREQUEST_DATA[e.requestId + "-" + i].url = e.url
				WEBREQUEST_DATA[e.requestId + "-" + i].originUrl = e.originUrl
				WEBREQUEST_DATA[e.requestId + "-" + i].method = e.method
				WEBREQUEST_DATA[e.requestId + "-" + i].tabId = e.tabId
				WEBREQUEST_DATA[e.requestId + "-" + i].requestBody = e.requestBody
			}
			else if (e.typ == "onBeforeSendHeaders"){
				while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
					if (WEBREQUEST_DATA[e.requestId + "-" + i].requestHeaders == undefined){
						WEBREQUEST_DATA[e.requestId + "-" + i].requestHeaders = e.requestHeaders;
						break;
					}
					i++;
				}	
			}
			else if (e.typ == "onHeadersReceived"){
				while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
					if (WEBREQUEST_DATA[e.requestId + "-" + i].responseHeaders == undefined){
						WEBREQUEST_DATA[e.requestId + "-" + i].responseHeaders = e.responseHeaders;
						break;
					}
					i++;
				}
			}
            else if (e.typ == "onAuthRequired"){
				while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
					if (WEBREQUEST_DATA[e.requestId + "-" + i].responseHeaders == undefined){
						WEBREQUEST_DATA[e.requestId + "-" + i].responseHeaders = e.responseHeaders;
						break;
					}
					i++;
				}
			}
			else if (e.typ == "onErrorOccurred"){
				while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
					if (WEBREQUEST_DATA[e.requestId + "-" + i]["statusLine"] == undefined){
						WEBREQUEST_DATA[e.requestId + "-" + i]["statusLine"] =  "error:" + e.error
						break;
					}
					i++;
				}
				set_data_html(e.requestId + "-" + i)
			}
			else if (e.typ == "onBeforeRedirect"){
				while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
					if (WEBREQUEST_DATA[e.requestId + "-" + i]["statusLine"] == undefined){
						WEBREQUEST_DATA[e.requestId + "-" + i]["statusLine"] = e.method + " " + e.statusLine
						break;
					}
					i++;
				}				
				set_data_html(e.requestId + "-" + i)
			}
			else if (e.typ == "onCompleted"){
				while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
					if (WEBREQUEST_DATA[e.requestId + "-" + i]["statusLine"] == undefined){
						WEBREQUEST_DATA[e.requestId + "-" + i]["statusLine"] =  e.method + " " + e.statusLine
						break;
					}
					i++;
				}
				set_data_html(e.requestId + "-" + i)
			}
		}
	}
}

function set_data_html (ID){
	newdata = document.createElement("div");
	//newdata.onmouseover = function (){console.log("ID:"+ ID)}; 
	//DEACTIVATE THIS ^^^^^^^^^^^^^^^^^^^^^
	newdata.id = 'data_' + ID
	newdata.className = "data"
	newdata.addEventListener("click", function(e) {clicked_data(e, ID)})
	newheader = document.createElement("div");
	newheader.id = 'header_' + ID
	header_url = document.createElement("pre");
	header_url.className = 'big'
	
	header_url.textContent = decodeURI(WEBREQUEST_DATA[ID].url)
	newheader.appendChild (header_url)
	header_pre = document.createElement("pre");
	string = WEBREQUEST_DATA[ID]["statusLine"] + "\r\n"
	header_pre.textContent = string
	newheader.appendChild (header_pre)
	if (WEBREQUEST_DATA[ID].requestHeaders !== undefined){
		string = ""
		header_pre = document.createElement("pre");
		for (var i of WEBREQUEST_DATA[ID].requestHeaders) {
			string += i.name + ": " + i.value + "\r\n"
		}
		header_pre.textContent = string
		newheader.appendChild (header_pre)
	}
	newdata.appendChild(newheader)
	newpost = document.createElement("pre");
	newpost.id = 'post_' + ID
	newpost.className = 'big'
	if (WEBREQUEST_DATA[ID].requestBody != null){
		string = ""
		for (var i in WEBREQUEST_DATA[ID].requestBody.formData) {
			string += i + "=" + WEBREQUEST_DATA[ID].requestBody.formData[i] + "&";
		}
		string = string.substr(0, string.length-1)
		newpost.textContent = string;
	}
	newdata.appendChild(newpost)
	
	new_server_header = document.createElement("div");
	new_server_header.id = 'header_server_' + ID
	if (WEBREQUEST_DATA[ID].responseHeaders !== undefined){
		string = "\r\n"
		header_pre = document.createElement("pre");
		for (var i of WEBREQUEST_DATA[ID].responseHeaders) {
			string += i.name + ": " + i.value + "\r\n"
		}
		header_pre.textContent = string
		new_server_header.appendChild (header_pre)
	}
	newdata.appendChild(new_server_header)
	document.getElementById("textarea").appendChild (newdata);
	if (document.getElementById("auto_scroll_checkbox").checked == true) {
		document.getElementById("textarea").scrollTop = document.getElementById("textarea").scrollHeight - document.getElementById("textarea").clientHeight;
	}
}

function clicked_data(e, requestID){
	//console.log(e)
	windowscreate = chrome.windows.create({
		height:600,
		width:600,
		type:"popup",
		url:chrome.extension.getURL("HTTPHeaderSub.html")
	} , function (windowscreate){onSubWindowCreated(windowscreate , requestID)})
	
}

function onSubWindowCreated(windowscreate ,requestID){
	//console.log(windowscreate  ,"#",requestID)
	//console.log("windowscreate:" , windowscreate.tabs[0].id);
	TAB_ID = windowscreate.tabs[0].id
	REQUESTID = requestID
	chrome.tabs.onUpdated.addListener(info_tabs)
}

function info_tabs(info_tab , test , tab) {
	//console.log(tab , ":" , info_tab)
	if (tab.status == "complete" && info_tab == TAB_ID && tab.title == "HTTP Header Live Sub"){
		//console.log(info_tab , test , tab)
		//chrome.tabs.onUpdated.removeListener(info_tabs)
		on_tab_complete(TAB_ID , REQUESTID)
	}
}

function on_tab_complete (tab_id , requestID){
	//console.log(tab_id , requestID,WEBREQUEST_DATA[requestID])
	tab_send = chrome.tabs.sendMessage(
	tab_id ,
	{data:WEBREQUEST_DATA[requestID]},function (){ 
		if (chrome.runtime.lastError) {
			onError(chrome.runtime.lastError)
		}
	}
	)
}	

function not_on_exlude_list (url_site){
	request_url = new URL(url_site)
	//console.log(url)
	//.pathname split (".") -1
	//.hostname instr ("url") -1
	for (url of EXLUDE_ITEMS["urls"]) {
		//console.log(url)
		//console.log (request_url.hostname + "###" + request_url.hostname.indexOf(url))
		if (url["active"] == true){
			if (request_url.hostname.indexOf(url["string"]) != -1){
				//console.log ("url:" +request_url.hostname)
				return false;
			}
		}
	}	 	
	for (file of EXLUDE_ITEMS["files"]) {
		//console.log(file)
		//console.log (request_url.pathname + "+++" +request_url.pathname.indexOf(file, ((-1) - file.length)))
		if (file["active"] == true){
			if (request_url.pathname.indexOf(file["string"], ((-1) - file.length)) != -1){
				//console.log("file:" + request_url.pathname)
				return false;
			}
		}
	}	
	
	if_return = true
	for (text of EXLUDE_ITEMS["text"]) {
		if (text["active"] == true){
			//console.log(url_site , "###" , text , "###", url_site.indexOf(text))
			if (url_site.indexOf(text["string"]) >= 0){
				return true;
			} 
			else {if_return = false;}
		}
	}
	if (if_return == true){
		return true;
	} 
	else {
		return false;
	}	
}

function StorageChange(){
	chrome.storage.local.get(function(items){
	//console.log(items)
		EXLUDE_ITEMS = items
	})
}

function save_file(){
	string = ""
	for (value in WEBREQUEST_DATA){
		//console.log(WEBREQUEST_DATA[value])
		string += WEBREQUEST_DATA[value]["url"] + "\r\n"
		string += WEBREQUEST_DATA[value]["statusLine"] + "\r\n"
		if (WEBREQUEST_DATA[value]["requestHeaders"] !== undefined){
			for (data of WEBREQUEST_DATA[value]["requestHeaders"]){
				string += data["name"] + ":" + data["value"] + "\r\n"
			}	
		}
		string2= "\r\n"
		if (WEBREQUEST_DATA[value]["requestBody"] !== null){
			if (WEBREQUEST_DATA[value]["requestBody"] !== undefined){
				for (data in WEBREQUEST_DATA[value]["requestBody"]["formData"]){
					string2 += data +"="+WEBREQUEST_DATA[value]["requestBody"]["formData"][data][0] + "&"
				}
				string2 = string2.substr(0, string2.length-1) + "\r\n"
			}
		}
		string += string2 + "\r\n"
		if (WEBREQUEST_DATA[value]["responseHeaders"] !== undefined){
			for (data of WEBREQUEST_DATA[value]["responseHeaders"]){
				string += data["name"] + ":" + data["value"] + "\r\n"
			}	
		}
		string += "\r\n-----------------------\r\n\r\n"	
		
	}
	blob = new Blob([string], {type : 'data:text/plain;charset=utf-8'});
	objectURL = URL.createObjectURL(blob);
	var downloading = chrome.downloads.download({
		url : objectURL,
		filename : "HTTPHeaderLive.txt"	
	})
}

function onSubWindowError(){
	console.error('Windows Error');
}

function tab_sendError(error) {
	console.error(`tab_sendError: ${error}`);
} 

function onError(error) {
	console.error(`Error: ${error}`);
}

chrome.storage.onChanged.addListener(StorageChange);
document.getElementById("clear_button").addEventListener("click" , function (){document.getElementById("textarea").innerHTML = "" ; WEBREQUEST_DATA = [];})
document.getElementById("options_button").addEventListener ("click" , function (){chrome.runtime.openOptionsPage()})
document.getElementById("save_file_button").addEventListener ("click" , save_file)
