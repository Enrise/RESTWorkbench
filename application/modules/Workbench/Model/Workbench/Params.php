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

class Workbench_Model_Workbench_Params implements Iterator
{
    protected $_fields = array();

    protected $_parent;

    public function __construct($fields = array(), $query = array())
    {
        $this->_setFields($fields);
    }

    public function setParent(Workbench_Model_Workbench_Endpoint $r)
    {
        $this->_parent = $r;
        return $this;
    }

    public function getParent()
    {
        return $this->_parent;
    }

    protected function _setFields($data)
    {
        if (is_object($data)) {
            $data = (array) $data;
        }
        $this->_fields = $data;
        reset($this->_fields);
    }

    public function getDescription()
    {
        return $this->getField('description', '');
    }

    public function getRawValue()
    {
        return $this->_fields[$this->key()];
    }

    public function key()
    {
        return key($this->_fields);
    }

    public function isRequired()
    {
        return true === $this->getField('required', false);
    }

    public function setDisabled($flag)
    {
        $this->_fields[$this->key()]['disabled'] = (bool) $flag;
        return $this;
    }

    public function isDisabled()
    {
        return true === $this->getField('disabled', false);
    }

    /**
     * @return Zend_Form_Element
     */
    public function current()
    {
        $elm = 'Text';
        $value = $this->getRawValue();
        $belongsTo = 'params';
        $fieldName = $this->key();
        $description = $this->getDescription();
        switch ($fieldName) {
            case 'format':
                $elm = 'Select';
                $description = 'API response format';
                $belongsTo = 'core';
                break;
            case 'accept':
                $value = (array) $value;
                //Make sure that all the accept header available have a format (if the +@format is found that is)
                $value = array_map(array($this, '_setFormat'), $value);
                //Make sure that the value is also available for key in array. Select elements use this.
                $value = array_combine($value, $value);
                if (is_array($value) && 1 < count($value)) {
                    $elm = 'Select';
                }
                $belongsTo = 'core';
                break;
            case 'method':
            case 'http_method':
                $belongsTo = 'core';
                break;
            case 'body':
                $elm = 'Textarea';
                break;
        }

        $elm = 'Zend_Form_Element_' . $elm;
        $id = implode('_', array('parameters', $this->getParent()->getUseageUrl(), $fieldName));
        $name = $fieldName;
        $cssClass = array($this->key());
        $isArray = false;
        if (false !== strpos($name, '[')) {
            $cssClass[] = 'arrayParam';
            $isArray = true;
        }
        $filter = new Zend_Filter();
        $filter->addFilter(new Zend_Filter_Alnum());
        $cssClass = array_map(array($filter, 'filter'), $cssClass);
        $elm = new $elm($name, array(
            'label' => $fieldName,
            'decorators' => array('ViewHelper'),
            'description' => $description,
            'id' => $id,
            'belongsTo' => $belongsTo,
            'class' => implode(' ', $cssClass),
            'isArray' => $isArray,
        ));

        if ($elm instanceof Zend_Form_Element_Multi) {
            if ('format' === $fieldName || 'signing' === $fieldName) {
                $value = (array) $value;
                $value = array_combine($value, $value);
                if (1 === count($value)) {
                    $this->setDisabled(true);
                }
            }
            $elm->setMultiOptions($value);
        } else {
            if (is_array($value)) {
                if (array_key_exists('value', $value) && is_string($value['value'])) {
                    $value = $value['value'];
                } else if (1 === count($value)) {
                    $value = array_shift($value);
                } else {
                    $value = '';
                }
            }
            $elm->setValue($value);
        }

        $placeholder = '(optional)';
        if ($this->isRequired()) {
            $elm->setRequired(true);
            $elm->setAttrib('class', $elm->getAttrib('class') . ' required');
            $placeholder = '(required)';
        }
        $elm->setAttrib('placeholder', $placeholder);

        if ($this->isDisabled() || $this->getParent()->isDisabledCommit()) {
            $elm->setAttrib('readonly', 'readonly');
            $elm->helper = 'formText';
            if ($elm instanceof Zend_Form_Element_Select) {
                $value = $elm->getMultiOptions();
                $elm->setValue(array_shift($value));
                $elm->setAttrib('class', $elm->getAttrib('class') . ' select');
            }
        }
        return $elm;
    }

    public function next()
    {
        next($this->_fields);
    }

    public function rewind()
    {
        reset($this->_fields);
    }

    public function valid()
    {
        return null !== $this->key();
    }

    public function getField($field, $default = null)
    {
        if (is_array($this->_fields[$this->key()]) && array_key_exists($field, $this->_fields[$this->key()])) {
            return $this->_fields[$this->key()][$field];
        }
        return $default;
    }

    public function toArray()
    {
        return (array) $this->_fields;
    }

    protected function _setFormat($value)
    {
        $format = $this->_fields['format'];
        if (is_array($format)) {
            //Array values, pick first!
            $format = array_shift($format);
        }
        $value = str_ireplace('@format', $format, $value);
        return $value;
    }
}