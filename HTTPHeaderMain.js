var EXLUDE_ITEMS = {};
var WEBREQUEST_DATA = {};
var capture_checkbox = true;
var auto_scroll_checkbox = true;
StorageChange();

chrome.webRequest.onBeforeRequest.addListener(
  function(test) {
    test["typ"] = "onBeforeRequest";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  },
  ["requestBody"]
);
chrome.webRequest.onSendHeaders.addListener(
  function(test) {
    test["typ"] = "onSendHeaders";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  },
  ["requestHeaders"]
);
chrome.webRequest.onHeadersReceived.addListener(
  function(test) {
    test["typ"] = "onHeadersReceived";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  },
  ["responseHeaders"]
);
chrome.webRequest.onAuthRequired.addListener(
  function(test) {
    test["typ"] = "onAuthRequired";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  },
  ["responseHeaders"]
);
chrome.webRequest.onResponseStarted.addListener(
  function(test) {
    test["typ"] = "onResponseStarted";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  }
);
chrome.webRequest.onBeforeRedirect.addListener(
  function(test) {
    test["typ"] = "onBeforeRedirect";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  }
);
chrome.webRequest.onCompleted.addListener(
  function(test) {
    test["typ"] = "onCompleted";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  }
);
chrome.webRequest.onErrorOccurred.addListener(
  function(test) {
    test["typ"] = "onErrorOccurred";
    setdata_webRequest(test);
  },
  {
    urls: ["<all_urls>"]
  }
);

function setdata_webRequest(e) {
  if (capture_checkbox == true) {
    if (not_on_exlude_list(e.url)) {
      if (e.requestId.indexOf("fakeRequest") >= 0) {
        return;
      }
      i = 0;
      if (WEBREQUEST_DATA[e.requestId] == undefined) {
        WEBREQUEST_DATA[e.requestId] = [];
      }
      while (true) {
        if (e.typ == "onCompleted" || e.typ == "onResponseStarted") {
          i = WEBREQUEST_DATA[e.requestId].length - 1;
          WEBREQUEST_DATA[e.requestId][i][e.typ] = e;
          break;
        }
        if (WEBREQUEST_DATA[e.requestId][i] == undefined) {
          WEBREQUEST_DATA[e.requestId][i] = {};
        }
        if (WEBREQUEST_DATA[e.requestId][i][e.typ] != undefined) {
          i++;
        } else {
          WEBREQUEST_DATA[e.requestId][i][e.typ] = e;
          break;
        }
      }
      set_data_html(e.requestId, i, e.typ);
    }
  }
}

