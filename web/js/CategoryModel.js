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
            $pairAddAnotherRowButton: function() {
                return locators().$pairCol().find('button.addanotherrow');
            },
            $singleAddAnotherRowButton: function() {
                return locators().$singleCol().find('button.addanotherrow');
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

    var addAnotherPairRow = function() {
        var $emptyPairRow = $(pairTemplate.tokenize('','_','_'));
        locators().$pairTable().append($emptyPairRow);
    };

    var addAnotherSingleRow = function() {
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
        var markup = 
            '<tr data-catid="%0">'.tokenize(category.id) + 
                '<td data-value="%0">'.tokenize(category.name) + 
                    '<span>%0</span>'.tokenize(category.name) + 
                    '<div class="editsection"></div>' + 
                '</td>' + 
                '<td>' + 
                    '<table></table>' + 
                    '<div class="editsection"></div>' + 
                '</td>' + 
                '<td>' + 
                    '<table></table>' +
                    '<div class="editsection"></div>' + 
                '</td>' + 
            '</tr>';

        $categoryTr = $(markup).appendTo($context);

        addEventHandlers();
    };

    // init
    (function() { 
        render();
    })();

    // add buttons to: 
    // locators().$singleCol().find('.editsection').append($emptySingleRow);
    this.applyEditMode = function() {
        // functions to add buttons consitently
        var addCategoryButton = function( markup ) {
            locators().$categoryCol().find('.editsection').append(markup);
        };
        var addPairButton = function( markup ) {
            locators().$pairCol().find('.editsection').append(markup);
        };
        var addSingleButton = function( markup ) {
            locators().$singleCol().find('.editsection').append(markup);
        };

        // append save buttons
        var saveButtonMarkup = '<button class="save"></button>';
        addCategoryButton(saveButtonMarkup);
        addPairButton(saveButtonMarkup);
        addSingleButton(saveButtonMarkup);
        
        // append delete button
        var deleteButtonMarkup = '<button class="delete"></button>';
        addCategoryButton(deleteButtonMarkup);

        // append + buttons
        var anotherRowButtonMarkup = '<button class="addanotherrow"></button>';
        addPairButton(anotherRowButtonMarkup);
        addSingleButton(anotherRowButtonMarkup);

        // when "add another row" buttons are clicked, add another empty row
        locators().$pairAddAnotherRowButton().bind('click', function() {
            addAnotherPairRow();
        });
        locators().$singleAddAnotherRowButton().bind('click', function() {
            addAnotherSingleRow();
        });

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
