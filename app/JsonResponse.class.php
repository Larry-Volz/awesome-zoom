<?php
namespace app;

class JsonResponse
{
    public function json($data=[])
    {
        header_remove();
        header('Content-type: Application/json');
        die(json_encode($data));
    }

    public function error($data=[])
    {
        $protocol = 'HTTP/1.0';
        if (isset($_SERVER['SERVER_PROTOCOL']))
            $protocol = $_SERVER['SERVER_PROTOCOL'];
        header("$protocol ${data['errorCode']} ${data['errorMessage']}");
        http_response_code($data['errorCode']);
        header("Status: ${data['errorMessage']}");
        die(self::json($data));
    }
}
