chrome.storage.local.get(function(items) {
  //console.log(items)
  if (items["version"] === undefined) {
    update_1(items)
  } else if (items["version"] == 1) {
    update_2(items)
  }
})

function update_1(items) {
  //console.log(items)
  items = {};
  items["version"] = 2;
  items["new_tab_open"] = true;
  items["light_theme"] = true;
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

function update_2(items) {
  items["light_theme"] = true;
  chrome.storage.local.set(items);
}