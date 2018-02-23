var TAB_ID = ""
var RESENDED_TAB = false
var RESEND_TAB_NEW = "";
StorageChange()
//console.log("muuup")
function notify(request) {
	//console.log(request)
	document.getElementById("select_method").value = request.data.method;
	document.getElementById("header_url").value = request.data.url;
	TAB_ID  = request.data.tabId
	if (request.data.requestHeaders !== undefined){
		string = ""
		for (var i of request.data.requestHeaders) {
			string += i.name + ": " + i.value + "\r\n"
		}
	}
	document.getElementById("header_data").textContent = string;
	
	if (request.data.requestBody !== undefined && request.data.requestBody != null){
		string = ""
		for (var i in request.data.requestBody.formData) {
			string += i + "=" + request.data.requestBody.formData[i] + "&";
		}
		string = string.substr(0, string.length-1)
		document.getElementById("post_data").textContent = string;
		document.getElementById("content_length_label").textContent = chrome.i18n.getMessage("content_length_label") + string.length
	}
	
}

function replay_send(){
	url = document.getElementById("header_url").value
	method = document.getElementById("select_method").value
	post = document.getElementById("post_data").textContent
	header = document.getElementById("header_data").textContent,
	//console.log(header)
	temp_headers = header.replace(/\r\n/g, "<br>");
	temp_headers = temp_headers.split("<br>");
	//console.log(temp_headers)
	// The data we are going to send in our request
	var myHeaders = new Headers();
	for (temp_header of temp_headers ){
		split = temp_header.split(": " ,2)
		//console.log(split)
		if (split != ""){
			myHeaders.append(split[0], split[1]);
		}
	}
	data = {  
		"method": method
	}
	if (method != "GET"){
		//console.log(post ,":",post.length,":", method)
		myHeaders.delete("Content-type")
		myHeaders.append("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		//console.log(post ,":",post.length,":", method)
		if (post.length != 0 ){
			data.body = post 
		}
	}
	data.headers = myHeaders
	fetch(url , data)  
	.then(  
	function(response) {  
		response.blob().then(function(data) {
			objectURL = URL.createObjectURL(data);
			//console.log(objectURL);  		
			if (RESEND_TAB_NEW == true){
				if (RESENDED_TAB == true){
					tab_exists(objectURL)
				}
				else {
					RESENDED_TAB = true
					tab_create(objectURL)
				}
			}
			else {	
				tab_exists(objectURL)
			}
		});  
	}  
	)  
	.catch(function(err) {  
		console.error('Fetch Error:', err);  
	});
}
function tab_create (objectURL){
	chrome.windows.getAll ({windowTypes:['normal']}, function (getwindows){
		//console.log(getwindows)
		for (windows of getwindows){
			if (windows.type == "normal"){
				WINDOW_ID = windows.id
				break;
			}
		}
		chrome.tabs.create({windowId : WINDOW_ID, url:objectURL} , function (tab){ 
			if (chrome.runtime.lastError) {
				onError(chrome.runtime.lastError)
				} else{
				TAB_ID = tab.id
			}
		})
	})
	
}

function tab_exists(objectURL){
	chrome.tabs.get(TAB_ID , function (){ 
		if (chrome.runtime.lastError) {
			tab_create(objectURL)
		} 
		else {
			chrome.tabs.update( TAB_ID , {url: objectURL} , function (){
				//chrome.tabs.create({url: bloburl} , function (){ 
				if (chrome.runtime.lastError) {
					onError(chrome.runtime.lastError)
				}
			})
		}
	})
}

function StorageChange(){
	//console.log("New Storage")
	gettingItem = chrome.storage.local.get(function (item){
		if (item["new_tab_open"] == true){
			RESEND_TAB_NEW = true;
		} 
		else {
			RESEND_TAB_NEW = false;
		}
	})
}
function onError(error) {
	console.error('Error:', error);
	alert ('Error:'+ error)
} 
chrome.storage.onChanged.addListener(StorageChange);
chrome.runtime.onMessage.addListener(notify);	
document.getElementById("replay_send_button").addEventListener ("click" , replay_send)
document.getElementById("post_data").addEventListener("input", function() {document.getElementById("content_length_label").textContent = chrome.i18n.getMessage("content_length_label") + document.getElementById("post_data").textContent.length});							