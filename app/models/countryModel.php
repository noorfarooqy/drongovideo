<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class countryModel extends Model
{
    //
    protected $table = "yb_countries";

    public function getCountryName($index)
    {
        $name = countryModel::where("id", $index)->get();
        if ($name === null || $name->count() <= 0) {
            $name = "uknown";
        }

        $name = $name[0]->name . " (" . $name[0]->zh_name . ")";
        return $name;
    }
}
