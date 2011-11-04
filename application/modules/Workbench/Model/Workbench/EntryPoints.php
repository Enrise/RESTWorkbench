<?php
/**
 * Glitch
 *
 * Copyright (c) 2010, Enrise BV (www.enrise.com).
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in
 *     the documentation and/or other materials provided with the
 *     distribution.
 *
 *   * Neither the name of Enrise nor the names of his contributors
 *     may be used to endorse or promote products derived from this
 *     software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @category    Workbench
 * @package     Workbench_Model_Workbench
 * @author      Enrise <info@enrise.com>
 * @author      dpapadogiannakis@enrise.com
 * @copyright   2010, Enrise
 * @license     http://www.opensource.org/licenses/bsd-license.php
 * @version     $Id: $
 */

class Workbench_Model_Workbench_EntryPoints
{

    const HINT = 'hint';
    const PARAM = 'param';
    const FORMAT = 'format';
    const ACCEPT = 'accept';
    const QUERY = 'query';
    const URL = 'url';
    const ACTION_REGEX = '~^(resource|collection)(Delete|Get|Head|Options|Put|Post)Action~';

    protected $_parseFields = array(
        //@todo: what do we do with OAuth fields?
        'oauth',
        'signing' => '~(.+)~',
        'realm',
        self::HINT => '~(.+)~',
        self::PARAM => '~([a-z_]+)( {optional} |)(.+|)~',
        self::FORMAT => '~(.+)(\+@format)~',
        self::ACCEPT => '~(.+)~',
        self::QUERY => '~([a-z_]+)( {optional} |)(.+|)~',
        self::URL => '(.+)',
    );

    protected $_skipMethods = array('init', 'passThrough', '__construct', '__destruct');

    protected function _sanitizePath($path)
    {
        return str_replace(array('\\', '/'), DIRECTORY_SEPARATOR, $path);
    }

    protected function _filterPaths($paths = array())
    {
        if ($paths instanceof Zend_Config) {
            $paths = $paths->toArray();
        }
        return array_map(array($this, '_sanitizePath'), $paths);
    }

    public function getResources($paths = array(), $strips = array(), $includePaths = array())
    {
        $paths = $this->_filterPaths($paths);
        $strips = $this->_filterPaths($strips);
        $includePaths = $this->_filterPaths($includePaths);

        $resources = new Workbench_Model_Workbench_Resources();
        $skipped = array();
        foreach ($paths as $path) {
            $directory = new RecursiveDirectoryIterator($path);
            $iterator = new RecursiveIteratorIterator($directory);
            $regex = new RegexIterator($iterator, '/^.+\.php$/i', RecursiveRegexIterator::GET_MATCH);
            $files = array();
            foreach ($regex as $info) {
                array_unshift($files, $info[0]);
            }

            $strips = array_merge($strips, array('.php'));
            foreach ($includePaths as $includePath) {
                require_once $includePath;
            }

            foreach ($files as $fileLocation) {
                require_once $fileLocation;
                $classname  = str_ireplace($strips, '', $fileLocation);
                $classname  = trim(str_replace(DIRECTORY_SEPARATOR, '_', $classname), '_');
                $reflection = new ReflectionClass($classname);
                $docblock   = (string) $reflection->getDocComment();
                //What idiot creates a class without docblocks, sjees!
                if (!$docblock) {
                    //$skipped[$reflection->name] = $reflection->name . ' no docblock';
                    //continue;
                }
                //First only public methods are valid
                $methods = $reflection->getMethods(ReflectionMethod::IS_PUBLIC);
                //No? NEXT!
                if (0 === count($methods)) {
                    $skipped[$reflection->name] = $reflection->name . ' no methods';
                    continue;
                }

                $resource = new Workbench_Model_Workbench_Resource();
                $resources->append($resource);
                //Last part is enough?
                $name = str_ireplace(array('Controller_', '_'), array('', '/'), $reflection->name);
                $resource->setName($name);

                foreach ($methods as $method) {
                    //Only check in master class, not subclasses
                    if ($method->class !== $reflection->name) {
                        continue;
                    }
                    //Finaly check the method name for a certain format, we know what is valid?
                    $isValid = preg_match(self::ACTION_REGEX, $method->name, $methodMatches);
                    if (!$isValid) {
                        if (!in_array($method->name, $this->_skipMethods)) {
                            $skipped[$method->class][$method->name] = $method->name . ' invalid method for REST';
                        }
                        continue;
                    }
                    //Trim all the crap of descriptions
                    $doc = str_replace(array(implode(array('/', '*', '*')), implode(array('*', '/'))), '', $method->getDocComment());
                    if (!$doc) {
                        $skipped[$method->class][$method->name] = $method->class . ' ' . $method->name . ' no valid docblock detected';
                        continue;
                    }
                    $matches = $this->_getTokensFromDocblock($doc);
                    if (!$matches->has(self::URL)) {
                        $skipped[$method->class][$method->name] = $method->class . ' ' . $method->name . ' field "' . self::URL . '" not found';
                        continue;
                    }
                    $endpoint = new Workbench_Model_Workbench_Endpoint();
                    $resource->append($endpoint);

                    //Set the method of the request (get, put, post, etc)
                    $endpoint->setMethod($methodMatches[2]);

                    //Substr till we find the first params, using * @ as token
                    $description = (string) substr($doc, 0, strpos($doc, '* @'));
                    $description = array_filter(preg_split("(\n|\r\n|\n\r|" . PHP_EOL . ")", $description));
                    foreach ($description as &$part) {
                        //Mega trim to nicely show multilines if there
                        $part = ltrim(trim(rtrim(trim($part), '*')), '* ');
                    }
                    $description = array_filter($description);
                    $description = implode('<br/>', $description);
                    $endpoint->setDescription($description);

                    $params = array();
                    $query  = array();
                    foreach ($matches as $k => $value) {
                        if (array_key_exists($k, $this->_parseFields)) {
                            //Further split the values
                            preg_match($this->_parseFields[$k], $value, $tmp);
                            switch ($k) {
                                case self::URL:
                                    $endpoint->setUrl($value);
                                    break;
                                case self::HINT:
                                    $endpoint->setHint($value);
                                    break;
                                case self::ACCEPT:
                                    $params[$k] = $value;
                                    break;
                                case self::FORMAT:
                                    $params[$k] = array_filter(explode('|', trim($value)));
                                    break;
                                case self::PARAM:
                                    //Check for optional value
                                    if (empty($tmp[2])) {
                                        $params[$tmp[1]]['required'] = true;
                                    }
                                    if (!empty($tmp[3])) {
                                        $params[$tmp[1]]['description'] = trim($tmp[3]);
                                    }
                                    break;
                                case self::QUERY:
                                    //Check for optional value
                                    if (empty($tmp[2])) {
                                        $query[$tmp[1]]['required'] = true;
                                    }
                                    if (!empty($tmp[3])) {
                                        $query[$tmp[1]]['description'] = trim($tmp[3]);
                                    }
                                    break;
                            }
                        }
                    }
                    $endpoint->setFields($params);
                    $endpoint->setQuery($query);
                } //End methods foreach
            } //End file foreach
        }
        $resources->setSkipped($skipped);
        return $resources;
    }

    protected function _getTokensFromDocblock($doc)
    {
        preg_match_all('~(@([a-z]+)) (.+)~', $doc, $matches);
        return new Workbench_Model_Workbench_Tokens($matches);
    }
}