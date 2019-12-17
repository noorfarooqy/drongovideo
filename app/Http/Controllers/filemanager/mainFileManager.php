<?php

namespace App\Http\Controllers\filemanager;

use App\customClass\CustomRequestValidator;
use App\customClass\Error;
use App\customClass\FileUploader;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use Illuminate\Support\Facades\Validator;

class mainFileManager extends Controller
{
    //
    protected $Status;
    protected $FileUplaoder;
    protected $custom_validator;
    public function __construct()
    {
        $this->Status = new Error();
        $this->FileUplaoder = new FileUploader();
        $this->custom_validator = new CustomRequestValidator();
        
    }
    public function uploadFile(Request $request)
    {
        $rules = [
            "file_src" => "required|file",
            "file_type" => "required|in:0,1"
        ];

        $is_valid = Validator::make($request->all(),$rules, []);
        $isNotValidRequest = $this->custom_validator->isNotValidRequest($is_valid);
        if($isNotValidRequest)
            return $isNotValidRequest;
        
        $path = public_path('pdfs');
        $fex = $request->file_type === 0 ? "_pdf_" : "_ppt_";
        $ftype = $request->file_type === 0 ? ".pdf" : ".ppt";
        $filename = bin2hex(random_bytes('12')).time().$fex;
        $this->FileUplaoder->setFilePath($path);
        $this->FileUplaoder->setFileDirectory('/');
        $this->FileUplaoder->setFileName($filename);
        $is_uploaded = $this->FileUplaoder->uploadFileDirect($request);
        if(!$is_uploaded)
        {
            return $is_uploaded;
        }
        $filetoconvert = $is_uploaded["data"]["file_src"];
        $directcommand = "convert -define registry:temporary-path=pdfs -density 150 pdfs/$filetoconvert -quality 90 pdfs/$filename.png 2>&1";
        $output = shell_exec($directcommand);
        if(strlen($output) > 0)
        {
            if(count(explode(PHP_EOL, shell_exec("ls pdfs | grep $filename-[0-9].png 2>&1 ")) )<= 0)
            {
                $this->Status->setError(["Failed to convert file::  ", $output]);
                return $this->Status->getError();
            }
            
        }
        $files = explode(PHP_EOL, shell_exec("ls pdfs | grep $filename-[0-9].png 2>&1 "));
        $pages = [];
        foreach($files as $page){
            if($page === "")
                continue;
            $page = env("APP_URL")."/pdfs/$page";
            array_push($pages, $page);
        }
        $this->Status->setSuccess(["files" => $pages]);
        return $this->Status->getSuccess();
        

    }
}
