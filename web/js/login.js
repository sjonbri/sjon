$(document).ready(function() {
    $('#login').focus();
    
    $("#login").keypress(function(e) {
    	var code = (e.keyCode ? e.keyCode : e.which);
    	
        // if enter was pressed
        if(code == 13) {
        	var p = $(this).val();
        	
            $.getJSON('service/login.php', {
                password: p
            }, function( data ) {
                if( data === 'good' ) {
                    window.location.href = 'web/html/content.html';
                }
                else {
                    $('#login').val('');
                    $('#login').css('background-color', 'gold');
                    $('#login').focus();
                }
            });
        }
    });
});