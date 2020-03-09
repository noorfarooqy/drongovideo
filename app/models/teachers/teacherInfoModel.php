<?php

namespace App\models\teachers;

use Illuminate\Database\Eloquent\Model;

class teacherInfoModel extends Model
{
    //
    protected $table = "yb_teachers";
    protected $hidden = [
        "ideal_wage_min", "ideal_wage_max", "have_pets", "have_pets_description", "live_with_relatives",
        "live_with_relatives_description", "accommodation", "contract_start_date",
        "contract_end_date", "contract_id", "visa_id", "entry_status", "passport_number", "priority_school_types",
        "file_public",
    ];
}
