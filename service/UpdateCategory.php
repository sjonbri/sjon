<?php session_start(); ?>
<?php require_once('dbConnect.php') ?>
<?php
if( $_SESSION['isauthenticated'] == 'y' ) {
    $json = $_GET["json"];
    $category = json_decode(stripslashes($json));
    
    $query = "update category set name = '$category->name' where id = $category->id";
    
    mysql_query($query, $conn) or die(mysql_error());
    
    $message = 'good';
    echo json_encode($message);
}
else {
    die();
}
?>
