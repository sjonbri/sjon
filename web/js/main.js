(function() {
	var enterAlreadyPressedForNewCategoryButton = false;
	
    var locators = {
        $mainTable: function() {
            return $('table#maintable');
        }
    };
    
    // execution starts here
    $(document).ready(function() {
        jon.CategoryController.setContext(locators.$mainTable());

        jon.CategoryController.start();

        $('#editmode').click(function() {
        	jon.CategoryController.expandAll();
            jon.CategoryController.applyEditMode();
        });
        
        $('#expandall').click(function() {
            jon.CategoryController.expandAll();
            jon.ApplicationController.mainSearchFocus();
        });
        
        $('#closeall').click(function() {
            jon.CategoryController.closeAllRows();
            jon.ApplicationController.mainSearchFocus();
        });
        
        $('#refresh').click(function() {
        	jon.ApplicationController.refreshApplication(false);
        });
        
        $('#newcategory').click(function() {
        	var $newCategoryMarkup = $('<input class="ontheflytextbox" type="text" />');
            $(this).after($newCategoryMarkup);

            $newCategoryMarkup.focus();

            $newCategoryMarkup.bind('keyup', function(e) {
            	if( enterAlreadyPressedForNewCategoryButton === false ) {
	                var code = (e.keyCode ? e.keyCode : e.which);
	
	                // if enter was pressed
	                if(code == 13) { 
	                    var categoryName = $newCategoryMarkup.val();
	                    jon.CategoryData.createCategory(categoryName, function() {
	                    	_refresh(false);
	                    });
	                    
	                    enterAlreadyPressedForNewCategoryButton = true;
	                }
            	} // end of if( enterAlreadyPressedForNewCategoryButton === false )
            });
        });
    }); // end of document.ready()
})();
