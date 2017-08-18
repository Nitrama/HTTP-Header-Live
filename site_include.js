function setdata(request){
	//console.log("nat nat")
	//console.log(request)
	parser = new DOMParser()
	temp_header = parser.parseFromString(request.header, "text/html");
	////console.log(temp_header.getElementById('url').innerText)
	headers = temp_header.getElementsByName('header')
	if (request.post.length > 0 ){
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				//console.log(this.responseText)
				document.documentElement.innerHTML = this.responseText  //Site clear
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
				document.documentElement.innerHTML =this.responseText //Site clear
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
}


browser.runtime.onMessage.addListener(setdata);			