gettingItem = browser.storage.local.get();
gettingItem.then(onGot, onError);
function onGot(item) {
	if (item["urls"] != undefined) {
		adding_to_select ("exclude_url" , item["urls"])
	}
	if (item["files"] != undefined) {
		adding_to_select ("exclude_file" , item["files"])	
	}	
	if (item["text"] != undefined) {
		adding_to_select ("include_text" , item["text"])
	}
	if (item["new_tab_open"] != undefined) {
		if (item["new_tab_open"] == true){
		document.getElementById("newtab_checkbox").setAttribute("checked" ,true )
		}
	}
	//console.log(item)
}

function adding_to_select (id , items){
	var x = document.getElementById(id);
	for (item in items) {
		var option = document.createElement("option");
		option.text = items[item];
		option.value = item
		x.add(option); 
	}	
}

function new_string (id, storageid){
	string = document.getElementById(id).value;
	document.getElementById(id).value = "";
	if (string != ""){
		gettingItem = browser.storage.local.get(storageid);
		gettingItem.then(function (item){
			if (item[storageid] == undefined) {
				item[storageid] = [string]
			} else {item[storageid].push(string)}
			browser.storage.local.set({[storageid]: item[storageid]})
			clear_select()
		}
		, onError);
	}
}

function delete_item_from_storage(id, storageid){
	var e = document.getElementById(id);
	if (e.options[e.selectedIndex] !== undefined){
		var value = e.options[e.selectedIndex].value;
		gettingItem = browser.storage.local.get([storageid]);
		gettingItem.then(function (item){
			if (item[storageid] !== undefined) {
				item[storageid].splice(value ,1)
				browser.storage.local.set({[storageid]: item[storageid]})
				clear_select()
			}
		}, onError);
	}
}

function clear_select(){
	document.getElementById("exclude_url").textContent = "";
	document.getElementById("exclude_file").textContent = "";
	document.getElementById("include_text").textContent = "";
	gettingItem = browser.storage.local.get();
	gettingItem.then(onGot, onError);
}

function checkbox_change_new_tab (){
	if (document.getElementById("newtab_checkbox").checked == true){
		browser.storage.local.set({"new_tab_open": true})
	} 
	else{
		browser.storage.local.set({"new_tab_open": false})
	}
	
}

function onError(error) {
	console.error(`Error: ${error}`);
}

document.getElementById("button_delete_url").onclick = function (){delete_item_from_storage("exclude_url", "urls")};
document.getElementById("button_delete_file").onclick = function (){delete_item_from_storage("exclude_file", "files")};	
document.getElementById("button_delete_text").onclick = function (){delete_item_from_storage("include_text", "text")};	
document.getElementById("button_new_url").onclick = function (){new_string("input_new_url", "urls")};
document.getElementById("button_new_file").onclick = function (){new_string("input_new_file", "files")};			
document.getElementById("button_new_text").onclick = function (){new_string("input_new_text", "text")};		
document.getElementById("newtab_checkbox").onchange = checkbox_change_new_tab;	