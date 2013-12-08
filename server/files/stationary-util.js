var util = {};

util.pathRegex = /\/edit\/(.*)/;
util.getPath = function(){
  var path = window.location.pathname;
    var match = util.pathRegex.exec(path);
    if(!match || match.length < 2){
      return "index.html";
    }else{
      return match[1];
    }
};

util.fileTypeRegex = /.*\.([A-Za-z]+)/;
util.getFileType = function(filename){
  var matches = util.fileTypeRegex.exec(filename);

    if(matches && matches.length == 2){
      return matches[1];
    }else{
      return "html";
    }
};

return util;