//console.log("mööööööööööööp")
var EXLUDE_ITEMS = ""
var WEBREQUEST_DATA = []
var TAB_ID = ""
var REQUESTID
gettingItem = browser.storage.local.get();
gettingItem.then(function (item){
	EXLUDE_ITEMS = item
	
})


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

function setdata_webRequest(e) {
	if (document.getElementById("capture_checkbox").checked == true){
		//console.log(e)
		if (not_on_exlude_list(e.url)){
			if (e.requestId in WEBREQUEST_DATA){
				if (e.requestBody !== undefined) {
					WEBREQUEST_DATA[e.requestId].requestBody = e.requestBody
				}
				else if (e.requestHeaders !== undefined) {
					WEBREQUEST_DATA[e.requestId].requestHeaders = e.requestHeaders
				}
				set_data_html(e.requestId , true)
			}
			else{
				WEBREQUEST_DATA[e.requestId] = []
				WEBREQUEST_DATA[e.requestId].url = e.url
				WEBREQUEST_DATA[e.requestId].originUrl = e.originUrl
				WEBREQUEST_DATA[e.requestId].method =  e.method
				WEBREQUEST_DATA[e.requestId].tabId =  e.tabId
				if (e.requestBody !== undefined) {
					WEBREQUEST_DATA[e.requestId].requestBody = e.requestBody
				}
				else if (e.requestHeaders !== undefined) {
					WEBREQUEST_DATA[e.requestId].requestHeaders = e.requestHeaders
				}
				set_data_html(e.requestId)
			}
			
		}
		//console.log(WEBREQUEST_DATA)
	}
}


function set_data_html (ID , reload = false){
	if (reload == false){
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
		if (WEBREQUEST_DATA[ID].requestBody !== undefined && WEBREQUEST_DATA[ID].requestBody != null){
			string = ""
			for (var i in WEBREQUEST_DATA[ID].requestBody.formData) {
				string += i + "=" + WEBREQUEST_DATA[ID].requestBody.formData[i] + "&";
			}
			string = string.substr(0, string.length-1)
			newpost.textContent = string;
		}
		newdata.appendChild(newpost)
		
		document.getElementById("textarea").appendChild (newdata);
	}
	else {
		
		
		d = document.getElementById("textarea")
		d_nested = document.getElementById("data_" + ID);
		d_nested.removeEventListener ("click", function(e) {clicked_data(e, ID)})
		throwawayNode = d.removeChild(d_nested);
		set_data_html(ID)
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
	//console.log(tab)
	if (tab.status == "complete" && info_tab == TAB_ID){
		browser.tabs.onUpdated.removeListener(info_tabs)
		on_tab_complete(TAB_ID , REQUESTID)
	}
}

function on_tab_complete (tab_id , requestID){
	//console.log("on_tab_complete")
	//console.log(tab_id)
	//console.log("2")
	
	////console.log(document.getElementById('data_' + SUB_ID).innerHTML)
	tab_send = browser.tabs.sendMessage(
	tab_id ,
	{data:WEBREQUEST_DATA[requestID]}
	)
	tab_send.then(function (){
		null
	},
	function (error) {console.error(`Error: ${error}`);}
	);
}	

function not_on_exlude_list (url){
	request_url = new URL(url)
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
	return true;
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


document.getElementById("clearbutton").addEventListener("click" , function (){document.getElementById("textarea").innerHTML = ""})
document.getElementById("optionsbutton").addEventListener ("click" , function (){browser.runtime.openOptionsPage()})



