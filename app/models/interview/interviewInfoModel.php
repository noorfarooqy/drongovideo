<?php

namespace App\models\interview;


use Illuminate\Database\Eloquent\Model;

class interviewInfoModel extends Model
{
    //
    protected $table = "yb_interviews";

    public function schoolInfo()
    {
        return $this->hasOne('App\models\school\schoolInfoModel','id', 'school_id');
    }
    public function teacherInfo()
    {
        return $this->hasOne('App\models\teachers\teacherInfoModel', 'id', 'teacher_id');
    }
}
