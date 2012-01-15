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
 * @copyright   2012, Enrise
 * @license     http://www.opensource.org/licenses/bsd-license.php
 * @version     $Id: $
 */

class Workbench_Model_Workbench_Tokens implements Iterator
{
    /**
     * @var array
     *
     * Keys:
     * 0    => Orig lines
     * 1    => Orig keys
     * 2    => Keys
     * 3    => Values
     */
    protected $_data = array();

    protected $_max = 0;

    protected $_counter = 0;

    public function __construct($data)
    {
        $this->_data = $data;
        $this->_max  = (int) count($data[0]);
    }

    public function has($value)
    {
        return array_search($value, $this->_data[2]);
    }

    public function key()
    {
        return current($this->_data[2]);
    }

    public function current()
    {
        return current($this->_data[3]);
    }

    public function next()
    {
        next($this->_data[1]);
        next($this->_data[2]);
        next($this->_data[3]);
        ++$this->_counter;
    }

    public function rewind()
    {
        reset($this->_data[1]);
        reset($this->_data[2]);
        reset($this->_data[3]);
        $this->_counter = 0;
    }

    public function valid()
    {
        return $this->_counter < $this->_max;
        return null !== $this->key();
    }

    public function __get($key)
    {
        $pos = $this->has($key);
        if (false === $pos) {
            throw new OutOfBoundsException(
                        sprintf('invalid seek position (%s)', $key);
        }

        return $this->_data[3][$pos];
    }
}
