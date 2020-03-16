<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */

Route::get('/', function () {
    return view('welcome');
});

Route::get('/event/event', 'events\eventController@openEventPage');
Route::get('/teacher/{teacher_id}/{interview_id}', 'events\eventController@oponInterviewForTeacher');
Route::get('/school/{school_id}/{interview_id}', 'events\eventController@oponInterviewForSchool');
Route::get('/invitee/{invitedPerson}/{interview_id}', 'events\eventController@oponInterviewForInvitee');
