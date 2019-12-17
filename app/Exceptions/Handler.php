<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $exception)
    {
        if ($exception instanceof \Illuminate\Database\Eloquent\RelationNotFoundException) {
            return response(json_encode(array(
                "error_message" => "RelationNotFoundException ",
                "error_description" => $exception->getMessage(),
                "error_status" => true,
                "error_file" => $exception->getFile(),
                "error_line" => $exception->getLine(),
            )), 500);
        }
        if ($exception instanceof \BadMethodCallException) {
            return response(json_encode(array(
                "error_message" => "Bad method call exception",
                "error_description" => $exception->getMessage(),
                "error_status" => true,
                "error_file" => $exception->getFile(),
                "error_line" => $exception->getLine(),
            )), 500);
        }
        if ($exception instanceof \Illuminate\Http\Exceptions\PostTooLargeException) {
            return response(json_encode(array(
                "error_message" => "The post contains content larger than allowed",
                "error_description" => $exception->getMessage(),
                "error_status" => true,
                "error_code" => 422,
            )), 422);
        }
        if ($exception instanceof \ErrorException) {
            return response(json_encode(array(
                "error_message" => "Error Exception",
                "error_description" => $exception->getMessage(),
                "error_line" => $exception->getLine(),
                "error_file" => $exception->getFile(),
                "error_status" => true,
                "error_code" => 500,
            )), 500);
        }
        if ($exception instanceof \Symfony\Component\Debug\Exception\FatalThrowableError) {
            return response(json_encode(array(
                "error_message" => "Syntax error",
                "error_description" => $exception->getMessage(),
                "error_line" => $exception->getLine(),
                "error_file" => $exception->getFile(),
                "error_status" => true,
                "error_code" => 500,
            )), 500);
        }
        if ($exception instanceof \Symfony\Component\Debug\Exception\FatalErrorException) {
            return response(json_encode(array(
                "error_message" => "Fatal Exception error",
                "error_description" => $exception->getMessage(),
                "error_line" => $exception->getLine(),
                "error_file" => $exception->getFile(),
                "error_status" => true,
                "error_code" => 500,
            )), 500);
        }
        if ($exception instanceof \Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException) {
            return response(json_encode(array(
                "error_message" => "Method Not Allowed",
                "error_description" => $exception->getMessage(),
                "error_status" => true,
                "error_file" => $exception->getFile(),
                "error_code" => 500,
            )), 500);
        }
        if ($exception instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
            return response(json_encode(array(
                "error_message" => "Could not find your request",
                "error_description" => $exception->getMessage(),
                "error_status" => true,
                "error_code" => 404,
            )), 404);
        }
        if ($exception instanceof \UnexpectedValueException) {
            return response(json_encode(array(
                "error_message" => "Could not find your request UnexpectedValueException",
                "error_description" => $exception->getMessage(),
                "error_line" => $exception->getLine(),
                "error_file" => $exception->getFile(),
                "error_status" => true,
                "error_code" => 422,
            )), 422);
        }
        if ($exception instanceof \Illuminate\Database\QueryException) {
            return response(json_encode(array(
                "error_message" => "Uncaught Query Error",
                "error_description" => $exception->getMessage(),
                "error_file" => $exception->getFile(),
                "error_status" => true,
                "error_code" => 500,
            )), 500);
        }
        if ($exception instanceof \Exception) {
            return response(json_encode(array(
                "error_message" => "Uncaught Exception",
                "error_description" => $exception->getMessage(),
                "error_file" => $exception->getFile(),
                "error_status" => true,
                "error_code" => 500,
            )), 500);
        }
        return parent::render($request, $exception);
    }
}
