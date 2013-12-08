var input = $("#file-id");

var codeMirrorContainer = $("#code-mirror")[0];

var codeMirror = codeMirrorContainer.codeMirror;

var message = $("#message");

codeMirror.on("change", function(e){

  var value = codeMirror.getValue();
  var filename = input[0].value;

  if(value.length > 0 && filename.length > 0){
      db.set(filename, value);
      message.html("File saved.");
  }
});