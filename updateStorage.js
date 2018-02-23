VERSION = 1;
chrome.storage.local.get(function(items){
    //console.log(items)
	if (items["version"] === undefined){
		update_1 (items)
	}
	
})
function update_1 (items){
	//console.log(items)
	items = {};
	items["version"] = 1;
	items["new_tab_open"] = true;
	if (items["urls"] == undefined) {
		items["urls"] = []
	}
	if (items["files"] == undefined) {
		items["files"] = []
	}	
	if (items["text"] == undefined) {
		items["text"] = []
	}
	//console.log(items)
	
chrome.storage.local.set(items);
}
