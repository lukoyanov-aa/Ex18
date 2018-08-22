<?php
include_once '../lib/loging.php';

// строка, которую будем записывать
$text = '<?php define("APP_ID", "'.htmlspecialchars($_GET["appId"]).'");';
 
// открываем файл, если файл не существует,
//делается попытка создать его
$fp = fopen("config.php", "w");
 
// записываем в файл текст
fwrite($fp, $text);
 
// закрываем
fclose($fp);
?>
