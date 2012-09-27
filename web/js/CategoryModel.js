jon.CategoryModel = function( $context, category ) {
    var $categoryTr;
    var pairTemplate = '<tr data-pairid="%0"><td>%1</td><td>%2</td></tr>';
    var singleTemplate = '<tr data-singleid="%0"><td>%1</td></tr>';

    var locators = function(){
        return {
            $categoryCol: function() {
                return $categoryTr.children('td:first-child');
            },
            $pairCol: function() {
                return $categoryTr.children('td:nth-child(2n)');
            },
            $singleCol: function() {
                return $categoryTr.children('td:nth-child(3n)');
            },
            $categorySaveButton: function() {
                return locators().$categoryCol().find('button.save');
            },
            $categoryDeleteButton: function() {
                return locators().$categoryCol().find('button.delete');
            },
            $pairSaveButton: function() {
                return locators().$pairCol().find('button.save');
            },
            $singleSaveButton: function() {
                return locators().$singleCol().find('button.save');
            },
            $pairTable: function() {
                return locators().$pairCol().find('table');
            },
            $singleTable: function() {
                return locators().$singleCol().find('table');
            }
        };
    }; // end of locators

    // display pairs and singles for the passed-in tr context
    var displayDetails = function() {
        // get data pairs
        jon.CategoryData.retrievePairs(category.id, function( data ) {
            $.each( data, function( key, value ) {
                locators().$pairTable().append(
                    pairTemplate.tokenize(value.id, value.name, value.value));
            });
        });

        // get data singles
        jon.CategoryData.retrieveSingles(category.id, function( data ) {
            $.each( data, function( key, value ) {
                locators().$singleTable().append(
                    singleTemplate.tokenize(value.id, value.value));
            });
        });
    };

    // add empty rows for the pairs and singles table for adding new entries
    var addEmptyDetailRows = function() {
        var $emptyPairRow = $(pairTemplate.tokenize('','_','_'));
        locators().$pairTable().append($emptyPairRow);

        var $emptySingleRow = $(singleTemplate.tokenize('','_'));
        locators().$singleTable().append($emptySingleRow);
    };
    
    var isVisible = function() {
    	return ( $('[data-catid=%0]'.tokenize(category.id)).length >= 1 );
    };
    
    var _show = function() {
    	if( isVisible() ) {
    		if( !isOpen() ) {
    			displayDetails();
    		}
    	}
    };
    
    var _hide = function() {
    	if( isVisible() ) {
    		if( isOpen() ) {
    			locators().$pairTable().empty();
    			locators().$singleTable().empty();
    		}
    	}
    };
    
    // adds event handlers
    var addEventHandlers = function() {
        // click handler for the category headers
        locators().$categoryCol().bind('click', function() {
        	if( isVisible() ) {
        		if( isOpen() ) {
        			_hide();
        		}
        		else {
        			_show();
        		}
        	}
        });
    };

    // is the passed in tr context open
    var isOpen = function() {
        var bIsOpen = false;

        var numberOfChildTds = locators().$pairCol().find('table td').length;
	    if( numberOfChildTds !== 0 ) {
	        bIsOpen = true;
	    }

        return bIsOpen;
    };

    // add row to Category table
    var render = function() {
        var markup = '<tr data-catid="%0"><td data-value="%1"><span>%2</span></td><td><table></table></td><td><table></table></td></tr>'.tokenize(category.id, category.name, category.name);

        $categoryTr = $(markup).appendTo($context);

        addEventHandlers();
    };

    // init
    (function() { 
        render();
    })();

    this.applyEditMode = function() {
        addEmptyDetailRows();

        // append save buttons
        var saveButtonMarkup = '<br /><button class="save">save</button>';
        locators().$categoryCol().append(saveButtonMarkup);
        locators().$pairCol().append(saveButtonMarkup);
        locators().$singleCol().append(saveButtonMarkup);
        
        // append delete button
        var deleteButtonMarkup = '<br /><button class="delete">delete</button>';
        locators().$categoryCol().append(deleteButtonMarkup);

        // append +  button
        var anotherRowButtonMarkup = '<br /><button class="anotherrow">+</button>';
        locators().$pairCol().append(anotherRowButtonMarkup);
        locators().$singleCol().append(anotherRowButtonMarkup);

        // contenteditable
        locators().$categoryCol().find('span').attr('contenteditable', 'true');
        locators().$pairCol().find('td').attr('contenteditable', 'true');
        locators().$singleCol().find('td').attr('contenteditable', 'true');

        // category save button
        locators().$categorySaveButton().bind('click', function() {
            var categoryToSave = {
               id: category.id,
               name: locators().$categoryCol().children('span').text()
            };

            jon.CategoryController.updateCategory(categoryToSave);
            
            // stop event propegation
            return false;
        });
        
        // category delete button
        locators().$categoryDeleteButton().bind('click', function() {
        	
        	var confirmResult = confirm('you sure?');
            if( confirmResult ) {
            	jon.CategoryController.deleteCategory(category.id);
            }
            else {
            	jon.ApplicationController.mainSearchFocus();
            }
            
            // stop event propegation
            return false;
        });

        // pair save button
        locators().$pairSaveButton().bind('click', function() {
            var pairsObject = {};
            pairsObject['categoryid'] = category.id;
            pairsObject['pairs'] = new Array();

            $.each(locators().$pairCol().find('table tr'), function( key, row ) {
                var name = $(row).find('td:first-child').text();
                var value = $(row).find('td:last-child').text();

                if( name != '' && value != '' ) {
                    pairsObject['pairs'].push({
                        name: name,
                        value: value
                    });
                }
            });

            jon.CategoryController.updatePairs(pairsObject);
        });

        // single save button
        locators().$singleSaveButton().bind('click', function() {
            var singlesObject = {};
            singlesObject['categoryid'] = category.id;
            singlesObject['singles'] = new Array();

            $.each(locators().$singleCol().find('table tr'), function( key, row ) {
                var value = $(row).find('td:first-child').text();

                if( value != '' ) {
                    singlesObject['singles'].push({
                        value: value
                    });
                }
            });

            jon.CategoryController.updateSingles(singlesObject);
        }); // end of applyEditMode
    }; // end of return
    
    this.getName = function() {
    	return category.name;
    }
    
    this.show = function() {
    	_show();
    };
    
    this.hide = function() {
    	_hide();
    };
};
