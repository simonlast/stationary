
var pathRegex = /\/edit\/(.*)/;
var getPath = function(){
	var path = window.location.pathname;
    var match = pathRegex.exec(path);
    if(!match || match.length < 2){
    	return "index.html";
    }else{
    	return match[1];
    }
};

var fileTypeRegex = /.*\.([A-Za-z]+)/;

getFileType = function(filename){
	var matches = fileTypeRegex.exec(filename);

    if(matches && matches.length == 2){
    	return matches[1];
    }else{
    	return "html";
    }
};

var updateIframe = function(iframe, newValue){
    iframe.src = "";
    iframe.onload = function(e){
      var doc = iframe.contentDocument;
      doc.open();
      doc.write(newValue);
      doc.close();
      attachListeners(doc);
    };
};

var attachListeners = function(doc){
    doc.addEventListener("click", function(e){
        var target = e.target;

        if(target.tagName === "A"){
        	e.preventDefault();

            var url = target.href;
            
            if(target.hostname === window.location.hostname){
                // If not already of form /edit/:id
            	if(!pathRegex.test(target.pathname)){
                	url = "/edit" + target.pathname;
                }
            }
            
            window.location.href = url;
        }

    });
};


db.get("editor-frame.html", function(html){
	var iframeContainer = $(html);
    $(".stationary-editor-container").append(iframeContainer);

	var iframe = iframeContainer.find(".page-frame")[0];
    var path = getPath();
    var type = getFileType(path);


    if(type !== "html"){
    	iframeContainer.remove();
        return;
    }

    var update = function(newValue){
  		if(newValue){
			updateIframe(iframe, newValue);
        }
    }

    db.get(path, update);
    var watchId = db.watch(path, update);
});
