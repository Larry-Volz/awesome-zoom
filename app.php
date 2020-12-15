<?php
spl_autoload_register(function($class) {
    $filename = __DIR__.'/app'.strpbrk($class, '\\').'.class.php';
    if (is_file($filename))
        require_once $filename;
});
new app\AwesomeZoom();
