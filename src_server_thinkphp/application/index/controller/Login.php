<?php
// +----------------------------------------------------------------------
// | Copyright (c) 2020 2020NCOV All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: zhangqixun <zhangqx@ss.pku.edu.cn>
// +----------------------------------------------------------------------

namespace app\index\controller;
use think\Request;
use think\Db;
use think\Session;
use think\Controller;
use \think\Config;

class Login extends Base{
  
    public function index()
    {
        //重置session
        Session::clear();
        return  $this->fetch();
    }
  
    public function getcode()
    {
        if( empty(Request::instance()->post('code'))){
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:code'
            ]);
        }
    
        $code = Request::instance()->post('code');
        $type = Request::instance()->post('type');

        //根据code 获取openid和session_key
        $appid  = Config::get('wechat_appid');
        $secret = Config::get('wechat_secret');
        
        //echo $appid;
        //curl请求获得openid,session_key
        $curl   =  "https://api.weixin.qq.com/sns/jscode2session?appid=".$appid."&secret=".$secret."&js_code=".$code."&grant_type=authorization_code";
        //echo $curl;
        $HttpService = new \app\index\service\Http();
        $res =$HttpService->get_request($curl);
        $res    = json_decode($res,true);
        //var_dump($res);
        
        if(isset($res['openid']) )
        {
            $openid = $res['openid'];
            $user = Db::table('user_weixin')->where(['openid' => $openid ])->find();
            $token = $this->makeToken();
            $time_out = strtotime("+1 days");
            $ifelse = '';
            //用户信息入库
            if(!empty($user))
            {
                //echo "if";
                //echo $res['openid'];
                Db::table('user_weixin')->where(['openid' => $openid])->update([
                    'token' => $token,
                    'time_out'    => $time_out,
                    'login_time'  => date('Y-m-d H:i:s'),
                ]);
                $wid = $user['wid'];
                $ifelse = 'if';
            } else
            {
                    //echo "else";
                    //echo $res['openid'];
                $wid =Db::table('user_weixin')->insert([
                    'openid'      => $res['openid'],
                    'token' => $token,
                    'time_out'    => $time_out,
                    'login_time'  => date('Y-m-d H:i:s'),
                ]);
                $user2 = Db::table('user_weixin')->where(['openid' => $openid ])->find();
                if (!empty($user2))
                {
                    $wid = $user2['wid'];
                } else
                {
                    return json([
                        'errcode'        => 1008,
                        'msg'       => "获取请求失败，请退出重试"
                    ]);
                    
                }
                //var_dump($wid);
                $ifelse ='else'; 
            }
            
            return json([
                'errcode'      => 0,
                'token'        => $token,
                'uid'		   => $wid, 
                'login_status' => 1,
                'login_time'   => date('Y-m-d H:i:s')
            ]);
        } else
        {
            return json([
                'errcode'   => 1001,
                'msg'       => "获取openid失败"
            ]);
        }
     }
  
  
  	public function getcorpname()
    {
      	$uid =input('post.uid');
        $token =input('post.token'); 
        $corpid =input('post.corpid');
        $template_code =input('post.template_code');

        if (empty($form_template))
        {
            $template_code="company";
        }
    
        if( empty($uid) )
        {
            return json([
                'errcode'    => 1003,
                'msg'        => '参数错误:uid'
            ]);
        }
        if (empty($token))
        {
            return json([
                'errcode'    => 1003,
                'msg'        => '参数错误:token'
            ]);
        }
        if (empty($corpid))
        {
            return json([
                'errcode'    => 1003,
                'msg'        => '参数错误:corpid'
            ]);
        }
    
        // 获取企业信息
        $corp = Db::table('organization')->where(['corpid' => $corpid ])->find();
        
        if(!empty($corp))
        {
            return json([
                    'errcode'        => 0,
                    'corpid'         =>$corpid,
                    'corpname'       =>$corp['corpname'],
                    'template_code'  =>$corp['template_code'],
                    'type_corpname'  =>$corp['type_corpname'],
                    'type_username'  =>$corp['type_username'],
                    'depid'         =>$corp['id']
                
            ]);
        } else
        {
            return json([
                    'errcode'        => 10006,
                    'msg'         =>"获取企业信息失败"
            ]);
        }
    }
  
    public function check_is_registered()
    {
      	//echo "login";
		//	echo Request::instance()->post('rawData');
      
        $uid =input('post.uid');
        $token =input('post.token'); 
        $corpid =input('post.corpid');
    
        if( empty($uid) )
        {
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:uid'
            ]);
        }
        if( empty($token) )
        {
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:token'
            ]);
        }
        if( empty($corpid) )
        {
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:corpid'
            ]);
        }
    
        //此处需要到用户表里面检查是否有这个企业编号和这个用户名
        $corp = Db::table('organization')->where(['corpid' => $corpid ])->find();
            if(!empty($corp)){
                $depid = $corp['id'];
            }else{
                return json([
                        'errcode'        => 10006,
                        'msg'         =>"获取企业信息失败"
                ]);
        }
        //echo "999";
        //echo $depid;
        $corp_bind = Db::table('user_bind_info')->where(['dep_id' => $depid,'wx_uid'=> $uid ,'isbind'=> 1 ])->find();
        if (!empty($corp_bind))
        {
            return json([
                'errcode'       => 0,
                'is_registered' => 1
            ]);
        } else
        {
            return json([
                'errcode'       => 0,
                'is_registered' => 0
            ]);
        }
    }
  
    public function check_user()
    {
      	//echo "login";
		//	echo Request::instance()->post('rawData');
        $uid =input('post.uid');
        $token =input('post.token'); 
        $corpid =input('post.corpid');
        $userid =input('post.userid');
        $depid =input('post.$depid'); //该参数，目前未传递

        if( empty($uid) )
        {
            return json([
                'errcode'    => 1003,
                'msg'        => '参数错误:uid'
            ]);
        }
        if( empty($token) )
        {
            return json([
                'errcode'    => 1003,
                'msg'        => '参数错误:token'
            ]);
        }
        if (empty($corpid))
        {
            return json([
                'errcode'    => 1003,
                'msg'        => '参数错误:corpid'
            ]);
        }
        if (empty($userid))
        {
            return json([
                'errcode'    => 1003,
                'msg'        => '参数错误:userid'
            ]);
        }
    
        //此处需要到用户表里面检查是否有这个企业编号和这个用户名
    
        // 获取企业信息
        if (empty($depid))
        {
            $corp = Db::table('organization')->where(['corpid' => $corpid ])->find();
            if (!empty($corp)){
                $depid = $corp['id'];
            } else
            {
                return json([
                    'errcode'   => 10006,
                    'msg'       =>"获取企业信息失败"
                ]);
            }
        }
            //echo $depid;
            //echo $userid;
        $corp_bind = Db::table('user_bind_info')->where(['dep_id' => $depid,'username'=> $userid ,'isbind'=> 1 ])->find();
        if(!empty($corp_bind) ){
            //echo "999";
            if(0 == $corp_bind['isbind']){
                return json([
                    'errcode'        => 0,
                    'corpid'         =>$corpid,
                    'userid'         =>$userid,
                    'is_exist'        => 0
                ]);
            }else{
                return json([
                    'errcode'        => 100020,
                    'msg'            =>"该用户已被其他微信绑定，每个用户只能被一个微信绑定"
                ]);
            }
        }
    
        return json([
            'errcode'        => 0,
            'corpid'         =>$corpid,
            'userid'         =>$userid,
            'is_exist'        => 0
        ]);
    }
  
    //目前所有都到这里来注册及绑定数据
     public function register()
    {
      	//echo "login";
		//	echo Request::instance()->post('rawData');
 
        $uid =input('post.uid');
        $token =input('post.token'); 
        $corpid =input('post.corpid');
        $userid =input('post.userid');
        $name =input('post.name');
        $phone_num =input('post.phone_num');

        if( empty($uid) )
        {
            return json([
                'errcode'   => 1003,
                'msg'       => '参数错误:uid'
            ]);
        }
        if( empty($token) )
        {
            return json([
                'errcode'   => 1003,
                'msg'       => '参数错误:token'
            ]);
        }
        if( empty($corpid) )
        {
            return json([
                'errcode'   => 1003,
                'msg'       => '参数错误:corpid'
            ]);
        }
        if( empty($userid) )
        {
            return json([
                'errcode'   => 1003,
                'msg'       => '参数错误:userid'
            ]);
        }
        if( empty($name) )
        {
            return json([
                'errcode'   => 1003,
                'msg'       => '参数错误:name'
            ]);
        }
        if( empty($phone_num) )
        {
            return json([
                'errcode'   => 1003,
                'msg'       => '参数错误:phone_num'
            ]);
        }
    
        // 获取企业信息
        $corp = Db::table('organization')->where(['corpid' => $corpid ])->find();
        $depid = 0;
        if (!empty($corp))
        {
            $depid = $corp['id'];
        } else
        {
            return json([
                'errcode'   => 10006,
                'msg'       =>"获取企业信息失败"
            ]);
        }
    
        $corp_bind = Db::table('user_bind_info')->where(['wx_uid' => $uid,'dep_id' => $depid,'username'=> $userid,'isbind' => 1])->find();
        if (!empty($corp_bind))
        {
                return json([
                'errcode'        => 0,
                'is_registered'  =>1
            ]);
            //以上是仅仅重新更新，防止er_user_student_weixin表中的字段数据不一致导致的返回值异常的问题
        } else
        {
            $corp_bind = Db::table('user_bind_info')->where(['dep_id' => $depid,'username'=> $userid ,'isbind'=> 1 ])->find();
            if (!empty($corp_bind))
            {
                return json([
                        'errcode'        => 100020,
                        'msg'            =>"该用户已被其他微信绑定，一个用户只能绑定一个微信"
                ]);
            }
            //以上是为了防止被恶意绑定
        
            Db::table('user_bind_info')->insert([
                'wx_uid' => $uid,
                'dep_id' => $depid,
                'username' => $userid,
                'isbind' => 1,
            ]);
            Db::table('user_weixin')->where(['wid' => $uid])->update([
                'userid' => $userid,
                'name' => $name,
                'phone_num' => $phone_num,
            ]);
            return json([
                'errcode'        => 0,
                'is_registered'  =>1
            ]);
        }
    }
   
 	public function unbind()
    {
      	//echo "login";
		//	echo Request::instance()->post('rawData');
        $uid =input('post.uid');
        $token =input('post.token'); 
        
        if (empty($uid))
        {
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:uid'
            ]);
        }
        if (empty($token))
        {
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:token'
            ]);
        }
        
        //先解除er_wx_department_bind_user那个表中的绑定
        $corp_bind = Db::table('user_bind_info')->where(['wx_uid' => $uid])->find();
        if (!empty($corp_bind))
        {
            Db::table('user_bind_info')->where(['wx_uid' => $uid])->update([
                    'isbind' => 0,
                    'unbind_date' => date('Y-m-d H:i:s'),
                ]);
            
            return json([
                'errcode'        => 0,
                'is_registered'  =>0
            ]);
            //以上是仅仅重新更新，防止er_user_student_weixin表中的字段数据不一致导致的返回值异常的问题
        }else{
            return json([
                'errcode'        => 0,
                'is_registered'  => 0
            ]);
        }
    }
  
  	private function makeToken()
    {
        $str = md5(uniqid(md5(microtime(true)), true)); //生成一个不会重复的字符串
        $str = sha1($str); //加密
        return $str;
    }
}
