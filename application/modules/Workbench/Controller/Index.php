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
        Zend_Layout::startMvc(array(
            'layout'     => 'main',
            'layoutPath' => __DIR__ . '/../Layout'
        ));

        $this->view->addHelperPath(__DIR__ . '/../View/Helper', 'Workbench_View_Helper');
        $this->view->addScriptPath(__DIR__ . '/../View/Script');

        $this->_helper->layout()->setLayoutPath(implode(DIRECTORY_SEPARATOR, array(
            GLITCH_MODULES_PATH, ucfirst($this->getRequest()->getModuleName()), 'Layout'
        )));
        $this->view->apiHosts = $this->view->registry()->query('settings.workbench.apiHosts', new Zend_Config(array()))->toArray();
        $this->view->apiHost  = $this->view->registry()->query('settings.workbench.apiHost', '');
    }

    public function indexAction()
    {
        $r = Glitch_Registry::getSettings()->workbench;
        $m = new Workbench_Model_Workbench_EntryPoints();

        $this->view->resources = $m->getResources($r->scanPaths, $r->fileToClassStrip, $r->additionalIncludes);
    }

    public function colorAction()
    {
        function showColors($color) {
            if (is_string($color)) {
                $color = str_replace('#', '', $color);
                if (6 !== strlen($color)) {
                    //Invalid value, return input
                    return $color;
                }
                $r = substr($color, 0, 2);
                $g = substr($color, 2, 2);
                $b = substr($color, 4);
            } else if (is_array($color)) {
                if (3 !== count($color)) {
                    return $color;
                }
                $r = array_shift($color);
                if (ctype_digit((string) $r)) {
                    $r = dechex($r);
                }
                $g = array_shift($color);
                if (ctype_digit((string) $g)) {
                    $g = dechex($g);
                }
                $b = array_shift($color);
                if (ctype_digit((string) $b)) {
                    $b = dechex($b);
                }
            } else {
                return $color;
            }
            $r = '0x' . $r;
            $g = '0x' . $g;
            $b = '0x' . $b;

            if (0 == $r) {
                //Just plus one, save me alot of headache
                $r++;
            }

            $ratio1 = $g/$r;
            $ratio2 = $b/$r;

            $tohex = function ($v) {
                return strtoupper(sprintf('%02x', $v));
            };

            $x = 1;
            $percent = 0.01;
            $data = array();
            do {
                $rx = $r * $x;
                $gx = $rx*$ratio1;
                $bx = $rx*$ratio2;

                $wx = (1-$x)*0xFF;
                $rCalc = floor($wx+$rx);
                $gCalc = floor($wx+$gx);
                $bCalc = floor($wx+$bx);

                $data[round($x * 100)] = array(
                    'hex' => '#' . $tohex($rCalc) . $tohex($gCalc) . $tohex($bCalc),
                    'rgb' => implode(', ', array($rCalc, $gCalc, $bCalc))
                );
                $x = round($x - $percent, 2);
            } while($x >= 0);
            return $data;
        }
        $color = $this->_getParam('styleColor', $this->getRequest()->getQuery('styleColor', null));
        $colors = showColors($color);
        if (!is_array($colors)) {
            $colors = array();
            //$this->getResponse()->setHttpResponseCode(400);
        }
        $this->getResponse()->setBody(json_encode($colors));
        $this->_helper->layout()->disableLayout();
        $this->_helper->viewRenderer->setNoRender(true);
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
            $base = Glitch_Registry::getSettings()->workbench->apiHost;
            if (isset($p['misc'], $p['misc']['host']) && in_array($p['misc']['host'], $this->view->apiHosts, true)) {
                $base = rtrim($p['misc']['host'], '/');
            }
            $url = $base. $url;
        }
        $url = rtrim($url, '/');

        $accept = '*/*';
        $format = '';
        if (isset($core['accept'])) {
            $accept = $core['accept'];
        }
        if (isset($core['format'])) {
            $format = $core['format'];
        }
        $this->view->format = $format;

        $timeout = 10; //10 seconds should be enough
        if (isset($p['misc'], $p['misc']['timeout'])) {
            $tmp = Zend_Filter::filterStatic($p['misc']['timeout'], 'Digits');
            if (!empty($tmp)) {
                $timeout = $tmp;
            }
        }
        $client = new Zend_Http_Client();
        $client->setConfig(array(
            'timeout' => $timeout,
            'adapter' => new Zend_Http_Client_Adapter_Curl(),
        ));

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
            //In case of 3 legged OAuth
            if (isset($auth['requestTokenUrl']) && isset($auth['accessTokenUrl'])) {
                //@todo via config string
                $defaultClass = 'Workbench_Model_OAuthTokenParser';
                $class = $this->view->registry()->query('settings.workbench.oauth.tokenParser', $defaultClass);
                $tokenParser = new $class;
                if (!$tokenParser instanceof $defaultClass) {
                    throw new Exception(sprintf('Invalid class specified to parse OAuth request/access tokens. Extend %s for propper handling.', $defaultClass));
                }
                /** @var $tokenParser Workbench_Model_OAuthTokenParser */
                $request = OAuthRequest::from_consumer_and_token($consumer, $token, 'get', $auth['requestTokenUrl'], null);
                $request->sign_request($signature, $consumer, $token);
                switch (strtolower($auth['headerOrUrl'])) {
                    case 'url':
                        $client->setUri($request->to_url());
                        break;
                    case 'header':
                        $client->setUri($auth['requestTokenUrl']);
                        $client->setHeaders((array) $request->to_header($realm));
                        break;
                    default:
                        throw new Exception('Invalid parameter encountered!');
                }
                $response = $client->request('GET')->getBody();
                $requestTokens = $tokenParser->parseTokens($response);

                $request = OAuthRequest::from_consumer_and_token($consumer, $requestTokens, 'get', $auth['accessTokenUrl'], null);
                $request->sign_request($signature, $consumer, $requestTokens);

                switch (strtolower($auth['headerOrUrl'])) {
                    case 'url':
                        $client->setUri($request->to_url());
                        break;
                    case 'header':
                        $client->setUri($auth['accessTokenUrl']);
                        $client->setHeaders((array) $request->to_header($realm));
                        break;
                }
                $response = $client->request('GET')->getBody();
                //Build final token used for communication
                $token = $tokenParser->parseTokens($response);

                //@testing
                /*$url = 'http://term.ie/oauth/example/echo_api.php';
                $query = array(
                    'foo' => 'bar',
                    'method' => 'test',
                );
                $core['http_method'] = 'get';*/
            }
            $client->setUri($url);
            // Generate request and sign it
            $request = OAuthRequest::from_consumer_and_token($consumer, $token, $core['http_method'], $url, $query);
            $request->sign_request($signature, $consumer, $token);
            switch (strtolower($auth['headerOrUrl'])) {
                case 'url':
                    $client->setUri($request->to_url());
                    break;
                case 'header':
                    $headers = array_merge((array) $request->to_header($realm), $headers);
                    break;
            }
        }
        $headers = array_merge((array) $headers, array(
            'Accept' => $accept,
            'Accept-Charset' => 'utf-8',
        ));
        if (!empty($format)) {
           $headers['Content-Type'] = 'text/' . $format . '; charset=utf-8';
        }
        $client->setHeaders($headers);

        $starttime = microtime(true);
        try {
        	$a = $client->request(strtoupper($core['http_method']));
        } catch (Exception $e) {
            $last = $client->getLastResponse();
            $code = 500;
            $headers = array();
            if ($last instanceof Zend_Http_Response) {
                $code = $last->getStatus();
                $headers = $last->getHeaders();
            }
            $a = new Zend_Http_Response($code, $headers, (string) $e);
        }
        $endtime = microtime(true);

        $this->view->responsetime = $endtime - $starttime;

        $this->view->request = $client->getLastRequest();
        $this->view->response = $a;
        $this->view->url = $url;
        $this->view->id = $p['misc']['dom_id'];
        $this->view->apiHost = $p['misc']['host'];
    }

    /**
     *
     * @param Zend_Http_Client $client
     */
    protected function _handleOauth(Zend_Http_Client $client, array $params)
    {

    }

    protected function _filterAcceptHeader($accept, $format)
    {
        if (empty($format)) {
            return $accept;
        }
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