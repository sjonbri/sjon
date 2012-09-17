<?php session_start(); ?>
<?php require_once('dbConnect.php') ?>
<?php
if( $_SESSION['isauthenticated'] == 'y' ) {
    $json = array();
    $query = "select * from category order by lineorder desc, created desc, id desc";
    
    $allRows = mysql_query($query, $conn) or die(mysql_error());
    $count = 0;
    while( $row = mysql_fetch_array($allRows) )
    {
    	$ob = array(
    		"id" => $row['id'],
    		"name" => $row['name'],
    		"lineorder" => $row['lineorder']
    	);
    
            $json[$count] = $ob;
    	$count = $count+1;
    } 
    
    echo json_encode($json);
}
else {
    die();
}
?>
