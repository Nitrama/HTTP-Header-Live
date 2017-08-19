//console.log("mööööööööööööp")
var SUB_ID = "";

//console.log("Create Window");

browser.webRequest.onBeforeRequest.addListener(
testfuncpost,
{urls: ["<all_urls>"]},
["requestBody"]
);

browser.webRequest.onBeforeSendHeaders.addListener(
testfuncHeaders,
{urls: ["<all_urls>"]},
["requestHeaders"]
);	



function testfuncpost(e) {
	if (e.requestBody !== null) {
		notify({post: e , header: null , tab_id: e.tabId})
	}
}
function testfuncHeaders(e){
	if (e.requestHeaders !== null) {
		notify({header: e , post: null, tab_id: e.tabId})
	}
}

function notify(request) {
	//console.log("-------------------------------------");
	////console.log(request.data);
	if (request.header !== null){
		
		request_ID = request.header.requestId;
		header = request.header;
		if (header.url != ""){
			is_id_exist(request_ID);
			//console.log("header ID: " + request_ID)
			//console.log("header:")
			//console.log(header)
			url_pre = document.createElement("pre");
			url_pre.className = 'big'
			url_pre.id = 'url'
			url_pre.textContent = header.url
			document.getElementById("header_"+request_ID).appendChild(url_pre) ;
			
			for (var i of header.requestHeaders) {
				header_pre = document.createElement("pre");
				header_pre.setAttribute("name", 'header')
				header_pre.textContent = i.name + ": " + i.value
				document.getElementById("header_"+request_ID).appendChild(header_pre)
			}
			
		}
	}
	if (request.post !== null){
		request_ID = request.post.requestId;
		post = request.post;
		
		//console.log("post:")
		//console.log(post);
		string = ""
		if (post.requestBody !== undefined){
			is_id_exist(request_ID);
			for (var i in post.requestBody.formData) {
				////console.log(i)
				string += i + "=" + post.requestBody.formData[i] + "&";
			}
			string = string.substr(0, string.length-1)
			document.getElementById("post_"+request_ID).textContent =  string;
		}
	}
}

function is_id_exist (id) {
	////console.log("IS ID:" + id + "##" + document.getElementById('data_' +id))
	if (document.getElementById('data_' +id) == null){ 
		
		newdata = document.createElement("div");
		newdata.id = 'data_' + id
		newdata.className = "data"
		newdata.onclick = function() { 
			clicked_data(id);
		};
		document.getElementById("textarea").appendChild (newdata);
		
		newheader = document.createElement("div");
		newheader.id = 'header_' + id
		
		newpost = document.createElement("pre");
		newpost.id = 'post_' + id
		newpost.className = 'big'
		
		newdata.appendChild(newheader)
		newdata.appendChild(newpost)
		
		} else {
		//console.log ("ID Exists")
	}
}

document.getElementById("clearbutton").onclick = clear_text;
function clear_text(){
	document.getElementById("textarea").innerHTML = ""
	
}

function clicked_data(id){
	SUB_ID = id;
	windowscreate = browser.windows.create({
		height:600,
		width:600,
		type:"popup",
		url:browser.extension.getURL("HttpHeaderSub.html")
	})
	
	windowscreate.then(onSubWindowCreated, onSubWindowError);
}

function onSubWindowCreated(windowscreate){
	console.log('Sub Window Created');
	////console.log(windowscreate);
	////console.log(windowscreate.tabs[0].id);
	////console.log(document.getElementById('data_' + SUB_ID).innerHTML)
	tab_send = browser.tabs.sendMessage(
	windowscreate.tabs[0].id,
	{post:document.getElementById('post_' + SUB_ID).innerHTML, 
		header:	document.getElementById('header_' + SUB_ID).innerHTML
	}
	)
	tab_send.then(null, tab_sendError);
	
	
};

function onSubWindowError(){
	console.error('Windows Error');
};
function tab_sendError(error) {
	console.log(`tab_sendError: ${error}`);
} 


//browser.tabs.onRemoved.addListener(testfuncHeaders)
//browser.tabs.onRemoved.addListener(testfuncpost)													