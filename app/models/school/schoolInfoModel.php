<?php

namespace App\models\school;

use Illuminate\Database\Eloquent\Model;

class schoolInfoModel extends Model
{
    //
    protected $table ="yb_schools";
    protected $hidden = [
        "city_description", "city_img", "videos", "city_details", 
        "principal_phone_prefix", "principal_phone", "business_license", "industry_license", "legal_entity_idcard",
        "principal_idcard", "operator_idcard", "operator_commitment","foreign_expert_office_apply_sheet"
    ];
}
