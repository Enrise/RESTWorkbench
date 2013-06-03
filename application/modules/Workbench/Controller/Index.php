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

        $this->_helper->layout()->setLayoutPath(
            implode(
                DIRECTORY_SEPARATOR,
                array(
                    GLITCH_MODULES_PATH,
                    ucfirst($this->getRequest()->getModuleName()),
                    'Layout'
                )
            )
        );
        $r = $this->getRequest();
        $host = Zend_Uri_Http::fromString($r->getScheme() . '://' . $r->getHttpHost());
        $this->view->apiHost  = $this->view->registry()->query('settings.workbench.apiHost', $host);
        $this->view->apiHosts = $this->view->registry()->query('settings.workbench.apiHosts', new Zend_Config(array()))->toArray();
        $this->view->apiHosts[] = $host;
    }

    public function indexAction()
    {
        $r = Glitch_Registry::getSettings()->workbench;
        $m = new Workbench_Model_Workbench_EntryPoints();

        $this->getResponse()->setHeader('Content-Type', 'text/html');
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

        $timeout = $this->view->registry()->query('settings.workbench.httpClient.options.timeout', 10); //10 seconds should be enough
        if (isset($p['misc'], $p['misc']['timeout'])) {
            $tmp = Zend_Filter::filterStatic($p['misc']['timeout'], 'Digits');
            if (!empty($tmp)) {
                $timeout = $tmp;
            }
        }
        $client = new Zend_Http_Client();
        $config = array();
        if (($config = $this->view->registry()->query('settings.workbench.httpClient.options'))) {
            if ($config instanceof Zend_Config) {
                $config = $config->toArray();
            } else if (is_string($config)) {
                $config = (array) $config;
            }
            $config['timeout'] = $timeout;
        }
        if (isset($p['misc'], $p['misc']['proxy_host'], $p['misc']['proxy_port'])) {
            $config['proxy_host'] = $p['misc']['proxy_host'];
            $config['proxy_port'] = $p['misc']['proxy_port'];
        }
        $client->setConfig($config);

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
                if ($count) {
                    //If we replaced something we don't need it in the signing
                    unset($p['params'][$k]);
                }
            }
            if ($modifyClient) {
                $client->setMethod($core['http_method']);
                $client->setEncType(Zend_Http_Client::ENC_URLENCODED);
            }
            //Trim of excess slashes
            $url = rtrim($url, '/');
        }
        $url = trim($url);

        //Query is need also for OAuth in hashing
        $queryStringParts = array();
        if (array_key_exists('query', $p) && is_array($p['query'])) {
            $queryStringParts = $this->_filterEmptyQueryParams($p['query']);
        }

        // REST resource filters are also part of the query string
        if (array_key_exists('filters', $p) && is_array($p['filters'])) {
            $filters = $this->_filterEmptyQueryParams($p['filters']);
            $queryStringParts = array_merge($queryStringParts, $filters);
        }

        if (0 < count($queryStringParts)) {
            //Stupid RFC3986
            $url .= '?' . $this->httpBuildQuery($queryStringParts);
        }

        $url = trim($url);
        $accept = $this->_filterAcceptHeader($accept, $format);

        $headers = array();
        if (2 < count($auth)) {
            $consumerkey = '';
            if (array_key_exists('consumerkey', $auth)) {
                $consumerkey = $auth['consumerkey'];
            }
            $consumersecret = '';
            if (array_key_exists('consumersecret', $auth)) {
                $consumersecret = $auth['consumersecret'];
            }
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
                    throw new Exception(
                        sprintf(
                            'Invalid class specified to parse OAuth request/access tokens. Extend %s for propper handling.',
                            $defaultClass
                        )
                    );
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
            }
            // Set the url of the orginal request (can be changed by
            // oauth-related calls)
            $client->setUri($url);
            //Apparently you need to provide all values that you send to do signing
            //$signParams = $query;
            $signParams = null;
            if ('post' === $core['http_method'] && isset($p['params']) && is_array($p['params']) && !$modifyClient) {
                $signParams = array_merge($queryStringParts, $p['params']);
            }
            // Generate request and sign it
            $request = OAuthRequest::from_consumer_and_token(
                $consumer,
                $token,
                $core['http_method'],
                $url,
                $signParams
            );
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

        if (isset($p['misc'], $p['misc']['debug']) && '1' == $p['misc']['debug']) {
            $client->getAdapter()->setConfig(array('timeout' => -1));
            $client->setCookie('debug_session_id', rand(10000000, 99999999));
            $client->setCookie('debug_start_session', 1);
            $client->setCookie('debug_host', $p['misc']['debughost']);
            $client->setCookie('debug_port', $p['misc']['debugport']);
            $client->setCookie('no_remote', 1);
            $client->setCookie('send_debug_header', 1);
            $client->setCookie('original_url', $client->getUri(true));
            $client->setCookie('start_debug', 1);
            $client->setCookie('debug_jit', 1);
            $client->setCookie('send_sess_end', 1);
        }

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
     * As PHP's http_build_query function is broken (badly!) we do it ourselves
     *
     * @param array $a
     * @param scalar $b
     * @param int $c
     * @return boolean
     */
    protected function httpBuildQuery($a, $b = '', $c = 0)
    {
        if (!is_array($a)) {
            return false;
        }
        $r = array();
        foreach ((array) $a as $k => $v) {
            if ($c) {
                $k = $b . "[]";
            } elseif (is_int($k)) {
                $k = $b . $k;
            }
            if (is_array($v) || is_object($v)) {
                $r[] = $this->httpBuildQuery($v, $k, 1);
                continue;
            }
            $r[] = rawurlencode($k) . "=" . rawurlencode($v);
        }
        return implode("&", $r);
    }

    protected function _filterEmptyQueryParams(array $params)
    {
        $validate = new Zend_Validate_NotEmpty(Zend_Validate_NotEmpty::STRING | Zend_Validate_NotEmpty::EMPTY_ARRAY);
        $ret = array();
        foreach ($params as $k => $v) {
            if (is_array($v) || $v instanceof Traversable) {
                $tmp = $this->_filterEmptyQueryParams($v);
                if (0 < count($tmp)) {
                    $v = array_filter($v, array($validate, 'isValid'));
                    $ret[$k] = $v;
                }
            } else if ($validate->isValid($v)) {
                $ret[$k] = $v;
            }
        }
        return $ret;
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
