<?php
// error_reporting(0);
class foo
{
    const API_KEY = 'PQzQIKdbRjuhJu3w9XQS2g';
    const API_SECRET = 'tQpPwgiFchDJ3R5Koelaw3IqqQNDP8wir5Kf';
    const DENY_METHODS = ['__construct', 'run'];
    const ERRORS = [
        5001 => 'Unknow error!',
        5050 => 'Fatal error!',
        5051 => 'Invalid operation!',
    ];
    private $error = null;
    private $pinfo = '';

    public function __construct() {
        // self::dd(self::ERRORS);
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
        if (method_exists('foo', $pinfo))
            return self::$pinfo();
        else
            self::fail(5051);
    }

    /**
     * call self::generateSignature().
     */
    public function signature()
    {
        if (self::validate([
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
            self::json($arr);
        } else {
            self::fail();
        }
    }

    /**
     * form data validation.
     * rule format: ['field' => rule]
     */
    private function validate($rule=null)
    {
        if (!is_array($rule))
            return false;

        foreach ($_POST as $field => $val)
            // if field have rule.
            if (array_key_exists($field, $rule))
                if (!self::validation($val, $rule[$field]))
                    return false;
        return true;
    }

    /**
     * check field rule.
     */
    private function validation($val, $rule)
    {
        foreach ($rule as $row)
        {
            switch ($row) {
                case '':
                    break;

                default:
                    return self::regex($val, $row);
            }
        }
    }

    /**
     * verify data with Regular.
     * @access public
     * @param string $value | Unverified data
     * @param string $rule  | Validation rules
     * @return boolean
     */
    public function regex($value=null, $rule=null)
    {
        if ($value === null || $rule === null)
            return true;
        $validate = array(
            'require'   => '/\S+/',
            'email'     => '/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/',
            'url'       => '/^http(s?):\/\/(?:[A-za-z0-9-]+\.)+[A-za-z]{2,4}(:\d+)?(?:[\/\?#][\/=\?%\-&~`@[\]\':+!\.#\w]*)?$/',
            'currency'  => '/^\d+(\.\d+)?$/',
            'number'    => '/^\d+$/',
            'zip'       => '/^\d{6}$/',
            'integer'   => '/^[-\+]?\d+$/',
            'double'    => '/^[-\+]?\d+(\.\d+)?$/',
            'english'   => '/^[A-Za-z]+$/',
        );
        // 检查是否有内置的正则表达式
        if(isset($validate[strtolower($rule)]))
            $rule = $validate[strtolower($rule)];
        return preg_match($rule,$value)===1;
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
        $arr['status'] = false;
        die(self::json($arr));
    }

    private function json($data=[])
    {
        header('Content-type: Application/json');
        die(json_encode($data));
    }

    /**
     * generate signature function from zoom documentation.
     */
    private function generateSignature ($api_key, $api_secret, $meeting_number, $role)
    {
        $time = time() * 1000 - 30000;//time in milliseconds (or close enough)
        $data = base64_encode($api_key . $meeting_number . $time . $role);
        $hash = hash_hmac('sha256', $data, $api_secret, true);
        $_sig = $api_key . "." . $meeting_number . "." . $time . "." . $role . "." . base64_encode($hash);
        //return signature, url safe base64 encoded
        return rtrim(strtr(base64_encode($_sig), '+/', '-_'), '=');
    }
}

new foo();
