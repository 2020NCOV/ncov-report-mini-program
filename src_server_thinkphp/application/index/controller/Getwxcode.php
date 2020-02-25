<?php
namespace app\index\controller;
use think\Request;
use think\Db;
use think\Session;
use think\Controller;
use \think\Config;

class Getwxcode extends Controller{
  
  
  
    public function getAccessToken(){
        $appid  = Config::get('wechat_appid');
        $secret = Config::get('wechat_secret');
        $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appid."&secret=".$secret;
        $HttpService = new \app\index\service\Http();
        $res = json_decode($HttpService->get_request($url));
        $access_token = @$res->access_token;
        return $access_token;
	}
  
  
    public function get_image()
    {
            $id = trim($this->request->param('id','0','intval'));
            $access_token = $this->getAccessToken();
            $url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" . $access_token;
            $data['scene'] = $id;
            //小程序的详情页路径
            $data['path'] = 'pages/info/info';
            //二维码大小
            $data['width'] = '430';
      
            //http post
            $res = $this->postUrl($url, json_encode($data));
            //var_dump($res);
            $path = $id . '.jpg';
            file_put_contents($path, $res);
            $return['status_code'] = 2000;
            $return['msg'] = 'ok';
            $return['img'] =  "/".$path;
            echo "<img src='".$return['img']."' />";exit;
            //echo json_encode($return);exit;
     }
  
     // 实现Post请求
    public function postUrl($url,$data){
        $curl=curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE);
        if (! empty($data)) {
            curl_setopt($curl, CURLOPT_POST, 1);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        }
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
        $output = curl_exec($curl);
        //var_dump($output);
        curl_close($curl);
        return $output;
    }
}
