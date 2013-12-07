var $editor = $("#editor");
var $button = $editor.children("#minimize");
var $content = $editor.children("#content");
var container = $("#code-mirror")[0];
var $input = $("#file-id");

$button.on("click", function(e){
  $content.toggle();
  container.codeMirror.refresh();
  $input.focus();
});