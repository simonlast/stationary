db.require("stationary-util.js", function(util){
  util = util();

  var types = {
    css: "css",
    html: "htmlmixed",
    js: "javascript"
  };

  var minEditorWidth = 100;

  var updateFile = function(codeMirror){
    var value = codeMirror.getValue();
    var filename = util.getPath();

    if(value.length > 0 && filename.length > 0){
      db.set(filename, value);
    }
  };

  var attachResizeListener = function(container){
    var $container = $(container);
    var $editor = $container.find(".stationary-editor");
    var $doc = $(document);
    var $resizeOverlay = $container.find(".resize-overlay");
    var startPos = null;

    resizeEditor = function(startPos, currPos){
      var pageWidth = $doc.width();
      var newEditorWidth = pageWidth - currPos.x;

      if(newEditorWidth < minEditorWidth){
        newEditorWidth = minEditorWidth;
      }

      $editor.css({
        width: newEditorWidth + "px"
      });
    };

    $container.on("mousedown", ".CodeMirror-gutters", function(e){
      $resizeOverlay.show();
      startPos = {
        x: e.pageX,
        y: e.pageY
      };
    });

    $doc.on("mousemove", function(e){
      if(startPos){
        var currPos = {
          x: e.pageX,
          y: e.pageY
        };
        resizeEditor(startPos, currPos);
      }
    });

    $doc.on("mouseup", function(e){
       if(startPos){
        var currPos = {
          x: e.pageX,
          y: e.pageY
        };
        resizeEditor(startPos, currPos);
        $resizeOverlay.hide();
        startPos = null;
      }
    });
  };

  var container = $(".stationary-editor")[0];
  var path = util.getPath();
  var type = util.getFileType(path);

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

  attachResizeListener(container.parentElement);

  var update = function(value){
    if(!value){
      value = "";
    }

    var currentValue = container.codeMirror.getValue();

    if(currentValue !== value){
      container.codeMirror.setValue(value);
    }
  };

  db.get(path, function(value){
    update(value);
    container.codeMirror.on("change", updateFile);
  });
  db.watch(path, update);
});