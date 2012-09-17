<?php session_start(); ?>
<?php require_once('dbConnect.php') ?>
<?php
if( $_SESSION['isauthenticated'] == 'y' ) {
    $json = $_GET["json"];
    $singlesObject = json_decode(stripslashes($json));
    $categoryid = $singlesObject->categoryid;
    
    // first delete existing Single objects for this Category
    $query = "delete from category_data_text where categoryfk = $categoryid";
    mysql_query($query, $conn) or die(mysql_error());
    
    // now insert each "single" row
    foreach ($singlesObject->singles as $value) {
        $query = "insert into category_data_text (value, lineorder, categoryfk) values ('$value->value', 1, $categoryid)";
        mysql_query($query, $conn) or die(mysql_error());
    }
    
    $message = 'good';
    echo json_encode($message);
}
else {
    die();
}
?>

