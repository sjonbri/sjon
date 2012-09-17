<?php session_start(); ?>
<?php require_once('dbConnect.php') ?>
<?php

$message = 'bad';

// check security
if( $_SESSION['isauthenticated'] != 'y' )
{
    $attemptedPassword = $_GET['password'];
    $passwordQuery = mysql_query("select pass from security", $conn) or die(mysql_error());
    $passwordResultSet = mysql_fetch_array($passwordQuery);
    $realPassword = $passwordResultSet['pass'];
    
    //echo " passedin: $attemptedPassword";
    //echo " real: $realPassword";
    if( $attemptedPassword == $realPassword )
    {
        $message = 'good';
        $_SESSION['isauthenticated'] = 'y';
    }
    else
    {
        $message = 'bad';
    }
}
else
{
    $message = 'good';
}

echo json_encode($message);
?>