function set_data_html(requestID, id, typ) {
  //console.log(requestID,id,typ, WEBREQUEST_DATA[requestID][id][typ])
  if (document.getElementById("data_" + requestID + "_" + id) == undefined) {
    data = document.createElement("div");
    data.id = "data_" + requestID + "_" + id;
    data.className = "data";
    data.addEventListener("click", function(e) {
      clicked_data(requestID, id);
    });
    // data.onmouseover = function (){console.log(requestID,id,typ, WEBREQUEST_DATA[requestID][id])};
    // ONLY DEBUG DEACTIVATE THIS ^^^^^^^^^^^^^^^^^^^^^
    SendHeadersData = document.createElement("div");
    SendHeadersData.id = "SendHeadersData_" + requestID + "_" + id;
    SendHeadersUrl = document.createElement("pre");
    SendHeadersUrl.id = "SendHeadersUrl_" + requestID + "_" + id;
    SendHeadersUrl.className = "big";
    SendHeaders = document.createElement("pre");
    SendHeaders.id = "SendHeaders_" + requestID + "_" + id;
    SendHeadersData.appendChild(SendHeadersUrl);
    SendHeadersData.appendChild(SendHeaders);
    data.appendChild(SendHeadersData);
    SendPostData = document.createElement("pre");
    SendPostData.id = "SendPostData_" + requestID + "_" + id;
    SendPostData.className = "big";
    data.appendChild(SendPostData);
    statusLine = document.createElement("pre");
    statusLine.id = "statusLine_" + requestID + "_" + id;
    statusLine.className = "big";
    ResponseHeadersData = document.createElement("div");
    ResponseHeadersData.id = "ResponseHeaderData" + requestID + "_" + id;
    ResponseHeaders = document.createElement("pre");
    ResponseHeaders.id = "ResponseHeaders_" + requestID + "_" + id;
    ResponseHeadersData.appendChild(statusLine);
    ResponseHeadersData.appendChild(ResponseHeaders);
    data.appendChild(ResponseHeadersData);
    document.getElementById("textarea").appendChild(data);
  }
  if (typ == "onBeforeRequest") {
    //checked
    document.getElementById(
      "SendHeadersUrl_" + requestID + "_" + id
    ).textContent = decodeURI(WEBREQUEST_DATA[requestID][id][typ].url);
    string = "";
    if (WEBREQUEST_DATA[requestID][id][typ].requestBody != undefined) {
      if (
        WEBREQUEST_DATA[requestID][id][typ].requestBody.formData != undefined
      ) {
        for (var i in WEBREQUEST_DATA[requestID][id][typ].requestBody
          .formData) {
          string +=
            i +
            "=" +
            WEBREQUEST_DATA[requestID][id][typ].requestBody.formData[i] +
            "&";
        }
        string = string.substr(0, string.length - 1);
      } else if (
        WEBREQUEST_DATA[requestID][id][typ].requestBody.raw != undefined
      ) {
        utf8decode = new TextDecoder("utf-8");
        string = utf8decode.decode(
          WEBREQUEST_DATA[requestID][id][typ].requestBody.raw[0].bytes
        );
      }
    }
    document.getElementById(
      "SendPostData_" + requestID + "_" + id
    ).textContent = string;
  } else if (typ == "onSendHeaders") {
    //checked
    string = "";
    for (var i of WEBREQUEST_DATA[requestID][id][typ].requestHeaders) {
      string += i.name + ": " + i.value + "\r\n";
    }
    document.getElementById(
      "SendHeaders_" + requestID + "_" + id
    ).textContent = string;
  } else if (typ == "onHeadersReceived") {
    string = "";
    for (var i of WEBREQUEST_DATA[requestID][id][typ].responseHeaders) {
      string += i.name + ": " + i.value + "\r\n";
    }
    document.getElementById(
      "ResponseHeaders_" + requestID + "_" + id
    ).textContent = string;
    document.getElementById("statusLine_" + requestID + "_" + id).textContent =
      WEBREQUEST_DATA[requestID][id][typ].method +
      ": " +
      WEBREQUEST_DATA[requestID][id][typ].statusLine;
  } else if (typ == "onAuthRequired") {
    string = "";
    for (var i of WEBREQUEST_DATA[requestID][id][typ].responseHeaders) {
      string += i.name + ": " + i.value + "\r\n";
    }
    document.getElementById(
      "ResponseHeaders_" + requestID + "_" + id
    ).textContent = string;
    document.getElementById("statusLine_" + requestID + "_" + id).textContent =
      WEBREQUEST_DATA[requestID][id][typ].method +
      ": " +
      WEBREQUEST_DATA[requestID][id][typ].statusLine;
  } else if (typ == "onResponseStarted") {
    //checked
    document.getElementById("statusLine_" + requestID + "_" + id).textContent =
      WEBREQUEST_DATA[requestID][id][typ].method +
      ": " +
      WEBREQUEST_DATA[requestID][id][typ].statusLine;
  } else if (typ == "onBeforeRedirect") {
    //checked
  } else if (typ == "onCompleted") {
    //checked
  } else if (typ == "onErrorOccurred") {
    //checked
    document.getElementById("statusLine_" + requestID + "_" + id).textContent =
      WEBREQUEST_DATA[requestID][id][typ].error;
  }
  if (auto_scroll_checkbox == true) {
    document.getElementById("textarea").scrollTop =
      document.getElementById("textarea").scrollHeight -
      document.getElementById("textarea").clientHeight;
  }
}

