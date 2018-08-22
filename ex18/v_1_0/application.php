<?php
require_once("tools.php");
require_once("../../vendor/db.php");
require_once("../../lib/log.php");
require_once("../../lib/loging.php");

class CApplication
{
	public $arB24App;
	public $arAccessParams = array();
	public $arRatingUsers = array();
	public $currentUser = 0;
	private $b24_error = '';
	public $is_ajax_mode = false;
	public $is_background_mode = false;
	public $currentRating = 0;

	private function checkB24Auth() {
	
		// проверяем актуальность доступа
		$isTokenRefreshed = false;
		
		// $arAccessParams['access_token'] = '123';
		// $arAccessParams['refresh_token'] = '333';
		
		$this->arB24App = getBitrix24($this->arAccessParams, $isTokenRefreshed, $this->b24_error);
		return $this->b24_error === true;
	}	

	private function returnJSONResult ($answer) {
	
		ob_start();
		ob_end_clean();
		Header('Cache-Control: no-cache');
		Header('Pragma: no-cache');
		echo json_encode($answer);
		die();
	}
	private function getYesterday() {
		$result = new DateTime();
		$result->add(DateInterval::createFromDateString('yesterday'));
		// return $result->format('Y-m-d');
		return '2015-09-19';
	}     
        private function saveСoordinates (){
                            $id;
                            $latitude = htmlspecialchars($_REQUEST['latitude']);
                            $longitude = htmlspecialchars($_REQUEST['longitude']);    
                            $balloonContentHeader = htmlspecialchars($_REQUEST['balloonContentHeader']);
                            $balloonContentBody = htmlspecialchars($_REQUEST['balloonContentBody']);
                            $balloonContentFooter = htmlspecialchars($_REQUEST['balloonContentFooter']);
                            $clusterCaption = htmlspecialchars($_REQUEST['clusterCaption']);
                            $hintContent = htmlspecialchars($_REQUEST['hintContent']);
                            
                            global $db;	
                            $coordinates = array();
                            
                            
                            $sql = 'INSERT INTO `b24_points`(`latitude`, `longitude`, `balloonContentHeader`, `balloonContentBody`, `balloonContentFooter`, `clusterCaption`, `hintContent`, `portal`) VALUES (?s,?s,?s,?s,?s,?s,?s,?s)';
                            $coordinates = $db->query($sql, $latitude, $longitude, $balloonContentHeader, $balloonContentBody, $balloonContentFooter, $clusterCaption, $hintContent, $this->arAccessParams['domain']); 
                            
                            $id = $db->insertId();
                            
                            $coordinates = array(
                                        'id' => $id,
                                        'latitude' => $latitude,
                                        'longitude' => $longitude,                
                                        'balloonContentHeader' => $balloonContentHeader,
                                        'balloonContentBody' => $balloonContentBody,
                                        'balloonContentFooter' => $balloonContentFooter,
                                        'clusterCaption' => $clusterCaption,
                                        'hintContent' => $hintContent

                                    ) ;                        
                            return $coordinates;
		
	}
        private function loadСoordinates (){
            global $db;	
            $coordinates = array();
            $coordinates["rows"] = $db->getAll('SELECT * FROM `b24_points` WHERE `portal` = ?s', $this->arAccessParams['domain']);                                    
            return $coordinates;
	}	
        private function updateСoordinates (){
                            writeToLog($_REQUEST, '$coordinates');
                            $id = intval($_REQUEST['id']);
                            $latitude = htmlspecialchars($_REQUEST['latitude']);
                            $longitude = htmlspecialchars($_REQUEST['longitude']);    
                            $balloonContentHeader = htmlspecialchars($_REQUEST['balloonContentHeader']);
                            $balloonContentBody = htmlspecialchars($_REQUEST['balloonContentBody']);
                            $balloonContentFooter = htmlspecialchars($_REQUEST['balloonContentFooter']);
                            $clusterCaption = htmlspecialchars($_REQUEST['clusterCaption']);
                            $hintContent = htmlspecialchars($_REQUEST['hintContent']);

                            global $db;	
                            $coordinates = array();
                            
                            
                            $sql = 'UPDATE `b24_points` SET `latitude`=?s,`longitude`=?s,`balloonContentHeader`=?s,`balloonContentBody`=?s,`balloonContentFooter`=?s,`clusterCaption`=?s,`hintContent`=?s WHERE `id` = ?s and `portal` = ?s';
                            $db->query($sql, $latitude, $longitude, $balloonContentHeader, $balloonContentBody, $balloonContentFooter, $clusterCaption, $hintContent, $id, $this->arAccessParams['domain']); 
                            
                            $coordinates = array(
                                        'id' => $id,
                                        'latitude' => $latitude,
                                        'longitude' => $longitude,                
                                        'balloonContentHeader' => $balloonContentHeader,
                                        'balloonContentBody' => $balloonContentBody,
                                        'balloonContentFooter' => $balloonContentFooter,
                                        'clusterCaption' => $clusterCaption,
                                        'hintContent' => $hintContent

                                    ) ;                            
                            return $coordinates;
		
	}        
        private function destroyСoordinates (){
                            $id = intval($_REQUEST['id']);                            

                            global $db;	
                            //$coordinates = array();
                            
                            
                            $sql = 'DELETE FROM `b24_points` WHERE `ID` = ?i and `portal` = ?s';
                            $db->query($sql, $id, $this->arAccessParams['domain']); 
                            
                            //$id = $db->insertId();
                            
                            return true;
		
	}	
	public function saveAuth() {
		global $db;
		
		$res = $db->query(
			'INSERT INTO b24_portal_reg (`PORTAL`, `ACCESS_TOKEN`, `REFRESH_TOKEN`, `MEMBER_ID`) values (?s, ?s, ?s, ?s)'.
			' ON DUPLICATE KEY UPDATE `ACCESS_TOKEN` = ?s, `REFRESH_TOKEN` = ?s, `MEMBER_ID` = ?s',
			$this->arB24App->getDomain(), $this->arB24App->getAccessToken(), $this->arB24App->getRefreshToken(), $this->arB24App->getMemberId(),
			$this->arB24App->getAccessToken(), $this->arB24App->getRefreshToken(), $this->arB24App->getMemberId()
		);
		
	}
	
