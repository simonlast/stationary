var input = $("#file-id");
var message = $("#message");
var codeMirrorContainer = $("#code-mirror")[0];
  
var codeMirror = codeMirrorContainer.codeMirror;
  
var reload = function(e){
    
  codeMirror.setValue("");
  
  var id = this.value;

  if(id.length == 0){
  
    message.html("Type to find a file. Try \"docs\".");
    return;
    
  }
  db.get(id, function(value, err){

    if(err){
    
      message.html("File not found. Start typing to create it.");
    
    }else{
    
      codeMirror.setValue(value);
      message.html("File found."); 
    
    }    
  });
};

input[0].reload = reload;
input.on("input", reload);