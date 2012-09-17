jon = {};

String.prototype.tokenize = function() {
    var tokenized = this;

    // iterate over the arguments and replace the placeholders
    for (var i = 0; i < arguments.length; i++) {
        tokenized = tokenized.replace("%" + i, arguments[i]);
    }

    return tokenized;
};

// http://papermashup.com/read-url-get-variables-withjavascript/
// usage: var first = getUrlVars()["id"];
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
};
