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

class Workbench_Model_Workbench_Resource extends ArrayIterator
{
    protected $_resourceName;

    /**
     * @param $name
     * @return Workbench_Model_Workbench_Resource
     */
    public function setName($name)
    {
        $this->_resourceName = $name;
        return $this;
    }

    public function getName()
    {
        return $this->_resourceName;
    }

    public function current()
    {
        $current = parent::current();
        $current->setParent($this);
        return $current;
    }

    /**
     * @param Workbench_Model_Workbench_Endpoints $e
     * @return Workbench_Model_Workbench_Resource
     */
    public function append($e)
    {
        if (!$e instanceof Workbench_Model_Workbench_Endpoint) {
            throw new InvalidArgumentException('Invalid endpoints object given!');
        }
        parent::append($e);
        return $this;
    }
}