function clicked_data(requestID, id) {
  windowscreate = chrome.windows.create(
    {
      height: 600,
      width: 800,
      type: "popup",
      url: chrome.extension.getURL("HTTPHeaderSub.html")
    },
    function(windowscreate) {
      TAB_ID = windowscreate.tabs[0].id;

      function info_tabs(info_tab, test, tab) {
        if (
          tab.status == "complete" &&
          info_tab == TAB_ID &&
          tab.title == "HTTP Header Live Sub"
        ) {
          chrome.tabs.onUpdated.removeListener(info_tabs);
          on_tab_complete(TAB_ID, requestID, id);
        }
      }
      chrome.tabs.onUpdated.addListener(info_tabs);
    }
  );
}

function on_tab_complete(tab_id, requestID, id) {
  chrome.tabs.sendMessage(
    tab_id,
    {
      data: WEBREQUEST_DATA[requestID][id]
    },
    function() {
      if (chrome.runtime.lastError) {
        //onError(chrome.runtime.lastError)
      }
    }
  );
}

function not_on_exlude_list(url_site) {
  request_url = new URL(url_site);
  for (url of EXLUDE_ITEMS["urls"]) {
    if (url["active"] == true) {
      if (request_url.hostname.indexOf(url["string"]) != -1) {
        return false;
      }
    }
  }
  for (file of EXLUDE_ITEMS["files"]) {
    if (file["active"] == true) {
      if (
        request_url.pathname.indexOf(file["string"], -1 - file.length) != -1
      ) {
        return false;
      }
    }
  }
  if_return = true;
  for (text of EXLUDE_ITEMS["text"]) {
    if (text["active"] == true) {
      if (url_site.indexOf(text["string"]) >= 0) {
        return true;
      } else {
        if_return = false;
      }
    }
  }
  if (if_return == true) {
    return true;
  } else {
    return false;
  }
}

function StorageChange() {
  chrome.storage.local.get(function(items) {
    EXLUDE_ITEMS = items;
  });
}

function save_file() {
  doc = document.getElementById("textarea");
  string = "";
  for (i = 0; i < doc.children.length; i++) {
    string += doc.children[i].children[0].children[0].textContent + "\r\n"; //URL
    string += doc.children[i].children[0].children[1].textContent; //SendHeaders
    string += doc.children[i].children[1].textContent + "\r\n"; //Post Data
    string += doc.children[i].children[2].children[0].textContent + "\r\n"; //StatusLine
    string += doc.children[i].children[2].children[1].textContent; //responseHeaders
    string += "---------------------\r\n";
  }
  blob = new Blob([string], {
    type: "data:text/plain;charset=utf-8"
  });
  objectURL = URL.createObjectURL(blob);
  var downloading = chrome.downloads.download({
    url: objectURL,
    filename: "HTTPHeaderLive.txt"
  });
}

function onSubWindowError() {
  console.error("Windows Error");
}

function tab_sendError(error) {
  console.error(`tab_sendError: ${error}`);
}

function onError(error) {
  console.error(`Error: ${error}`);
}

chrome.storage.onChanged.addListener(StorageChange);
document.getElementById("auto_scroll_checkbox").checked;

document
  .getElementById("auto_scroll_checkbox")
  .addEventListener("change", function() {
    if (document.getElementById("auto_scroll_checkbox").checked == true) {
      auto_scroll_checkbox = true;
    } else {
      auto_scroll_checkbox = false;
    }
  });

document
  .getElementById("capture_checkbox")
  .addEventListener("change", function() {
    if (document.getElementById("capture_checkbox").checked == true) {
      capture_checkbox = true;
    } else {
      capture_checkbox = false;
    }
  });
document.getElementById("clear_button").addEventListener("click", function() {
  document.getElementById("textarea").innerHTML = "";
  WEBREQUEST_DATA = {};
});
document.getElementById("options_button").addEventListener("click", function() {
  chrome.runtime.openOptionsPage();
});
document
  .getElementById("save_file_button")
  .addEventListener("click", save_file);
