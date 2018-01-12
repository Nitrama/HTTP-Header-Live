TAB_ID = ""
LASTET_TAB = false
RESEND_TAB_NEW = "";
StorageChange()
//console.log("muuup")
function notify(request) {
	//console.log(request.data.method)
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
		document.getElementById("content_length").textContent = "Content-Length:" + document.getElementById("post_data").textContent.length
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
			//console.log(data);  
			objectURL = URL.createObjectURL(data);
			//console.log(objectURL);  
			//console.log("###",TAB_ID,"###")
			
			if (RESEND_TAB_NEW == true){
				if (LASTET_TAB == ""){
					var getting = browser.windows.getAll({
						windowTypes: ["normal"]
					});
					getting.then(function (get_windows){
						//console.log(get_windows)
						for (windows of get_windows) {
							if (windows["type"] == "normal"){
								var creating = browser.tabs.create({active:false, windowId : windows["id"]});
								creating.then(function(tab){TAB_ID = tab.id , LASTET_TAB = true}, onError);
								var gettingInfo = browser.tabs.get(TAB_ID );
								gettingInfo.then(function (){on_get_tab(objectURL)}, on_get_tab_error);
								break
							}
						}
					}, onError);
				}
				else {
					var gettingInfo = browser.tabs.get(TAB_ID );
					gettingInfo.then(function (){on_get_tab(objectURL)}, on_get_tab_error);
				}
			}
			else {
				var gettingInfo = browser.tabs.get(TAB_ID );
				gettingInfo.then(function (){on_get_tab(objectURL)}, on_get_tab_error);
			}
			
		});  
		}  
	)  
	.catch(function(err) {  
		console.error('Fetch Error:', err);  
	});
}

function on_get_tab(bloburl) {
	var updating = browser.tabs.update(TAB_ID , {url: bloburl});
	updating.then(null, onError);
} 

function on_get_tab_error() {
	var getting = browser.windows.getAll({
		windowTypes: ["normal"]
	});
	
	getting.then(windows, onError);
	
} 
function windows(windowInfoArray) {
	
	var create = browser.tabs.create({windowId:windowInfoArray[0].id});
	create.then(create_tab , onError);
}

function create_tab (info_tab){
	TAB_ID = info_tab.id
	replay_send()
}


function StorageChange(){
	//console.log("New Storgae")
	gettingItem = browser.storage.local.get();
	gettingItem.then(function (item){
		EXLUDE_ITEMS = item
		RESEND_TAB_NEW
		if (item["new_tab_open"] !== undefined) {
			if (item["new_tab_open"] == true){
				RESEND_TAB_NEW = true;
			} 
			else {
				RESEND_TAB_NEW = false;
			}
		}
	})
}
function onError(error) {
	console.error('Error:', error);
	alert ('Error:'+ error)
} 


browser.runtime.onMessage.addListener(notify);	
document.getElementById("replay_send").addEventListener ("click" , replay_send)
document.getElementById("post_data").addEventListener("input", function() {document.getElementById("content_length").textContent = "Content-Length:" + document.getElementById("post_data").textContent.length});

