<?php

namespace App\Http\Controllers\events;

use App\customClass\CustomRequestValidator;
use App\customClass\Error;
use App\Http\Controllers\Controller;
use App\Http\Controllers\twilio\AccessTokenController;
use App\models\interview\interviewInfoModel;
use Carbon\Carbon;
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

    public function ApigenerateAccessToken(Request $request)
    {
        $rules = [
            "identity" => "required|string|min:4|max:45",
            "room_name" => "required|string|min:8|max:45",
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

    public function oponInterviewForTeacher($teacher_id, $interview_id)
    {
        $interview = interviewInfoModel::where([
            ['id', $interview_id],
        ])->get();
        if ($interview === null || $interview->count() <= 0) {
            abort(403);
        }

        $school_info = $interview[0]->schoolInfo;
        if ($school_info === null || $school_info->count() <= 0) {
            return view('errors.invalid_school');
        }
        $teacher_info = $interview[0]->teacherInfo;
        if ($teacher_info === null || $teacher_info->count() <= 0 || $teacher_info->user_id !== (int) $teacher_id) {
            return view('errors.invalid_teacher');
        }
        $is_time_for_interview = $this->isInterviewTime($interview);
        if ($is_time_for_interview !== true) {
            return $is_time_for_interview;
        }
        // return $interview;
        return $this->openEventPage($interview[0], $teacher_info, $school_info);

    }
    public function oponInterviewForSchool($school_id, $interview_id)
    {
        $interview = interviewInfoModel::where([
            ['id', $interview_id],
        ])->get();
        $school_info = $interview[0]->schoolInfo;
        if ($school_info === null || $school_info->count() <= 0 || $school_info->id !== (int) $school_id) {
            return view('errors.invalid_school');
        }
        $teacher_info = $interview[0]->teacherInfo;
        if ($teacher_info === null || $teacher_info->count() <= 0) {
            return view('errors.invalid_teacher');
        }
        $is_time_for_interview = $this->isInterviewTime($interview);
        if ($is_time_for_interview !== true) {
            return $is_time_for_interview;
        }
        // return $interview;
        return $this->openEventPage($interview[0], $teacher_info, $school_info, false);
    }
    public function openEventPage($interview = null, $teacher_info, $school_info, $isteacher = true)
    {
        return view('events.eventsPage', compact('interview', 'teacher_info', 'school_info', 'isteacher'));
    }

    public function isInterViewTime($interview)
    {

        if ($interview[0]->is_complete) {
            return view('errors.completed_interview');
        } else if (Carbon::create($interview[0]->start_time)->gt(Carbon::now())) {
            return view('errors.yet_interview_time');
        } else if (Carbon::create($interview[0]->end_time)->lt(Carbon::now())) {
            return view('errors.interview_expired');
        }

        return true;
    }
}
