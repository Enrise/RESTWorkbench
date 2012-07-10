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
 * @package     Workbench_View_Helper
 * @author      Enrise <info@enrise.com>
 * @author      dpapadogiannakis@enrise.com
 * @copyright   2010, Enrise
 * @license     http://www.opensource.org/licenses/bsd-license.php
 * @version     $Id: $
 */

class Workbench_View_Helper_Hateoas extends Zend_View_Helper_Abstract
{
    public function hateoas($body, $format, $host)
    {
        $search = '';
        $replace = '';
        switch (strtolower($format)) {
            case 'json':
                $host = str_replace('://', ':\\\\/\\\\/', $host);
                $search = '~(&quot;[a-zA-Z]+?&quot;:&quot;)(' . $host . '.+?)&quot;~';
                $replace = '$1<a class="ref" title="HATEOAS" href="$2">$2</a>&quot;';
                break;
            case 'xml':
                $host = preg_quote($host);
                $search = '~href=&quot;(' . $host . '.+?)&quot;~';
                $replace = 'href=&quot;<a class="ref" title="HATEOAS" href="$1">$1</a>&quot;';
                break;
            case 'php':
                //$host = preg_quote($host);
                $search = "~\\\'([a-zA-Z]+?\\\' =&gt; \\\')(" . $host . ".+?)\\\'~";
                $replace = '$1<a class="ref" title="HATEOAS" href="$2">$2</a>\\\'';
                break;
            default:
                return $body;
        }
        //preg_match_all($search, $body, $matches);
        //var_dump($matches, $search);
        return preg_replace($search, $replace, $body);
    }
}