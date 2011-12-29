<?php
class Workbench_Model_Application
{
	protected static  $_isDev = false;

	public static function isDevelopment()
	{
		if (defined('GLITCH_APP_ENV') && 'development' === GLITCH_APP_ENV) {
			self::$_isDev = true;
		}
		return self::$_isDev;
	}
}