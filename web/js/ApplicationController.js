jon.ApplicationController = (function( $context, category ) {
	
	var _refresh = function( clearTable, callback ) {
    	var speed = 'fast';
    	$('#mainfilter').css('opacity', '0');
    	$('article > header').hide(speed, function() {
	    	$('article #searchsection').hide(speed, function() {
	    		$('article #maintablesection').hide(speed, function() {
	    			_clearMainSearchBox(clearTable, callback);
	    		});
	    	});
    	});
    };
    
    var _clearMainSearchBox = function( clearTable, callback ) {
    	$('#mainfilter').val('');
    	
    	if( clearTable === true ) {
    	    CategoryFilterController.applyFilter();
    	}
    	
    	if( callback ) {
    		callback();
    	}
    };
	
	return {
		refreshApplication: function( clearTable ) {
			_refresh(clearTable, function() {
				location.reload();
			});
		},
		
		mainSearchFocus: function() {
			$('input#mainfilter').focus();
		},
		
		notLoggedIn: function() {
			alert('not logged in');
		}
	};
})();