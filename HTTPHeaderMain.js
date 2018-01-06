//console.log("mööööööööööööp")
var EXLUDE_ITEMS = ""
var WEBREQUEST_DATA = []
var TAB_ID = ""
var REQUESTID

StorageChange()

browser.webRequest.onBeforeRequest.addListener(
setdata_webRequest,
{urls: ["<all_urls>"]},
["requestBody"]
);
browser.webRequest.onBeforeSendHeaders.addListener(
setdata_webRequest,
{urls: ["<all_urls>"]},
["requestHeaders"]
);	
browser.webRequest.onHeadersReceived.addListener(
setdata_webRequest,
{urls: ["<all_urls>"]},
["responseHeaders"]
);	

function setdata_webRequest(e) {
	if (document.getElementById("capture_checkbox").checked == true){
		//console.log(e)
		if (not_on_exlude_list(e.url)){
			if (e.requestId in WEBREQUEST_DATA){
				if (e.requestBody !== undefined){
					i = 1;
					while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
						i++;
					}
					WEBREQUEST_DATA[e.requestId + "-" + i] = []
					WEBREQUEST_DATA[e.requestId + "-" + i].url = e.url
					WEBREQUEST_DATA[e.requestId + "-" + i].originUrl = e.originUrl
					WEBREQUEST_DATA[e.requestId + "-" + i].method = e.method
					WEBREQUEST_DATA[e.requestId + "-" + i].tabId = e.tabId
					WEBREQUEST_DATA[e.requestId + "-" + i].requestBody = e.requestBody
				}
				else if (e.requestHeaders !== undefined) {
					if (WEBREQUEST_DATA[e.requestId].requestHeaders == undefined){
						WEBREQUEST_DATA[e.requestId].requestHeaders = e.requestHeaders
					}
					else {
						i = 1;
						while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
							if (WEBREQUEST_DATA[e.requestId + "-" + i].requestHeaders == undefined){
								WEBREQUEST_DATA[e.requestId + "-" + i].requestHeaders = e.requestHeaders;
								break;
							}
							i++;
						}
						
					}
				}
				else if (e.responseHeaders !== undefined ){
					id = e.requestId
					if (WEBREQUEST_DATA[e.requestId].responseHeaders == undefined){
						WEBREQUEST_DATA[e.requestId].responseHeaders = e.responseHeaders
					}
					else {
						i = 1;
						while ((e.requestId + "-" + i) in WEBREQUEST_DATA){
							if (WEBREQUEST_DATA[e.requestId + "-" + i].responseHeaders == undefined){
								WEBREQUEST_DATA[e.requestId + "-" + i].responseHeaders = e.responseHeaders;
								break;
							}
							i++;
						}
						id = e.requestId + "-" + i
					}
					set_data_html(id)
				}
			}
			else{
				WEBREQUEST_DATA[e.requestId] = []
				WEBREQUEST_DATA[e.requestId].url = e.url
				WEBREQUEST_DATA[e.requestId].originUrl = e.originUrl
				WEBREQUEST_DATA[e.requestId].method = e.method
				WEBREQUEST_DATA[e.requestId].tabId = e.tabId
				WEBREQUEST_DATA[e.requestId].requestBody = e.requestBody
				
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
	windowscreate = browser.windows.create({
		height:610,
		width:610,
		type:"popup",
		url:browser.extension.getURL("HTTPHeaderSub.html")
	})
	windowscreate.then(function (windowscreate) {onSubWindowCreated(windowscreate , requestID)}, onSubWindowError);
}
function onSubWindowCreated(windowscreate ,requestID){
	//console.log("windowscreate:" , windowscreate.tabs[0].id);
	TAB_ID = windowscreate.tabs[0].id
	REQUESTID = requestID
	browser.tabs.onUpdated.addListener(info_tabs)
}
function info_tabs(info_tab , test , tab) {
	//console.log(tab , ":" , info_tab)
	if (tab.status == "complete" && info_tab == TAB_ID){
		browser.tabs.onUpdated.removeListener(info_tabs)
		on_tab_complete(TAB_ID , REQUESTID)
	}
}
function on_tab_complete (tab_id , requestID){
	//console.log("on_tab_complete")
	//console.log(tab_id)
	////console.log(document.getElementById('data_' + SUB_ID).innerHTML)
	tab_send = browser.tabs.sendMessage(
	tab_id ,
	{data:WEBREQUEST_DATA[requestID]}
	)
	tab_send.then(function (){
		null
	},
	function (error) {
		//console.error(`Error: ${error}`);
		on_tab_complete (tab_id , requestID)
	}
	);
}	
function not_on_exlude_list (url_site){
	request_url = new URL(url_site)
	//console.log(url)
	//.pathname split (".") -1
	//.hostname instr ("url") -1
	if (EXLUDE_ITEMS["urls"] !== undefined) {
		for (url of EXLUDE_ITEMS["urls"]) {
			//console.log(url)
			//console.log (request_url.hostname + "###" + request_url.hostname.indexOf(url))
			if (request_url.hostname.indexOf(url) != -1){
				//console.log ("url:" +request_url.hostname)
				return false;
			}
		}	
	} 	
	if (EXLUDE_ITEMS["files"] !== undefined) {
		for (file of EXLUDE_ITEMS["files"]) {
			//console.log(file)
			//console.log (request_url.pathname + "+++" +request_url.pathname.indexOf(file, ((-1) - file.length)))
			if (request_url.pathname.indexOf(file, ((-1) - file.length)) != -1){
				//console.log("file:" + request_url.pathname)
				return false;
			}
		}	
	} 	
	if (EXLUDE_ITEMS["text"] !== undefined){
		if_return = true
		for (text of EXLUDE_ITEMS["text"]) {
			//console.log(url_site , "###" , text , "###", url_site.indexOf(text))
			if (url_site.indexOf(text) >= 0){
				return true;
			} 
			else {if_return = false;}
		}
		if (if_return == true){
			return true;
		} 
		else {return false;}
	} 
	else {
		return true;
	}
	
}

function StorageChange(){
	//console.log("New Storgae")
	gettingItem = browser.storage.local.get();
	gettingItem.then(function (item){
	EXLUDE_ITEMS = item
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


browser.storage.onChanged.addListener(StorageChange);
document.getElementById("clearbutton").addEventListener("click" , function (){document.getElementById("textarea").innerHTML = "" ; WEBREQUEST_DATA = [];})
document.getElementById("optionsbutton").addEventListener ("click" , function (){browser.runtime.openOptionsPage()})
document.getElementById("savefilehref").addEventListener ("click" , function (){
	string = ""
	for (value in WEBREQUEST_DATA){
		//console.log(WEBREQUEST_DATA[value])
		string += WEBREQUEST_DATA[value]["method"] + ":"
		string += WEBREQUEST_DATA[value]["url"] + "\r\n"
		if (WEBREQUEST_DATA[value]["requestHeaders"] != undefined){
			for (data of WEBREQUEST_DATA[value]["requestHeaders"]){
				string += data["name"] + ":" + data["value"] + "\r\n"
			}	
		}
		string2= "\r\n"
		if (WEBREQUEST_DATA[value]["requestBody"] !== null){
			for (data in WEBREQUEST_DATA[value]["requestBody"]["formData"]){
				string2 += data +"="+WEBREQUEST_DATA[value]["requestBody"]["formData"][data][0] + "&"
			}
			string2 = string2.substr(0, string2.length-1)
			
		}
		string += string2 + "\r\n\r\n"
		if (WEBREQUEST_DATA[value]["responseHeaders"] !== null){
			for (data of WEBREQUEST_DATA[value]["responseHeaders"]){
				string += data["name"] + ":" + data["value"] + "\r\n"
			}	
		}
		string += "\r\n-----------------------\r\n\r\n"	
	}
	document.getElementById("savefilehref").href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(string)
	document.getElementById("savefilehref").download = "HTTPHeaderLive.txt"
}
)																																											