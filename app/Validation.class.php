<?php
namespace form;
class Validation
{
    /**
     * form data validation.
     * rule format: ['field' => rule]
     */
    public function validate($rule=null)
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
    private function regex($value=null, $rule=null)
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
}
