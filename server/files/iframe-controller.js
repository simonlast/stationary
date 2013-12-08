db.require("stationary-util.js", function(util){
    util = util();
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
                    if(!util.pathRegex.test(target.pathname)){
                        url = "/edit" + target.pathname;
                    }
                }

                window.location.href = url;
            }

        });
    };



    iframeContainer = $(".frame-container");
    var iframe = iframeContainer.find(".page-frame")[0];
    var path = util.getPath();
    var type = util.getFileType(path);


    if(type !== "html"){
        iframeContainer.remove();
        return;
    }

    var update = function(newValue){
            if(newValue){
            updateIframe(iframe, newValue);
        }
    };

    db.get(path, update);
    var watchId = db.watch(path, update);
});