<?php session_start(); ?>
<?php require_once('dbConnect.php') ?>
<?php
if( $_SESSION['isauthenticated'] == 'y' ) {
    $json = $_GET["json"];
    $pairsObject = json_decode(stripslashes($json));
    $categoryid = $pairsObject->categoryid;
    
    // first delete existing Pair objects for this Category
    $query = "delete from category_data_clickable where categoryfk = $categoryid";
    mysql_query($query, $conn) or die(mysql_error());
    
    // now insert each pair row
    foreach ($pairsObject->pairs as $value) {
        $query = "insert into category_data_clickable (name, value, lineorder, categoryfk) values ('$value->name', '$value->value', 1, $categoryid)";
        mysql_query($query, $conn) or die(mysql_error());
    }
    
    $message = 'good';
    echo json_encode($message);
}
else {
    die();
}
?>

