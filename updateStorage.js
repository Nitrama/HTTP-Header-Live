gettingItem = browser.storage.local.get();
gettingItem.then(onGot, onError);
VERSION = 1;
function onGot(items) {
	//console.log(items["version"])
	if (items["version"] == undefined){
		update_1 (items)
	}
	
}
function update_1 (items){
	items["version"] = 1;
	items["new_tab_open"] = false;
	if (items["urls"] == undefined) {
		items["urls"] = []
	}
	if (items["files"] == undefined) {
		items["files"] = []
	}	
	if (items["text"] == undefined) {
		items["text"] = []
	}
	for (item in items){
		for (value in items[item]) {
			string = items[item][value];
			items[item][value] = {"active": true , "string": string}
		}
	}
browser.storage.local.set(items)
}
function onError(error) {
	console.error(`Error: ${error}`);
}
