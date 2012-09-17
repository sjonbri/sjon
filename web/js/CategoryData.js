jon.CategoryData = (function() {
    // consistent way to get the service url 
    // (used so we can switch between debug and live mode)
    var service = function( service ) {
        var servicePrefix = '../../service/';
        var servicePrefix_debug = 'testjson/'; 
        var serviceUrl = '';
        var debug = getUrlVars()["debug"];

        if( !debug ) {
            serviceUrl = servicePrefix + service + '.php';
        }
        else {
            serviceUrl = servicePrefix_debug + service + '.json';
        }

        return serviceUrl;
    };

    return {
        retrieveCategories: function( callback ) {
            $.getJSON(service('GetCategories'), {
            }, function( data ) {
            	if( data ) {
	                if( callback ) {
	                    callback(data);
	                }
            	}
            	else {
            		jon.ApplicationController.notLoggedIn();
            	}
            });
        }, // end of retrieveCategories

        retrievePairs: function( catid, callback ) {
            $.getJSON(service('GetDataPairs'), {
                catid: catid
            }, function( data ) {
            	if( data ) {
	                if( callback ) {
	                    callback(data);
	                }
            	}
            	else {
            		jon.ApplicationController.notLoggedIn();
            	}
            });
        }, // end of retrievePairs

        retrieveSingles: function( catid, callback ) {
            $.getJSON(service('GetDataSingles'), {
                catid: catid
            }, function( data ) {
            	if( data ) {
	                if( callback ) {
	                    callback(data);
	                }
            	}
            	else {
            		jon.ApplicationController.notLoggedIn();
            	}
            });
        }, // end of retrievePairs

        updateCategory: function( json ) {
            $.getJSON(service('UpdateCategory'), {
                json: json
            }, function( data ) {
            });
        },

        updatePairs: function( json ) {
            $.getJSON(service('UpdatePairs'), {
                json: json
            }, function( data ) {
            	if( data ) {
            		alert(data);
            	}
            	else {
            		jon.ApplicationController.notLoggedIn();
            	}
            });
        },

        updateSingles: function( json ) {
            $.getJSON(service('UpdateSingles'), {
                json: json
            }, function( data ) {
            	if( data ) {
            		alert(data);
            	}
            	else {
            		jon.ApplicationController.notLoggedIn();
            	}
            });
        },

        createCategory: function( categoryName, callback ) {
            $.getJSON(service('CreateCategory'), {
                categoryName: categoryName
            }, function( data ) {
            	if( data ) {
	                alert(data);
	                
	                if( callback ) {
	                	callback();
	                }
            	}
            	else {
            		jon.ApplicationController.notLoggedIn();
            	}
            });
        },
        
        deleteCategory: function( categoryid ) {
        	$.getJSON(service('DeleteCategory'), {
        		categoryid: categoryid
            }, function( data ) {
            	if( data ) {
	                alert(data);
	                
	                if( callback ) {
	                	callback();
	                }
            	}
            	else {
            		jon.ApplicationController.notLoggedIn();
            	}
            });
        }
    }; // end of return
})();
    
