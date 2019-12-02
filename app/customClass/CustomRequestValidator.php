<?php
namespace App\customClass;

class CustomRequestValidator{

	public function isNotValidRequest($validator)
    {
    	if($validator->fails())
    	{
    		$errors = $validator->errors();
    		$error_list = [];
    		foreach($errors->all() as $error)
    			array_push($error_list, $error);
    		return json_encode([
    			"errorMessage"=>$error_list,
    			"isSuccess" => false,
    			"successMessage" => null,
    			"data" => []
    		]);
    	}
    	return false;
    }
}

?>