<?php
class Workbench_Model_OAuthTokenParser
{
    /**
     * Starter function to parse tokens from data.
     * Use _getTokens and _filterTokens to start your own parser.
     *
     * @param mixed $data
     * @return array
     */
    final public function parseTokens($data)
    {
        $data = $this->_getTokens($data);
        $data = $this->_filterTokens($data);
        if (!$this->isValid($data)) {
            throw new InvalidArgumentException(sprintf('Data "%s" provided is invalid!', var_export($data, true)));
        }
        return $data;
    }

    /**
     * Check if the tokens are valid
     *
     * @param array $data
     * @return bool
     */
    final public function isValid(stdClass $data)
    {
        return isset($data->key, $data->secret);
    }

    /**
     * Get the tokens from the data
     *
     * @param mixed $data
     * @return mixed
     */
    protected function _getTokens($data)
    {
        $tmp = array();
        parse_str($data, $tmp);
        $token = new stdClass();
        $token->key = $tmp['oauth_token'];
        $token->secret = $tmp['oauth_token_secret'];
        return $token;
    }

    /**
     * Filter the valid tokens out of the data
     *
     * @param mixed $data
     * @return array
     */
    protected function _filterTokens($data)
    {
        if (is_object($data)) {
            $data = (array) $data;
        }
        if (!is_array($data)) {
            return array();
        }
        return (object) array_intersect_key($data, array_flip(array('key', 'secret')));
    }
}