var appendContents = function(file){
  db.get(file, function(html){
    $(document.body).append($(html));
  });
};

appendContents("stationary.html");
appendContents("codemirror.css");

// deps
db.run("codemirror.js", "codemirror-javascript.js", "codemirror-css.js", "codemirror-xml.js", "codemirror-htmlmixed.js", function(){
  db.run("stationary-editor.js", "iframe-controller.js");
});
