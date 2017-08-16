function setdata(request){
	//console.log("nat nat")
	//console.log(request)
	parser = new DOMParser()
	temp_header = parser.parseFromString(request.header, "text/html");
	////console.log(temp_header.getElementById('url').innerText)
	//history.pushState(null, null, temp_header.getElementById('url').innerText);
	//document.documentElement.innerHTML = '';
	// erst TAB reload auf richtige "URL" und dann Code Injekt
	headers = temp_header.getElementsByName('header')
	/*
		for (header of headers){
		//console.log(header.innerHTML)
		}
		*/
	////console.log(request.post)
	////console.log("xxx")
	////console.log(request.post.length)
	if (request.post.length > 0 ){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				//console.log(this.responseText)
				document.documentElement.innerHTML = this.responseText
			}
		};
		xhttp.open("POST", temp_header.getElementById('url').innerText, true);
		for (header of headers){
			split = header.innerHTML.split(": ")
			////console.log(split)
			xhttp.setRequestHeader(split[0], split[1]);
		}
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(request.post); 
		} else {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				//console.log(this.responseText)
				document.documentElement.innerHTML =this.responseText
			}
		};
		xhttp.open("GET", temp_header.getElementById('url').innerText, true);
		for (header of headers){
			split = header.innerHTML.split(": ")
			////console.log(split)
			xhttp.setRequestHeader(split[0], split[1]);
		}
		xhttp.send(); 
	}
	
	////console.log(document.getElementsByTagName('html')[0].innerHTML);
	}
	
	
	browser.runtime.onMessage.addListener(setdata);			