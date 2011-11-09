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
 * @package     Workbench_Controller_Index
 * @author      Enrise <info@enrise.com>
 * @author      dpapadogiannakis@enrise.com
 * @copyright   2010, Enrise
 * @license     http://www.opensource.org/licenses/bsd-license.php
 * @version     $Id: $
 */

class Workbench_Controller_Index extends Zend_Controller_Action
{

    public function init()
    {

    }

    public function indexAction()
    {
        $r = Glitch_Registry::getSettings()->workbench;
        $m = new Workbench_Model_Workbench_EntryPoints();

        $this->view->resources = $m->getResources($r->scanPaths, $r->fileToClassStrip, $r->additionalIncludes);
    }

    public function restAction()
    {
        $this->_helper->layout()->disableLayout();
        $this->getResponse()->setHeader('Content-Type', 'application/javascript');
        $r = $this->getRequest();
        $p = $r->getPost();
        $core = $p['core'];

        //@todo: remove me!
        if (!Workbench_Model_Application::isDevelopment() && 'get' !== $core['http_method']) {
            throw new Exception('Something went horribly wrong!');
        }

        $auth = array_filter($r->getPost('oauth', array()));
        $url = $core['path'];
        //Check if there is http, https or ref to current protocol
        if (!preg_match('~^((http(s|)://)|//)~i', $url)) {
            $url = Glitch_Registry::getSettings()->workbench->baseUrl . $url;
        }
        $url = rtrim($url, '/');

        $accept = $core['accept'];
        $format = $core['format'];
        $this->view->format = $format;

        $body = '';
        $client = new Zend_Http_Client();

        if (array_key_exists('params', $p) && is_array($p['params']) && 0 < count($p['params'])) {
            $hasBody = false;
            if (array_key_exists('body', $p['params']) && 0 < strlen($p['params']['body'])) {
                $client->setRawData($p['params']['body']);
                $hasBody = true;
            }
            //Not needed after this..
            unset($p['params']['body']);

            $modifyClient = false;
            foreach ($p['params'] as $k => $v) {
                $count = 0;
                $url = str_replace('{' . $k . '}', $v, $url, $count);
                //Params that are not found for replacement are collected in the client as body if there is no body previously set
                if (!$hasBody && !$count && in_array($core['http_method'], array('put', 'post'))) {
                    $client->setParameterPost($k, $v);
                    $modifyClient = true;
                }
            }
            if ($modifyClient) {
                $client->setMethod($core['http_method']);
                $client->setEncType(Zend_Http_Client::ENC_URLENCODED);
            }
            //Trim of excess slashes
            $url = rtrim($url, '/');
        }

        //Query is need also for OAuth in hashing
        $query = array();
        if (array_key_exists('query', $p) && is_array($p['query'])) {
            $query = array_filter($p['query']);
            if (0 < count($query)) {
                $url .= '?' . http_build_query($query);
            }
        }
        $url = trim($url);
        Glitch_Registry::getLog()->debug($url);

        //Done with filtering the URL
        $client->setUri($url);

        $accept = $this->_filterAcceptHeader($accept, $format);

        $headers = array();
        if (2 < count($auth)) {
            $consumerkey = $auth['consumerkey'];
            $consumersecret = $auth['consumersecret'];
            $signing = $auth['signing'];
            $realm = '';
            if (array_key_exists('realm', $auth)) {
                $realm = $auth['realm'];
            }
            $consumer = new OAuthConsumer($consumerkey, $consumersecret);
            $token = null;
            // Determine signature to be used
            switch ($signing) {
                case 'sha1' :
                    $signature = new OAuthSignatureMethod_HMAC_SHA1();
                    break;
                case 'rsa':
                    $signature = new OAuthSignatureMethod_RSA_SHA1();
                    break;
                case 'plaintext' :
                default :
                    $signature = new OAuthSignatureMethod_PLAINTEXT();
                    break;
            }

            // Generate request and sign it
            $request = OAuthRequest::from_consumer_and_token($consumer, $token, $core['http_method'], $url, $query);
            $request->sign_request($signature, $consumer, $token);
            $headers = $request->to_header($realm);
        }

        $headers = array_merge((array) $headers, array(
            'Accept' => $accept,
            'Accept-Charset' => 'utf-8',
            'Content-Type' => 'text/' . $format . '; charset=utf-8',
        ));
        $client->setHeaders($headers);

        $starttime = microtime(true);
        $a = $client->request($core['http_method']);
        $endtime = microtime(true);

        $this->view->responsetime = $endtime - $starttime;

        $this->view->request = $client->getLastRequest();
        $this->view->response = $a;
        $this->view->url = $url;
        $this->view->id = $p['misc']['dom_id'];
    }

    protected function _filterAcceptHeader($accept, $format)
    {
        if (false === strpos($accept, '+')) {
            //Append the format to the accept header
            $accept .= '+' . $format;
        } else if (!preg_match('(\+' . $format . ')', $accept)) {
            //Prepend the correct format behind the accept
            $accept = preg_replace('(\+[a-z]+)', '+' . $format, $accept);
        }
        return trim($accept);
    }
}