<?php

namespace App\Http\Controllers\events;

use App\customClass\CustomRequestValidator;
use App\customClass\Error;
use App\Http\Controllers\Controller;
use App\Http\Controllers\twilio\AccessTokenController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class eventController extends Controller
{
    //

    protected $Status;
    protected $Validator;
    protected $TwilioManager;
    public function __construct()
    {
        $this->Status = new Error();
        $this->Validator = new CustomRequestValidator();
        $this->TwilioManager = new AccessTokenController();
    }

    public function generateAccessToken(Request $request)
    {
        $rules = [
            "identity" => "required|string|min:4|max:45",
            "room_name" => "required|string|min:8|max:45"
        ];

        $is_valid = Validator::make($request->all(), $rules, []);

        $isNotValidRequest = $this->Validator->isNotValidRequest($is_valid);
        if ($isNotValidRequest) {
            return $isNotValidRequest;
        }
        // $token =
        return $this->TwilioManager->generateAccessToken($request);
    }

    ///views
    public function openEventPage()
    {
        return view('events.eventsPage');
    }
}
