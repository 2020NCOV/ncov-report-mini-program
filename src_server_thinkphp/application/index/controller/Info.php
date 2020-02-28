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

class Info extends Base
{
    public function getmyinfo()
    {
        //echo Request::instance()->post('uid');
        //echo Request::instance()->post('token');
        //echo Request::instance()->post('data');
      
        $uid =input('post.uid');
        $corpid =input('post.corpid');
        $token =input('post.token'); 
        
        //$uid = 1;
     
        if (empty($uid))
        {
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:uid'
            ]);
        }
        if (empty($corpid))
        {
            return json([
                  'errcode'        => 1003,
                  'msg'        => '参数错误:corpid'
            ]);
        }
        if (empty($token))
        {
            return json([
                  'errcode'        => 1003,
                  'msg'        => '参数错误:token'
            ]);
        }
        
        $user = Db::table('user_weixin')->where(['wid' => $uid])->find();

        if(count($user)>0)
        {
            // 获取企业信息
            $corp = Db::table('organization')->where(['corpid' => $corpid ])->find();
            if(!empty($corp))
            {
                return json([
                    'errcode'       => 0,
                    'userid'        => $user['userid'],
                    'name'          => $user['name'],
                    'corpname'      => $corp['corpname'],
                    'phone_num'     => $user['phone_num'],
                    'type_corpname' => $corp['type_corpname'],
                    'type_username' => $corp['type_username']
                ]);
            } else
            {
                return json([
                    'errcode' => 10006,
                    'msg'     =>"获取企业信息失败"
                ]);
            }
        } else
        {
            return json([
                'errcode' => 1005,
                'msg'     => "获取用户信息失败"
            ]);
        }
    }
}
