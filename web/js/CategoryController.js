jon.CategoryController = (function() {
    var $context;
    var dataTableObject;
    var categories = new Array();

    // append categories from db
    var populateCategoryRows = function() {
        jon.CategoryData.retrieveCategories(function( data ) {
            var i = 0;
            for( ; i < data.length; i++ ) {
                categories.push(new jon.CategoryModel($context, data[i]));
            }

            dataTableObject = $context.dataTable({
                bPaginate: false,
                bSort: false,
                bInfo: false,
                "oLanguage": { 
    				"sSearch": ""
    			},
            });
        
            // setup main filter
            jon.CategoryFilterController.initFilter(dataTableObject);
            $('input#mainfilter').bind('keyup', function() {
            	jon.CategoryFilterController.applyFilter();
            });

            $('#searchsection input').css('border-bottom-style', 'solid');
            $('#searchsection input').css('border-bottom-color', 'black');
            $('#searchsection input').css('border-bottom-width', '1px');
            
            jon.ApplicationController.mainSearchFocus();
        });
    }; 

    return {
        start: function() {
            populateCategoryRows();
        },
        
        setContext: function( $c ) {
            $context = $c;
        },

        applyEditMode: function() {
            $.each(categories, function( key, category ) {
                category.applyEditMode();
            });
        },

        updateCategory: function( object ) {
            jon.CategoryData.updateCategory(JSON.stringify(object));
        },

        updatePairs: function( pairsObject ) {
            jon.CategoryData.updatePairs(JSON.stringify(pairsObject));
        },

        updateSingles: function( singlesObject ) {
            jon.CategoryData.updateSingles(JSON.stringify(singlesObject));
        },
        
        deleteCategory: function( categoryid ) {
            jon.CategoryData.deleteCategory(categoryid);
            jon.ApplicationController.refreshApplication(false);
        },
        
        openRow: function( dataValue ) {
            $.each(categories, function( key, category ) {
                if( dataValue === category.getName() ) {
                	category.show();
                }
            });
        },
        
        closeAllRows: function() {
            $.each(categories, function( key, category ) {
                category.hide();
            });
        },
        
        expandAll: function( callback ) {
            var count = categories.length;
            $.each(categories, function( key, category ) {
                category.show( function() {
                    count = count - 1;
                    if( count === 0 && callback ) {
                        callback();
                    }
                }); // end of category.show
            }); // end of .each
        }
    };
})();
