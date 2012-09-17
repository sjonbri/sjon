<?php session_start(); ?>
<?php require_once('dbConnect.php') ?>
<?php
if( $_SESSION['isauthenticated'] == 'y' 
    $categoryid = $_GET["categoryid"];
    
    $query = "delete from category where id = $categoryid";
    mysql_query($query, $conn) or die(mysql_error());
    
    $message = "deleted";
    echo json_encode($message);
}
else {
    die();
}
?>
