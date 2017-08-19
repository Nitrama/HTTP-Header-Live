function setdata(request){
	//browser.tabs.executeScript 
	//console.log("nat nat")
	
	//console.log(request.post)
	parser = new DOMParser()
	temp_header = parser.parseFromString(request.header, "text/html"); //data from Sub.js
	////console.log(temp_header.getElementById('url').innerText)
	headers = temp_header.getElementsByName('header')
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4) {
			document.documentElement.innerHTML = this.responseText  //The content does not have access to the WebExtensions
		}
	};
	xhttp.open("POST", temp_header.getElementById('url').innerText, true);
	for (header of headers){
		split = header.innerHTML.split(": ")
		////console.log(split)
		xhttp.setRequestHeader(split[0], split[1]);
	}
	if (request.post.length > 0 ){
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(convert(request.post)); //send plain
		} else {
		xhttp.send(); 
	}
}

function convert(str)
{
  str = str.replace("&amp;" , '&');
  str = str.replace("&gt;"  , '>');
  str = str.replace("&lt;"  , '<');
  str = str.replace("&quot;", '"');
  str = str.replace("&#039;", "'");
  return str;
}
browser.runtime.onMessage.addListener(setdata);			