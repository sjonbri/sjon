<?php
// setup DB connection
$dbhost = 'localhost';
$dbuser = 'icecoldn_jonbri';
$dbpass = 'jbsi1985';
$database = 'icecoldn_jon';

// establish database connection
$conn = mysql_connect($dbhost, $dbuser, $dbpass) or die('Error connecting to mysql');
mysql_select_db($database);
?>
