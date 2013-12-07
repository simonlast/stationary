var getPath = function(){
	var path = window.location.pathname;
    if(!path || path.length <= 1){
    	return "home.html";
    }else{
    	return path.substring(1);
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

var updateFile = function(codeMirror){
  var value = codeMirror.getValue();
  var filename = getPath();

  if(value.length > 0 && filename.length > 0){
    db.set(filename, value);
  }
}

var appendContents = function(file){
  db.get(file, function(html){
    $(document.body).append($(html))
  });
};

appendContents("stationary-editor.html");
appendContents("codemirror.css");


db.run("codemirror.js", "codemirror-js.js", function(){

  var container = $(".stationary-editor")[0];

  container.codeMirror = CodeMirror(container, {
    mode:  "javascript",
    lineNumbers: true,
    smartIndent: false,
    theme: "solarized light"
  });

  // manually set height
  $(container).css({
  	height: $(document).height() + "px"
  });

  container.codeMirror.refresh();

  var path = getPath();
  var type = getFileType(path);

  if(type !== "html"){
  	container.classList.add("fullscreen");
  }

  db.get(path, function(value){
  	if(!value){
    	value = "";
    }
  	container.codeMirror.setValue(value);
 	container.codeMirror.on("change", updateFile);
  });



});