<?php
class Workbench_Model_Application
{
	protected static $_isDev = false;

	protected static $_modulesPath;

	public static function isDevelopment()
	{
		if (defined('GLITCH_APP_ENV') && 'development' === GLITCH_APP_ENV) {
			self::$_isDev = true;
		}
		return self::$_isDev;
	}

	public static function getModulesPath()
	{
	    if (is_string(self::$_modulesPath)) {
	        return self::$_modulesPath;
	    }
	    $view = Zend_Layout::getMvcInstance()->getView();
	    $path = $view->registry()->query('settings.workbench.modules.path', GLITCH_MODULES_PATH);
	    self::$_modulesPath = $path;
	    return $path;
	}

	public static function isScanModulesPath()
	{
	    $view = Zend_Layout::getMvcInstance()->getView();
        $scan = (bool) $view->registry()->query('settings.workbench.modules.scan', false);
	    return self::getModulesPath() && $scan;
	}
}