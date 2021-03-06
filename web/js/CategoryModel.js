jon.CategoryModel = function( $context, category ) {
    var $categoryTr;
    var pairTemplate = '<tr data-pairid="%0"><td>%1</td><td>%2</td></tr>';
    var singleTemplate = '<tr data-singleid="%0"><td>%1</td></tr>';
    var editMode = false;

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
            },
            $categoryEditSection: function() {
                return locators().$categoryCol().find('.editsection');
            },
            $pairEditSection: function() {
                return locators().$pairCol().find('.editsection');
            },
            $singleEditSection: function() {
                return locators().$singleCol().find('.editsection');
            }
        };
    }; // end of locators

    // display pairs and singles for the passed-in tr context
    var _displayDetails = function( callback ) {
        var count = 0;
        var done = function() {
            count = count + 1;

            if( count === 2 ) {
                if( callback ) {
                    callback();
                }
            }
        };

        // get data pairs
        jon.CategoryData.retrievePairs(category.id, function( data ) {
            var pairCount = data.length;
            if( pairCount === 0 ) {
                done();
            }
            $.each( data, function( key, value ) {
                locators().$pairTable().append(
                    pairTemplate.tokenize(value.id, value.name, value.value));

                pairCount = pairCount - 1;
                if( pairCount === 0 ) {
                    done();
                }
            });
        });

        // get data singles
        jon.CategoryData.retrieveSingles(category.id, function( data ) {
            var singleCount = data.length;
            if( singleCount === 0 ) {
                done();
            }
            $.each( data, function( key, value ) {
                locators().$singleTable().append(
                    singleTemplate.tokenize(value.id, value.value));

                singleCount = singleCount - 1;
                if( singleCount === 0 ) {
                    done();
                }
            });
        });
    };

    var _addAnotherPairRow = function() {
        var newPairTemplate = '<tr data-pairid="%0"><td></td><td data-field="name">%1</td><td data-field="value">%2</td></tr>';
        var $emptyPairRow = $(newPairTemplate.tokenize('','_','_'));
        locators().$pairTable().append($emptyPairRow);
        _makeContentEditable();
        //$emptyPairRow.find("td[data-field='name']").highlight();// todo
        $emptyPairRow.find("td[data-field='name']").focus();
    };

    var _addAnotherSingleRow = function() {
        var newSingleTemplate = '<tr data-singleid="%0"><td></td><td data-field="name">%1</td></tr>';
        var $emptySingleRow = $(newSingleTemplate.tokenize('','_'));
        locators().$singleTable().append($emptySingleRow);
        _makeContentEditable();
        //$emptyPairRow.find("td[data-field='name']").highlight();// todo
        $emptySingleRow.find("td[data-field='name']").focus();
    };
    
    var _isVisible = function() {
    	return ( $('[data-catid=%0]'.tokenize(category.id)).length >= 1 );
    };
    
    var _show = function( callback ) {
    	if( _isVisible() ) {
            if( !_isOpen() ) {
                _displayDetails(callback);
            }
            else {
                if( callback ) {
                    callback();
                }
            }
    	}
        else {
            if( callback ) {
                callback();
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
    var _addEventHandlers = function() {
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
    var _isOpen = function() {
        var bIsOpen = false;

        var numberOfChildTds = locators().$pairCol().find('table td').length;
	    if( numberOfChildTds !== 0 ) {
	        bIsOpen = true;
	    }

        return bIsOpen;
    };

    // add row to Category table
    var _render = function() {
        var markup = 
            '<tr data-catid="%0">'.tokenize(category.id) + 
                '<td class="first" data-value="%0">'.tokenize(category.name) + 
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

        _addEventHandlers();
    };

    var _makeContentEditable = function() {
        // contenteditable
        locators().$categoryCol().find('span').attr('contenteditable', 'true');
        locators().$pairCol().find('td').attr('contenteditable', 'true');
        locators().$singleCol().find('td').attr('contenteditable', 'true');
    };

    // functions to add buttons consitently
    var _addCategoryButton = function( markup ) {
        locators().$categoryEditSection().append(markup);
    };
    var _addPairButton = function( markup ) {
        locators().$pairEditSection().append(markup);
    };
    var _addSingleButton = function( markup ) {
        locators().$singleEditSection().append(markup);
    };


    // init
    (function() { 
        _render();
    })();


    // put in edit mode
    this.applyEditMode = function() {
        if( editMode === false ) {
            editMode = true;

            // markup
            var saveButtonMarkup = '<button class="save"></button>';
            var deleteButtonMarkup = '<button class="delete"></button>';
            var anotherRowButtonMarkup = '<button class="addanotherrow"></button>';
            var editTd = '<td class="edittd"><button class="delete"></button></td>';
    
            // append save buttons
            _addCategoryButton(saveButtonMarkup);
            _addPairButton(saveButtonMarkup);
            _addSingleButton(saveButtonMarkup);
            
            // append category delete button
            _addCategoryButton(deleteButtonMarkup);

            // append addanotherrow buttons
            _addPairButton(anotherRowButtonMarkup);
            _addSingleButton(anotherRowButtonMarkup);
    
            // when "add another row" buttons are clicked, add another empty row
            locators().$pairAddAnotherRowButton().bind('click', function() {
                _addAnotherPairRow();
            });
            locators().$singleAddAnotherRowButton().bind('click', function() {
                _addAnotherSingleRow();
            });

            // append row delete buttons
            $.each(locators().$pairTable().find('tr'), function( key, value ) {
                $(value).prepend(editTd);
            });
            $.each(locators().$singleTable().find('tr'), function( key, value ) {
                $(value).prepend(editTd);
            });
    
            _makeContentEditable();
    
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
                    var name = $(row).find('td:nth-child(2)').text();
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
                    var value = $(row).find('td:nth-child(2)').text();
    
                    if( value != '' ) {
                        singlesObject['singles'].push({
                            value: value
                        });
                    }
                });
    
                jon.CategoryController.updateSingles(singlesObject);
            });
    
            $('.edittd .delete').bind('click', function() {
                $(this).closest('tr').remove();
            });
        } //end of if( editMode === false )
    }; // end of applyEditMode
    
    this.getName = function() {
    	return category.name;
    }
    
    this.show = function( callback ) {
    	_show(callback);
    };
    
    this.hide = function() {
    	_hide();
    };
};
