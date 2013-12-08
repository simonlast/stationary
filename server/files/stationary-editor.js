var types = {
  css: "css",
  html: "htmlmixed",
  js: "javascript"
};

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

var updateFile = function(codeMirror){
  var value = codeMirror.getValue();
  var filename = getPath();

  if(value.length > 0 && filename.length > 0){
    db.set(filename, value);
  }
};

var appendContents = function(file){
  db.get(file, function(html){
    $(document.body).append($(html))
  });
};

appendContents("stationary-editor.html");
appendContents("codemirror.css");


db.run("codemirror.js", "codemirror-javascript.js", "codemirror-css.js", "codemirror-xml.js", "codemirror-htmlmixed.js", function(){

  var container = $(".stationary-editor")[0];
  var path = getPath();
  var type = getFileType(path);

  if(type !== "html"){
    container.classList.add("fullscreen");
  }

  // Find mode
  var mode = "htmlmixed";
  if(types[type]){
    mode = types[type];
  }

  container.codeMirror = CodeMirror(container, {
    mode:  mode,
    lineNumbers: true,
    smartIndent: false,
    theme: "solarized light"
  });

  // manually set height
  $(container).css({
    height: $(document).height() + "px"
  });
 
  container.codeMirror.refresh();

  db.get(path, function(value){
  	if(!value){
    	value = "";
    }
  	container.codeMirror.setValue(value);
 	container.codeMirror.on("change", updateFile);
  });



});