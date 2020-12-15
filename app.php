<?php
spl_autoload_register(function($class) {
    if (is_file(__DIR__.'/' . $class . '.class.php'))
        include __DIR__.'/' . $class . '.class.php';
});
new app\AwesomeZoom();
