jon.CategoryFilterController = (function() {
	var dataTableObject;
	
	// get the index of the column from the passed-in column name
	var getColIndex = function( columnKey ) {
		var colIndex = -1;
		
		var $col = dataTableObject.find('th[data-key=%0]'.tokenize(columnKey));
    	if( $col ) {
    		colIndex = $col.index();
    	}
    	
    	return colIndex;
	};
	
	// get the value of the table cell with the passed-in table, column, and row
	var getDataValue = function( columnKey, rowIndex ) {
    	var nNodes = dataTableObject.fnGetNodes();
    	var colIndex = getColIndex(columnKey);
    	
    	// first get the row...
    	var $row = $(nNodes[rowIndex]);
    	// ...then drill down to the individual cell
    	var cell = $row.find('td')[colIndex];
    	
    	return $(cell).attr('data-value');
	};
	
	var rowHasBeenExpanded = false;
	var _handleRowExpansion = function() {
		var rowCount = $('#mainTable >tbody >tr').length;
    	if( rowCount === 1 ) {
    		var dataValue = $('#mainTable td').attr('data-value') || '';
    		
    		if( dataValue != '' && rowHasBeenExpanded === false ) {
    			jon.CategoryController.openRow(dataValue);
    			rowHasBeenExpanded = true;
    		}
    	}
    	else {
    		if( rowHasBeenExpanded === true ) {
    			jon.CategoryController.closeAllRows();
    			rowHasBeenExpanded = false;
    		}
    	}
	};
    
    return {
        initFilter: function( dto ) {
        	// $.fn.dataTableExt.afnFiltering.length = 0;
        	dataTableObject = dto;
        	
        	$.fn.dataTableExt.afnFiltering.push(function( oSettings, aData, rowIndex ) {
			    var filterResult = true;
			    
			    // the value in the search box
			   	var searchBoxValue = $('#mainfilter').val();
			   	if( searchBoxValue !== '' ) {
			   	    // the value of the table cell under focus
				   	var dataValue = getDataValue("category", rowIndex) || '';
				   	
				   	if( dataValue.toLowerCase().indexOf(searchBoxValue.toLowerCase()) == -1 ) {
				   		filterResult = false;
				   	}
			   	}
			    	
			    return filterResult;
			});
        }, // end of applyFilter 
        
        applyFilter: function() {
        	dataTableObject.fnDraw();
        	
        	_handleRowExpansion();
        }
    };// end of return
})();
