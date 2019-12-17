<?php
namespace App\customClass;

require_once 'Error.php';
use File;

class FileUploader
{

    protected $Error;
    protected $publicpath;
    protected $filename;
    protected $allowed_file_types;
    protected $file_extension;
    protected $given_extension;
    public function __construct()
    {
        $this->Error = new Error();
        $this->directory = 'uploads/file_uploader/';
        $this->publicpath = public_path($this->directory);
        $this->filename = "chunk_" . time() . "_.";
        $this->allowed_file_types = ["image/jpeg", "image/png", "image/jpg"];
        $this->file_extension = ["jpeg", "png", "jpg"];

    }
    public function uplaodJsonFile($filedata)
    {
        if (!$this->validDirectory) {
            return false;
        }

        $file_type = substr($filedata, (strpos($filedata, "data:") + 5),
            (strpos($filedata, ";") - 5));
        if (($type_key = array_search($file_type, $this->allowed_file_types)) === false) {
            $this->Error->setError(["The file type provided is not valid. Given " . $file_type]);
            return false;
        } else {
            $extenstion = $this->file_extension[$type_key];
        }

        $filedata = base64_decode(str_replace("data:" . $file_type . ";base64", '', $filedata));
        $logo_url = $this->publicpath . $this->filename . $extenstion;
        try
        {
            File::put($logo_url, $filedata);
            return env('APP_URL') . $this->directory . $this->filename . $extenstion;
        } catch (Exception $exception) {
            $this->Error->setError(["Failed to upload the file ", $exception]);
            return false;
        }
    }
    public function setFilePath($path)
    {
        if (empty($path)) {
            $this->Error->setError(['The filepath should not be empty']);
            return false;
        }
        $this->publicpath = $path;
    }
    public function setFileName($name)
    {
        if (empty($name)) {
            $this->Error->setError(['The filename should not be empty']);
            return false;
        }
        $this->filename = $name;
    }
    public function setAllowedFilesTo($types)
    {
        if (is_array($types) === false) {
            $this->Error->setError(['The file types should be provided in array format']);
            return false;
        }
        $this->allowed_file_types = $type;
    }
    public function setFileDirectory($dir)
    {
        if (empty($dir)) {
            $this->Error->setError(['The filename should not be empty']);
            return false;
        } else {
            $this->directory = $dir;
        }

    }
    public function setFileExtension($extension)
    {
        if (is_array($extension) === false) {
            $this->Error->setError(['The file types should be provided in array format']);
            return false;
        }
        $this->file_extension = $extension;
    }
    public function getError()
    {
        return $this->Error->getError();
    }
    protected function validDirectory()
    {
        if (!is_dir($this->publicpath)) {
            if (!mkdir($this->publicpath, 0765, true)) {
                $this->Error->setError(["Failed to create upload directory. Please contact support"]);
                return false;
            }
        }
        return true;
    }
    public function uploadFileDirect($request)
    {
        if (!$this->validDirectory()) {
            return false;
        }

        $this->setFileExtension([
            "pdf", "ppt", "pptx",
        ]);
        $fextension = $request->file('file_src')->getClientOriginalExtension();
        if (($type_key = array_search($fextension, $this->file_extension)) === false) {
            $this->Error->setError(["The file extension is not valid " . $type_key]);
            return false;
        }
        $filename = $this->filename .'.'. $fextension;
        if (!$request->file('file_src')->move($this->publicpath . '/', $filename)) {
            $this->Error->setError(["Failed to to upload the fail into the server"]);
            return false;
        } else {
            if ($fextension === ".mp4" || $fextension === "mp4") {
                $type = "videoFile";
            } else {
                $type = "newDoc";
            }

            $this->Error->setSuccess([
                "file_src" =>  $filename,
                "file_type" => $type,
            ]);
            return $this->Error->getSuccess();
        }
    }
}
