<?php
namespace app;
use \form\Validation;

class AwesomeZoom
{
    const API_KEY = 'PQzQIKdbRjuhJu3w9XQS2g';
    const API_SECRET = 'tQpPwgiFchDJ3R5Koelaw3IqqQNDP8wir5Kf';
    const CLIENT_ID = 'kywQ5vr3TUGbokq9LXcIyA';
    const CLIENT_SECRET = 'GC1OqzVfuYq8fJ6rv2X9dfIuXjVbSYOO';

    const OAUTH_AUTHORIZE = 'https://zoom.us/oauth/authorize';
    const OAUTH_ACCESSTOKEN = 'https://zoom.us/oauth/authorize';
    const DENY_METHODS = ['__construct', 'run'];
    const ERRORS = [
        5001 => 'Unknow error!',
        5050 => 'Fatal error!',
        5051 => 'Invalid operation!',
    ];
    private $error = null;
    private $pinfo = '';

    public function __construct() {
        self::run();
    }

    // die dump.
    private function dd($bar)
    {
        ob_start();
        echo('<pre>');
        var_dump($bar);
        echo('</pre>');
        die(ob_get_clean());
    }

    /**
     * run.
     * maybe should just put those code into __construct().
     */
    public function run()
    {
        // if no _SERVER['PATH_INFO']
        if (!isset($_SERVER['PATH_INFO']))
            die(header('Location:index.html'));

        // path info -> method name.
        $this->pinfo = current(explode('/', trim($_SERVER['PATH_INFO'], '/')));

        // check if in dead loop method list.
        if (in_array($this->pinfo, self::DENY_METHODS))
            self::fail(5050);

        // check method exists and call the method.
        $pinfo = $this->pinfo;
        if (method_exists($this, $pinfo))
            return self::$pinfo();
        else
            self::fail(5051);
    }

    /**
     * call self::generateSignature().
     */
    public function signature()
    {
        if (Validation::validate([
            'meetingNumber' => ['require', 'integer'],
            'role' => ['require', ['in', [0, 1]]]
        ])) {
            $arr['apiKey'] = self::API_KEY;
            $arr['signature'] = self::generateSignature(
                self::API_KEY,
                self::API_SECRET,
                $_POST['meetingNumber'],
                $_POST['role']
            );
            JsonResponse::json($arr);
        } else {
            self::fail();
        }
    }

    /**
     * $foo: errorCode || errorMessage
     */
    private function fail($foo=null)
    {
        $ecode = key(self::ERRORS);
        $emsg = current(self::ERRORS);
        if ($foo !== null)
        {
            if (self::ERRORS[$foo])
            {
                $emsg = self::ERRORS[$foo];
                $ecode = $foo;
            } else {
                $emsg = $foo;
            }
        } else
            if ($this->error !== null)
                $emsg = $this->error;

        $arr['errorCode'] = $ecode;
        $arr['errorMessage'] = $emsg;
        $arr['method'] = $this->pinfo;
        $arr['result'] = $emsg;
        $arr['status'] = $ecode < 300;
        JsonResponse::error($arr);
    }

    /**
     * generate signature function from zoom documentation.
     */
    private function generateSignature($api_key, $api_secret, $meeting_number, $role)
    {
        $time = time() * 1000 - 30000;//time in milliseconds (or close enough)
        $data = base64_encode($api_key . $meeting_number . $time . $role);
        $hash = hash_hmac('sha256', $data, $api_secret, true);
        $_sig = $api_key . "." . $meeting_number . "." . $time . "." . $role . "." . base64_encode($hash);
        //return signature, url safe base64 encoded
        return rtrim(strtr(base64_encode($_sig), '+/', '-_'), '=');
    }

    /**
     * Request User Authorization.
     */
    public function userAuth()
    {
        $arr[] = 'response_type=code';
        $arr[] = 'redirect_uri=https://02fa5d6d5265.ngrok.io/rec';
        $arr[] = 'client_id='.self::CLIENT_ID;
        JsonResponse::json([
            'url' => 'https://zoom.us/oauth/authorize?' . implode('&', $arr)
        ]);
    }

    public function rec()
    {
        var_dump($_REQUIRE);
    }

    /**
     * Request Access Token.
     */
    public function accessToken()
    {
        $data['response_type'] = 'authorization_code';
        $data['code'] = CLIENT_ID;
        $data['redirect_uri'] = 'https://02fa5d6d5265.ngrok.io/rec';

        $bar = base64_encode(CLIENT_ID.':'.CLIENT_SECRET);
        $foo['Authorization'] = "Basic $bar";
    }

    private function curl()
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, '');
        curl_setopt($ch, CURLOPT_HTTPHEADER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
    }
}
