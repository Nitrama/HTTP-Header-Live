gettingItem = browser.storage.local.get();
gettingItem.then(onGot, onError);
var LAST_SELECT = {"urls": "" , "files" : "" , "text" : ""};
function onGot(item) {
	adding_to_select ("exclude_url" , item["urls"] , "urls")
	adding_to_select ("exclude_file" , item["files"] , "files")		
	adding_to_select ("include_text" , item["text"] ,"text")
	if (item["new_tab_open"] == true){
		document.getElementById("newtab_checkbox").setAttribute("checked" ,true )
	}
}

function adding_to_select (id , items , storageid){
	//console.log("test")
	var x = document.getElementById(id);
	LAST_SELECT[storageid] = ""
	//console.log(items)
	for (item in items) {
		var li = document.createElement("li");
		var label = document.createElement("label");
		var input = document.createElement("input");
		input.setAttribute("type","checkbox")	
		input.onchange  = function (storageid , item){  
			return function () {
				checkbox_change (storageid,item)
			}
		}(storageid , item);
		input.value = item
		label.textContent = items[item]["string"];
		if (items[item]["active"] == true){
			input.setAttribute("checked" ,true )
		}
		label.insertBefore(input, label.childNodes[0]);
		label.onclick  = function (storageid , item , label){  
			return function () {
				LAST_SELECT[storageid] = item ;		
				if  (document.getElementById ("select_label") != null ) {document.getElementById ("select_label").id = ""}
				label.id = "select_label";
			}
		}(storageid , item , label);
		li.appendChild(label);
		x.appendChild(li);
	}	
}

function new_string (id, storageid){
	string = document.getElementById(id).value;
	document.getElementById(id).value = "";
	if (string != ""){
		gettingItem = browser.storage.local.get(storageid);
		gettingItem.then(function (item){
			item[storageid].push({"active":true, "string":string})
			browser.storage.local.set({[storageid]: item[storageid]})
			clear_select()
		}
		, onError);
	}
}

function delete_item_from_storage(storageid){
	if (LAST_SELECT[storageid] !== ""){
		gettingItem = browser.storage.local.get([storageid]);
		gettingItem.then(function (item){
			item[storageid].splice(LAST_SELECT[storageid] , 1)
			browser.storage.local.set({[storageid]: item[storageid]})
			clear_select()
		}, onError);
	}
}

function deactivate_all (storageid){
	gettingItem = browser.storage.local.get([storageid]);
	gettingItem.then(function (items){
		for (item in items[storageid]) {
			items[storageid][item]["active"] = false;
		}
		browser.storage.local.set({[storageid]: items[storageid]})	
		clear_select()
	}, onError);
}
function activate_all (storageid){
	gettingItem = browser.storage.local.get([storageid]);
	gettingItem.then(function (items){
		for (item in items[storageid]) {
			items[storageid][item]["active"] = true;
		}
		browser.storage.local.set({[storageid]: items[storageid]})	
		clear_select()
	}, onError);
}

function clear_select(){
	document.getElementById("exclude_url").textContent = "";
	document.getElementById("exclude_file").textContent = "";
	document.getElementById("include_text").textContent = "";
	gettingItem = browser.storage.local.get();
	gettingItem.then(onGot, onError);
}
function checkbox_change(storageid , item){
	
	gettingItem = browser.storage.local.get([storageid]);
	gettingItem.then(function (items){
		if (items[storageid][item]["active"] == true){
			items[storageid][item]["active"] = false
		} else{items[storageid][item]["active"] = true}
		browser.storage.local.set({[storageid]: items[storageid]})
	}, onError);
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
document.getElementById("button_activate_url").onclick = function (){activate_all("urls")};
document.getElementById("button_deactivate_url").onclick = function (){deactivate_all("urls")};
document.getElementById("button_activate_file").onclick = function (){activate_all("files")};
document.getElementById("button_deactivate_file").onclick = function (){deactivate_all("files")};
document.getElementById("button_activate_text").onclick = function (){activate_all("text")};
document.getElementById("button_deactivate_text").onclick = function (){deactivate_all("text")};
document.getElementById("button_delete_url").onclick = function (){delete_item_from_storage("urls")};
document.getElementById("button_delete_file").onclick = function (){delete_item_from_storage("files")};	
document.getElementById("button_delete_text").onclick = function (){delete_item_from_storage("text")};	
document.getElementById("button_new_url").onclick = function (){new_string("input_new_url", "urls")};
document.getElementById("button_new_file").onclick = function (){new_string("input_new_file", "files")};			
document.getElementById("button_new_text").onclick = function (){new_string("input_new_text", "text")};		
document.getElementById("newtab_checkbox").onchange = checkbox_change_new_tab;	