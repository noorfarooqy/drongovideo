<?php
namespace App\customClass;

use App\models\apiKeyModel;
use App\customClass\Error;
use App\models\ApiKeyTrackerModel;
use App\models\browserDetailsModel;
class ApiKeyManager
{
    protected $api_keylength = 149;
    protected $error = null;
    protected $requestUrl = null;


    protected $api_id= null;
    protected $api_key = null;
    protected $api_host_id = null;
    protected $api_host_token = null;
    protected $api_host_type = null;

    //mobile visitors
    protected $phone_serial_number = null;
    protected $phone_model_number = null;
    protected $phone_id_number = null;
    protected $phone_manufacture = null;
    protected $phone_brand = null;
    protected $phone_type = null;
    protected $phone_user = null;
    protected $phone_base = null;
    protected $phone_sdk_version = null;
    protected $phone_host = null;
    protected $phone_fingerprint = null;
    protected $phone_release = null;
    protected $phone_ip_address = null;
    protected $phone_mac_address = null;

    //browser visitors
    protected $os_name = null;
    protected $os_version = null;
    protected $browser_name = null;
    protected $browser_version = null;
    protected $navigator_userAgent = null;
    protected $navigator_appVersion = null;
    protected $navigator_platform= null;
    protected $navigator_vendor = null;
    protected $host_ip_address= null;


    protected $error_status = false;
    protected $error_message = false;

    private $platform;

