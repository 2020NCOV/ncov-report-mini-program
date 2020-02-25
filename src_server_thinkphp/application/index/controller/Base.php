<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
class Base extends Controller{

   
   public function _initialize()
   {      
       if((Request::instance()->module()=='index' && Request::instance()->controller()=='Login'  && Request::instance()->action()=="getcode")
            || (Request::instance()->module()=='index' && Request::instance()->controller()=='Report'  && Request::instance()->action()=="get_district_path"))
       {
           return;
       }else{
           //检测uid与token是否一致 
           //return;
           $uid =input('post.uid');
           $token =input('post.token'); 
           $user = Db::table('user_weixin')->where(['wid' => $uid,'token'=> $token ])->find(); 
           if(empty($user)){
               	json(array("errcode"=>1106,"msg"=>"token过期，请尝试重新扫码激活并绑定个人信息"))->send();
               	exit();
           } 
       }
   }
}