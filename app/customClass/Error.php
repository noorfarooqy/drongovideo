<?php
namespace App\customClass;
use Log;
class Error{
	protected $error;
	protected $success;
	protected $error_log_file;
	protected $error_code_number;
	protected $error_numbers;
	public function __construct()
	{
		$this->error = null;
		$this->success = null;
		// $this->error_log_file = storage_path()."logs/custom_log/error_log.log";
		// $this->configErrorNumbers();
		// if(!is_dir($this->error_log_file))
		// {
		// 	if(!mkdir($this->error_log_file, 0765, true))
		// 	{
		// 		$this->setError([$this->error_numbers["0"]]);
		// 	}
		// }
	}

	public function setError($error=[], $error_code =null)
	{
    	$this->error = [
    		"errorMessage" => $error,
    		"isSuccess" => false,
    		"successMessage" => null,
    		"error_code_number" => $error_code,
    	];
			// print_r($this->getError());
    	// Log::channel('customlog')->info("[-ERROR-] ::  ".implode(" - ",$this->getError()["errorMessage"])." - IP:: ".\Request::ip()." - URL: ".url()->current(). " - Params:: ".implode(\Request::route()->parameters()));

	}
	public function setSuccess($data=[])
	{
    	$this->success = [
    		"errorMessage" => null,
    		"isSuccess" => true,
    		"successMessage" => "success",
    		"data" => $data,
    	];
	}
	public function getError()
	{
		return $this->error;
	}
	public function getSuccess()
	{
		return $this->success;
	}

	public function configErrorNumbers()
	{
		$this->error_numbers = [
			"0" => "Failed to set the log error file",
			"1" => "The api key to access use account is not valid",
			"2" => "The request contains/missing invalid/required paramaters",
		];
	}
}
?>
