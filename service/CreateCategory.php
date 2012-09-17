<?php session_start(); ?>
<?php require_once('dbConnect.php') ?>
<?php
if( $_SESSION['isauthenticated'] == 'y' ) {
    $categoryName = $_GET["categoryName"];
    
    $query = "insert into category (name, created, lineorder) values ('$categoryName', now(), 0)";
    mysql_query($query, $conn) or die(mysql_error());
    
    $message = "$categoryName saved";
    echo json_encode($message);
}
else {
    die();
}
?>