    public function manageAjax($operation, $params)
    {
		global $db;
		switch ($operation){
                        case 'load_coordinates': 
                            $this->saveAuth();
                            $res = $this->loadСoordinates();                            
                            $this->returnJSONResult($res);		
			break;
                        case 'save_coordinates': 
                            $this->saveAuth();
                            $res = $this->saveСoordinates();                            
                            $this->returnJSONResult(array('status' => 'success', 'result' => $res));			
			break;
                        case 'update_coordinates':                             
                            $this->saveAuth();
                            $res = $this->updateСoordinates();                            
                            $this->returnJSONResult(array('status' => 'success'));
                        break;                        
                        case 'destroy_coordinates':
                            $this->saveAuth();
                            $res = $this->destroyСoordinates();                            
                            $this->returnJSONResult(array('status' => 'success', 'result' => $res));                          
			break;
                    
			case 'add_portal_auth': 
                            $this->saveAuth();		
                            $this->returnJSONResult(array('status' => 'success', 'result' => ''));
			break;
			case 'uninstall': 			
				\CB24Log::Add('uninstall 1: '.print_r($_REQUEST, true));					
				
			break;			
			default:
                            writeToLog($_GET, 'default');
				$this->returnJSONResult(array('status' => 'error', 'result' => 'unknown operation'));
		}		
    }
    private function getAuthFromDB() {
		global $db;
		
		$res = $db->getRow('SELECT * FROM `b24_portal_reg` LIMIT 1');
		$this->arAccessParams = prepareFromDB($res);
		
		$this->b24_error = $this->checkB24Auth();
			
		if ($this->b24_error != '') {
			echo $this->b24_error;
			\CB24Log::Add('background auth error: '.$this->b24_error);	
			die;
		}
		
		\CB24Log::Add('background auth success!');	
		
	}	
    public function start () {                
		$this->is_ajax_mode = isset($_REQUEST['operation']);
                
                //пока не разобрался с background
		$this->is_background_mode = isset($_REQUEST['background']);
		
		if ($this->is_background_mode) $this->getAuthFromDB();
		else {                        
			if (!$this->is_ajax_mode){ 
                            $this->arAccessParams = prepareFromRequest($_REQUEST);                            
                        }
			else 
                            $this->arAccessParams = $_REQUEST;                                                
                            $this->b24_error = $this->checkB24Auth();			
                            if ($this->b24_error != '') {
                                if ($this->is_ajax_mode)
                                        $this->returnJSONResult(array('status' => 'error', 'result' => $this->b24_error));
                                else
                                        echo "B24 error: ".$this->b24_error;

                                die;
                            }
		}
		
	}
}	

$application = new CApplication();

if (!empty($_REQUEST)) {

	$application->start();
	
       
        if ($application->is_ajax_mode){ 
            $application->manageAjax($_REQUEST['operation'], $_REQUEST);            
        }	
}
?>