    public function __construct($platform="mobile")
    {
        $this->successErrorHandler = new Error();
        $this->platform = $platform;
    }
    public function setPlatform($platform)
    {
      $this->platform = $platform;
    }
    public function Generate_New_Api()
    {
        // if($this->api_key !== null)
        // {
        //     $this->successErrorHandler->setError(["The api has a data. Please reset
        //                 the api key. "]);
        //     return false;
        // }
        try
        {
            $this->api_key =  bin2hex(random_bytes($this->api_keylength));
        }
        catch (TypeError $e)
        {
            // Well, it's an integer, so this IS unexpected.
            $error = ("An unexpected type error has occurred");
            $this->successErrorHandler->setError([$error]);
            return false;
        }
        catch (Error $e)
        {
            // This is also unexpected because 32 is a reasonable integer.
            $error = ("An unexpected error has occurred");
            $this->successErrorHandler->setError([$error]);
            return false;
        }
        catch (Exception $e)
        {
            // If you get this message, the CSPRNG failed hard.
            $error = ("Could not generate a random string. Is our OS secure?");
            $this->successErrorHandler->setError([$error]);
            return false;
        }
        $is_saved = $this->Save_Key();
        if($is_saved === true)
            return $this->api_key;
        else
        {
            $this->successErrorHandler->setError(["Failed to save draft of the new api key::
                ".$this->error_message]);
            return false;
        }
    }

    public function Save_Key()
    {
      if($this->platform === "mobile")
        return $this->savePhoneDetails();
      else if($this->platform === "browser")
        return $this->saveBrowserDetails();
      else
      {
        $error = "Unknown platform, can't save api";
        $this->successErrorHandler->setError([$error]);
        return false;
      }
    }
    public function saveBrowserDetails()
    {
      browserDetailsModel::create([
        "api_host_id" => $this->api_host_id,
        "api_host_token" => $this->api_host_token,
        "api_host_type" => $this->api_host_type,
        "os_name" => $this->os_name,
        "os_version" => $this->os_version,
        "browser_name" => $this->browser_name,
        "browser_version" => $this->browser_version,
        "navigator_userAgent" => $this->navigator_userAgent,
        "navigator_appVersion" => $this->navigator_appVersion,
        "navigator_platform" => $this->navigator_platform,
        "navigator_vendor" => $this->navigator_vendor,
        "host_ip_address" => \Request::ip(),
        "api_key" => $this->api_key,
      ]);
      return true;
    }
    public function savePhoneDetails()
    {
      apiKeyModel::create([
          "api_host_id" => $this->api_host_id,
          "api_host_token" => $this->api_host_token,
          "api_host_type" => $this->api_host_type,
          "api_key" => $this->api_key,
          "phone_serial_number" => $this->phone_serial_number,
          "phone_model_number" => $this->phone_model_number,
          "phone_id_number" => $this->phone_id_number,
          "phone_manufacture" => $this->phone_manufacture,
          "phone_brand" => $this->phone_brand,
          "phone_type" => $this->phone_type,
          "phone_user" => $this->phone_user,
          "phone_base" => $this->phone_base,
          "phone_sdk_version" => $this->phone_sdk_version,
          "phone_host" => $this->phone_host,
          "phone_fingerprint" => $this->phone_fingerprint,
          "phone_release" => $this->phone_release,
          "phone_ip_address" => $this->phone_ip_address,
          "phone_mac_address" => $this->phone_mac_address,
      ]);
      return true;
    }
    public function updateKeys($old_id, $old_token, $host_id, $host_token, $host_type = "guest")
    {

        //some update might come from a user who is registered and is logging in
        //so there are api keys the user already has that are not expired.
        //to prevent multiple api keys that are valid at once. stop the old api keys
        $possibleOldApiKey = apiKeyModel::where([
            ["api_host_id", $host_id],
            ["api_host_token", $host_token],
        ])->get();
        if($possibleOldApiKey !== null && $possibleOldApiKey->count() > 0)
            foreach ($possibleOldApiKey as $key => $oldApiKey)
            {
                $this->stopApiKey($oldApiKey->api_key);
            }
        apiKeyModel::where([
            ["api_host_id", $old_id],
            ["api_host_token", $old_token],
        ])->update(["api_host_id" => $host_id, "api_host_token" => $host_token,"api_host_type" => $host_type]);
    }
    public function stopApiKey($api_key)
    {
        apiKeyModel::where("api_key", $api_key)->update(["is_expired" => true]);
        return true;
    }
    public function KeyDoesntExist($api_key)
    {
        return apiKeyModel::where("api_key", $api_key)->exists();
    }
    public function isExpiredKey($api_key)
    {
        return $apiKeyModel::where("api_key", $api_key)->get()[0]->is_expired;
    }
    public function HasApiKey($host_id, $host_token)
    {
        return apiKeyModel::where([
            ["api_host_id", $host_id],
            ["api_host_token", $host_token],
            ["is_expired", false],
        ])->exists();
    }

    public function Set_Error($error)
    {
        $this->error_status = true;
        $this->error_message = $error;
    }
    public function Get_Message()
    {
        return $this->successErrorHandler->getError() ;
    }

    public function Get_Api_Key()
    {
        return $this->api_key;
    }
    public function getKeyDetails($host_id, $host_token)
    {
        $apiDetails =  apiKeyModel::where([["api_host_id", $host_id], ["api_host_token", $host_token], ["is_expired", false]])->get();
        $this->api_id = $apiDetails[0]->api_id;
        return $apiDetails;
    }
    public function setRequest($api_id, $ip, $request)
    {
        ApiKeyTrackerModel::create([
            "api_id" => $api_id,
            "api_request_route" => $request,
            "api_host_ipaddress" => $ip,
        ]);
        if($this->api_id === null)
            $this->api_id = $api_id;
    }
    public function successFullRequest()
    {
        if($this->api_id === null)
            $this->successErrorHandler->setError(["Successful request for uknown api id. Request = ".$this->requestUrl." and api key = ".$this->api_key]);
        else
            ApiKeyTrackerModel::where("api_id", $this->api_id)->update(["is_successful_request" => true]);
    }
    public function setPhoneDetails($details)
    {
        $this->api_host_id = $details->api_host_id;
        $this->api_host_token = $details->api_host_token;
        $this->api_host_type = $details->api_host_type;
        $this->phone_serial_number = $details->phone_serial_number;
        $this->phone_model_number = $details->phone_model_number;
        $this->phone_id_number = $details->phone_id_number;
        $this->phone_manufacture = $details->phone_manufacture;
        $this->phone_brand = $details->phone_brand;
        $this->phone_type = $details->phone_type;
        $this->phone_user = $details->phone_user;
        $this->phone_base = $details->phone_base;
        $this->phone_sdk_version = $details->phone_sdk_version;
        $this->phone_host = $details->phone_host;
        $this->phone_fingerprint = $details->phone_fingerprint;
        $this->phone_release = $details->phone_release;
        $this->phone_ip_address = $details->phone_ip_address;
        $this->phone_mac_address = $details->phone_mac_address;
    }
    public function setBrowserData($details)
    {
        $this->os_name = $details->os_name;
        $this->os_version = $details->os_version;
        $this->browser_name = $details->browser_name;
        $this->browser_version = $details->browser_version;
        $this->navigator_userAgent = $details->navigator_userAgent;
        $this->navigator_appVersion = $details->navigator_appVersion;
        $this->navigator_platform = $details->navigator_platform;
        $this->navigator_vendor = $details->navigator_vendor;
        $this->api_host_id = $details->api_host_id;
        $this->api_host_token = $details->api_host_token;
        $this->api_host_type = $details->api_host_type;
    }
}
?>
