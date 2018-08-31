<?php
namespace Bitrix24\Bitrix24Landing;
use Bitrix24\Bitrix24Entity;
use Bitrix24\Bitrix24Exception;


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of bitrix24Repo
 *
 * @author Lukoyanov_aa
 */
class Bitrix24Repo extends Bitrix24Entity {
    //put your code here
    //repo.register
        /**
	 * Добавить блок в репозиторий
	 * @link https://dev.1c-bitrix.ru/rest_help/landing/partners_blocks/landing_repo_register.php
	 * @throws Bitrix24Exception
	 * @return boolean
	 */
	public function register($data)
	{
		$result = $this->client->call('landing.repo.register',$data);
		return $result;
	}
}
