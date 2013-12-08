window.debug = false; //see console for debug log.
db.run("jquery.js", function(){
    //db.run("editor.js"); //general-purpose editor.
	db.run("stationary-editor.js");
    db.run("iframe-controller.js");
});