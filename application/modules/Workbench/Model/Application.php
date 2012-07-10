<?php
class Workbench_Model_Application
{
    /**
     * Is the environment in dev mode?
     * Null matters for lazy loading by checking the GLITCH_APP_ENV
     *
     * @var mixed
     */
	protected static $_isDev;

	/**
	 * The modules path to scan
	 *
	 * @var mixed
	 */
	protected static $_modulesPath;

	/**
	 * Is the environment in dev mode?
	 *
	 *  @return bool
	 */
	public static function isDevelopment()
	{
		if (null === self::$_isDev && defined('GLITCH_APP_ENV') && 'development' === GLITCH_APP_ENV) {
			self::setDevelopment(true);
		}
		return (bool) self::$_isDev;
	}

	/**
	 * Set the development mode on/off
	 *
	 * @param bool $flag
	 */
	public static function setDevelopment($flag)
	{
	    self::$_isDev = (bool) $flag;
	}

	/**
	 * Get the modules path
	 *
	 * @return string
	 */
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

	/**
	 * Should we scan the modules path and do we have one registered?
	 *
	 * @return bool
	 */
	public static function isScanModulesPath()
	{
	    $view = Zend_Layout::getMvcInstance()->getView();
        $scan = (bool) $view->registry()->query('settings.workbench.modules.scan', false);
	    return self::getModulesPath() && $scan;
	}
}
