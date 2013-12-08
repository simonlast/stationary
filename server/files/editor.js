var appendContents = function(file){
  db.get(file, function(html){
    $(document.body).append($(html))
  });
}

appendContents("editor.html");
appendContents("codemirror.css");
appendContents("editor.css");

db.run("file-list.js");

db.run("codemirror.js", "codemirror-javascript.js", "codemirror-css.js", "codemirror-xml.js", "codemirror-htmlmixed.js", function(){

  var container = $("#code-mirror")[0];

  container.codeMirror = CodeMirror(container, {
    mode:  "javascript",
    lineNumbers: true,
    smartIndent: false,
    theme: "solarized light"
  });

  container.codeMirror.refresh();

  db.run("input-listener.js", "codemirror-listener.js", "editor-button-listener.js");
});