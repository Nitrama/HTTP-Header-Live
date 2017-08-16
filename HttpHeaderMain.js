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
		////console.log(e.requestpost)
		notify({post: e , header: null , tab_id: e.tabId})
	}
}
function testfuncHeaders(e){
	if (e.requestHeaders !== null) {
		////console.log (e.requestHeaders)
		////console.log(WindowInfo.tabs[0])
		notify({header: e , post: null, tab_id: e.tabId})
	}
}

function notify(request) {
	set_url=0
	//console.log("-------------------------------------");
	////console.log(request.data);
	if (request.header !== null){
		
		request_ID = request.header.requestId;
		header = request.header;
		if (header.url != ""){
			is_id_exist(request_ID);
			//console.log("header ID: " + request_ID)
			console.log("header:")
			console.log(header)

				document.getElementById("header_"+request_ID).innerHTML += "<pre class='big' id='url'>" + header.url + "</pre>" ;

			for (var i of header.requestHeaders) {
				document.getElementById("header_"+request_ID).innerHTML += "<pre name='header'>" + i.name + ": " + i.value + "</pre>" ;
			}
		}
	}
	if (request.post !== null){
		request_ID = request.post.requestId;
		post = request.post;
		
		console.log("post:")
		console.log(post);
		string = ""
		if (post.requestBody !== undefined){
		is_id_exist(request_ID);
			for (var i in post.requestBody.formData) {
				////console.log(i)
				string += i + "=" + post.requestBody.formData[i] + "&";
			}
			string = string.substr(0, string.length-1)
			document.getElementById("post_"+request_ID).innerHTML =  string;
		}
	}
	//console.log("--------------------------------------")
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
	//console.log('Sub Window Created');
	////console.log(windowscreate);
	////console.log(windowscreate.tabs[0].id);
	////console.log(document.getElementById('data_' + SUB_ID).innerHTML)
	browser.tabs.sendMessage(
	windowscreate.tabs[0].id,
	{data:document.getElementById('data_' + SUB_ID).innerHTML , id: SUB_ID }
	)
	
	
};

function onSubWindowError(){
	console.error('Windows Error');
};

//browser.tabs.onRemoved.addListener(testfuncHeaders)
//browser.tabs.onRemoved.addListener(testfuncpost)										
