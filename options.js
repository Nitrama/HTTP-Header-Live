gettingItem = browser.storage.local.get();
gettingItem.then(onGot, onError);
function onGot(item) {
	if (item["urls"] != undefined) {
		var x = document.getElementById("exclude_url");
		for (url in item["urls"]) {
			var option = document.createElement("option");
			option.text = item["urls"][url];
			option.value = url
			x.add(option); 
		}	
	}
	if (item["files"] != undefined) {
		var x = document.getElementById("exclude_file");
		for (file in item["files"]) {
			var option = document.createElement("option");
			option.text = item["files"][file];
			option.value = file
			x.add(option); 
		}	
	}
	if (item["open_tab"] != undefined) {
	}
	//console.log(item)
}

function new_url(){
	url = document.getElementById("input_new_url").value;
	document.getElementById("input_new_url").value = "";
	if (url != ""){
		var x = document.getElementById("exclude_url");
		var option = document.createElement("option");
		option.text = url;
		x.add(option); 
		gettingItem = browser.storage.local.get("urls");
		gettingItem.then(function (item){
			if (item["urls"] == undefined) {
				item["urls"] = [url]
			} else {item["urls"].push(url)}
			browser.storage.local.set({urls: item["urls"]})
			document.getElementById("exclude_url").textContent = "";
			document.getElementById("exclude_file").textContent = "";
			gettingItem = browser.storage.local.get();
			gettingItem.then(onGot, onError);
		}
		, onError);
	}
}

function new_file(){
	file = document.getElementById("input_new_file").value;
	document.getElementById("input_new_file").value = "";
	if (file != ""){
		var x = document.getElementById("exclude_file");
		var option = document.createElement("option");
		option.text = file;
		x.add(option); 
		gettingItem = browser.storage.local.get(["files"]);
		gettingItem.then(function (item){
			if (item["files"] == undefined) {
				item["files"] = [file]
			} else {item["files"].push(file)}
			browser.storage.local.set({files: item["files"]})
			document.getElementById("exclude_url").textContent = "";
			document.getElementById("exclude_file").textContent = "";
			gettingItem = browser.storage.local.get();
			gettingItem.then(onGot, onError);
		}
		, onError);
	}
}
function delete_url(){
	var e = document.getElementById("exclude_url");
	if (e.options[e.selectedIndex] !== undefined){
		var value = e.options[e.selectedIndex].value;
		gettingItem = browser.storage.local.get(["urls"]);
		gettingItem.then(function (item){
			if (item["urls"] != undefined) {
				item["urls"].splice(value, 1)
				browser.storage.local.set({urls: item["urls"]})
				document.getElementById("exclude_url").textContent = "";
				document.getElementById("exclude_file").textContent = "";
				gettingItem = browser.storage.local.get();
				gettingItem.then(onGot, onError);
			}
		}
		, onError);
	}
}

function delete_file(){
	var e = document.getElementById("exclude_file");
	if (e.options[e.selectedIndex] !== undefined){
		var value = e.options[e.selectedIndex].value;
		gettingItem = browser.storage.local.get(["files"]);
		gettingItem.then(function (item){
			if (item["files"] != undefined) {
				item["files"].splice(value, 1)
				browser.storage.local.set({files: item["files"]})
				document.getElementById("exclude_url").textContent = "";
				document.getElementById("exclude_file").textContent = "";
				gettingItem = browser.storage.local.get();
				gettingItem.then(onGot, onError);
			}
		}, onError);
		
	}
}



function onError(error) {
	console.error(`Error: ${error}`);
}
document.getElementById("button_delete_url").onclick = delete_url;
document.getElementById("button_delete_file").onclick = delete_file;	
document.getElementById("button_new_url").onclick = new_url;
document.getElementById("button_new_file").onclick = new_file;								