<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::post('/event/gettoken', 'events\eventController@generateAccessToken');
Route::post('/event/gettoken', 'twilio\AccessTokenController@generateAccessToken');

Route::post('/event/upload/file', 'filemanager\mainFileManager@uploadFile');
Route::post('/event/upload/video', 'filemanager\mainFileManager@uploadVideo');
