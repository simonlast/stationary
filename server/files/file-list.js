var $list = $("#all-files");
var input = $("#file-id")[0];

var keyTemplate = function(key){
    return $("<button class=\"button file-list-item\">" + key + "</button>");
};

var clickKey = function(){
    var $key = $(this);
    var keyName = $key.html();
    input.value = keyName;
    input.reload();
};

var makeKeyItem = function(key){
    var $key = keyTemplate(key);
    $list.append($key);
    $key.on("click", clickKey);
};

var makeList = function(keys){
    for(var i=0; i<keys.length; i++){
        makeKeyItem(keys[i]);
    }
};

db.all(makeList);