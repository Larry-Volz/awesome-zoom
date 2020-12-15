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
}
