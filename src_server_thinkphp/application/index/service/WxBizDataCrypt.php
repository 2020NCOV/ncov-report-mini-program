<?php
namespace app\index\service;

use think\Request;
use think\Db;
use think\Session;
class WxBizDataCrypt {

   	/**
     * @var int
     * 定义错误码
     */
    public static $OK                = 0;
    public static $IllegalAesKey     = -41001;
    public static $IllegalIv         = -41002;
    public static $IllegalBuffer     = -41003;
    public static $DecodeBase64Error = -41004;
    private $appid;
    private $sessionKey;
    public function __construct($appid,$session_key)
    {
        $this->sessionKey = $session_key;
        $this->appid = $appid;
    }


    /**
     * @param $encryptedData
     * @param $iv
     * @param $data
     * @return mixed
     */
    public function decryptData( $encryptedData, $iv, &$data )
    {
        if (strlen($this->sessionKey) != 24) {
            return self::$IllegalAesKey;
        }
        $aesKey=base64_decode($this->sessionKey);


        if (strlen($iv) != 24) {
            return self::$IllegalIv;
        }
        $aesIV=base64_decode($iv);

        $aesCipher=base64_decode($encryptedData);

        $result=openssl_decrypt( $aesCipher, "AES-128-CBC", $aesKey, 1, $aesIV);


        $dataObj=json_decode( $result );
        if( $dataObj  == NULL )
        {
            return self::$IllegalBuffer;
        }
        if( $dataObj->watermark->appid != $this->appid )
        {
            return self::$IllegalBuffer;
        }
        $data = $result;
        return self::$OK;
    }
   
}