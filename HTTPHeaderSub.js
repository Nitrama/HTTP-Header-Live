TAB_ID = ""
function notify(request) {
	//console.log(request.data)
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
	
	temp_headers = header.replace(/\r\n/g, "<br>");
	temp_headers = temp_headers.split("<br>");
	//console.log(temp_headers)
	// The data we are going to send in our request
	var myHeaders = new Headers();
	for (temp_header of temp_headers ){
		split = temp_header.split(": " ,1)
		//console.log(split)
		if (split != ""){
			myHeaders.append(split[0], split[1]);
		}
	}
	
	if (method == "POST"){
		myHeaders.append("Content-type", "application/x-www-form-urlencoded");
	}
	//console.log(request.post )
	data = {  
		"method": method,  
		"headers": myHeaders,
		"mode":"no-cors"
	}
	if (post.length != 0 ){
		data.body = post 
	}
	
	fetch(url , data)  
	.then(  
	function(response) {  
		if (response.status !== 200) {  
			alert('Site Problem. Status Code: ' + response.status);  
			return;  
		}
		response.blob().then(function(data) {  
			//console.log(data);  
			objectURL = URL.createObjectURL(data);
			//console.log(objectURL);  
			//console.log("###",TAB_ID,"###")
			var gettingInfo = browser.tabs.get(TAB_ID );
			gettingInfo.then(function (){on_get_tab(objectURL)}, on_get_tab_error);
			
			
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



function onError(error) {
	console.error('Error:', error);
alert ('Error:'+ error)
} 


browser.runtime.onMessage.addListener(notify);	
document.getElementById("replay_send").addEventListener ("click" , replay_send)
document.getElementById("post_data").addEventListener("input", function() {document.getElementById("content_length").textContent = "Content-Length:" + document.getElementById("post_data").textContent.length});

