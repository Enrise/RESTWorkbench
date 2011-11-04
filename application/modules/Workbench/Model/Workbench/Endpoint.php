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

class Workbench_Model_Workbench_Endpoint
{
    protected $_name = array(),
              $_method,
              $_url,
              $_fields,
              $_query,
              $_hint,
              $_description,
              $_useageUrl,
              $_parent,
              $_disabledCommit = false;

    protected static $_oauth = array();

    public function __construct($data = array())
    {
        $this->populate($data);
    }

    public static function setOauth(array $oauth)
    {
        self::$_oauth = $oauth;
    }

    public static function getOauth()
    {
        return self::$_oauth;
    }

    public static function hasOauth()
    {
        return 0 < count(self::$_oauth);
    }

    public function populate($data)
    {
        unset($data['oauth']);
        foreach ($data as $k => $v) {
            $method = 'set' . ucfirst($k);
            if (method_exists($this, $method)) {
                $this->{$method}($v);
            }
        }
        return $this;
    }

    /**
     * @return the $name
     */
    public function getName()
    {
        return $this->getUrl();
    }

    public function getPath()
    {
        return $this->getUrl();
    }

	/**
     * @param $name the $name to set
     */
    /*public function setName($name)
    {
        $this->_name = $name;
        return $this;
    }*/

	/**
     * @return the $method
     */
    public function getMethod()
    {
        return $this->_method;
    }

	/**
     * @param $method the $method to set
     */
    public function setMethod($method)
    {
        $this->_method = strtolower($method);
        //@todo: remove me!
        if (!Glitch_Application::isDevelopment() && 'get' !== $this->_method) {
            $this->setDisableCommit(true);
        }
        return $this;
    }

	/**
     * @return the $fields
     */
    public function getFields()
    {
        return $this->_fields;
    }

	/**
     * @param $fields the $fields to set
     */
    public function setFields($fields)
    {
        if (self::hasOauth()) {
            $oauth = self::getOauth();
            $fields = array_merge($fields, $oauth);
        }
        if (in_array($this->getMethod(), array('put', 'post'))) {
            $fields['body'] = array(
                'required' => true,
                'description' => 'API request body',
            );
        } /*else if ('delete' === $this->getMethod()) {
            //Should we protect deletes?
            $this->setDisableCommit(true);
        }*/
        if (!$fields instanceof Workbench_Model_Workbench_Params) {
            $fields = new Workbench_Model_Workbench_Params($fields);
            $fields->setParent($this);
        }
        $fields->setParent($this);
        $this->_fields = $fields;
        return $this;
    }

    public function setQuery($query)
    {
        if (!$query instanceof Workbench_Model_Workbench_Query) {
            $query = new Workbench_Model_Workbench_Query($query);
        }
        $query->setParent($this);
        $this->_query = $query;
        return $this;
    }

    public function getQuery()
    {
        return $this->_query;
    }

	/**
     * @return the $description
     */
    public function getDescription()
    {
        if (empty($this->_description)) {
            return 'No full description was provided, so sad..';
        }
        return $this->_description;
    }

	/**
     * @param $description the $description to set
     */
    public function setDescription($description)
    {
        $this->_description = $description;
        return $this;
    }

    public function setHint($value)
    {
        $this->_hint = $value;
        return $this;
    }

    public function getHint()
    {
        return $this->_hint;
    }

    public function setUseageUrl($url)
    {
        $this->_useageUrl = $url;
        return $this;
    }

    public function getUseageUrl()
    {
        $data = $this->getMethod() . $this->getUrl();
        $data = str_replace(array('/', '\\', '\\\\', '-'), ' ', $data);
        //Replace all url params
        $data = preg_replace('({[a-z_-]+})', '', $data);
        $data = str_replace(' ', '', ucwords($data));
        $data = lcfirst($data);
        return $data;
    }

    public function setUrl($url)
    {
        $this->_url = str_replace(array('\\\\', '//'), '', $url);
        return $this;
    }

    public function getUrl()
    {
        return $this->_url;
    }

    public function setParent(Workbench_Model_Workbench_Resource $p)
    {
        $this->_parent = $p;
        return $this;
    }

    public function getParent()
    {
        return $this->_parent;
    }

    public function setDisableCommit($flag)
    {
        $this->_disabledCommit = (bool) $flag;
        return $this;
    }

    public function getDisableCommit()
    {
        return $this->_disabledCommit;
    }

    public function isDisabledCommit()
    {
        return true === $this->getDisableCommit();
    }

	public function isValid()
    {
        return true;
    }

    /*public function fromDocBlock($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException('Idiot!');
        }
        return $this;
    }*/
}