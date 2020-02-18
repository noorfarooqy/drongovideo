<?php

namespace App\Http\Controllers\twilio;

use App\customClass\Error;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\VideoGrant;

class AccessTokenController extends Controller
{
    //
    protected $Status;

    public function __construct()
    {
        $this->Status = new Error();
    }

    public function generateAccessToken(Request $request)
    {
        if ($request->identity == null) {
            $this->Status->setError(["Identity is not set"]);
            return $this->Status->getError();
        }
        $token = new AccessToken(
            env('TWILIO_ACCOUNT_SID'),
            env('TWILIO_SID'),
            env('TWILIO_SECRET'),
            3600,
            $request->identity
        );
        $videoGrant = new VideoGrant();
        $videoGrant->setRoom($request->room_name);

        // Add grant to token
        $token->addGrant($videoGrant);
        $video_room = "100chinajobs" . Str::random(12) . time();
        $chat_room = $video_room . "_chat";
        if ($token !== "" && $token !== null) {
            $this->Status->setSuccess(["token" => $token->toJWT(), 'video_room' => $video_room, 'chat_room' => $chat_room]);
            return $this->Status->getSuccess();
        }
        $this->Status->setError([$token]);
        return $this->Status->getError();
        // return $token;
    }
}
