<?php
include_once '../lib/loging.php';

header('Content-type: text/html');
header('Access-Control-Allow-Origin: *');
	
$result = array();

$file = file_get_contents('data.json');  // Открыть файл data.json
$taskList = json_decode($file,TRUE);        // Декодировать в массив 
unset($file);                               // Очистить переменную $file

//$result["rows"] = array_values($taskList);
$result_features = array();
foreach ($taskList as $item){
    //writeToLog($item);
    array_push($result_features, array(
            'type' => 'Feature',
            'id' => $item['id'],
            'geometry' => array(
                'type' => 'Point',
                'coordinates' => array($item['latitude'], $item['longitude'])
            ),
            'properties' => array(
                'balloonContentHeader' => htmlspecialchars_decode($item['balloonContentHeader']),
                'balloonContentBody' => htmlspecialchars_decode($item['balloonContentBody']),
                'balloonContentFooter' => htmlspecialchars_decode($item['balloonContentFooter']),
                'clusterCaption' => htmlspecialchars_decode($item['clusterCaption']),
                'hintContent' => htmlspecialchars_decode($item['hintContent'])
            )
        )  
    );
}
//writeToLog($result_features,'result_features');
$result['type']='FeatureCollection';
$result['features'] = $result_features;
   //writeToLog($result,'get_point');

echo json_encode($result);

?>