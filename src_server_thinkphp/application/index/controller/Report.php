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

class Report extends Base
{

    public function save()
    {
        //echo Request::instance()->post('uid');
        //echo Request::instance()->post('token');
        //echo Request::instance()->post('data');
    
        $uid = input('post.uid');
        $token = input('post.token'); 
        $data = input('post.data');
        $template_code = input('post.template_code');
        $data = json_decode($data,true);
    
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
        if( empty($data['current_district_value']) || strlen($data['current_district_value']) <3 )
        {
            return json([
                'errcode'        => 1003,
                'msg'        => '参数错误:data'
            ]);
        }
    
        $data['wxuid'] = $uid;
        $data['template_code'] = $template_code;
    
        $res = Db::table('report_record')->insert($data);
        if($res !== false){
            return json([
                'errcode'        => 0,
                'msg'        => '数据提交成功'
            ]);
        }
    }

    public function getlastdata()
    {
        //echo Request::instance()->post('uid');
        //echo Request::instance()->post('token');
        //echo Request::instance()->post('data');
        
        $uid =input('post.uid');
        $token =input('post.token'); 
        
        //$uid =3;
        //$token = "ssssssssssssssssssssssssssssss";
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
    
        $res_list = Db::table('report_record')
                ->where('wxuid','=',$uid)
                ->select(); 
        
        $count_num = count($res_list)-1;
        if(count($res_list) >0)
        {
            $data = $res_list[$count_num]; 
            $data['return_district_path'] = $this->get_district_path($data['return_district_value']);
            $data['current_district_path'] = $this->get_district_path($data['current_district_value']);

            return json([
                'errcode'        => 0,
                'isEmpty'        => 0,
                'data'        => $data
            ]);
        } else
        {
            return json([
                'errcode'        => 0,
                'isEmpty'        => 1,
                'data'        => ''
            ]);
        }
    }
  
    public function get_district_path($city_code)
    {
        $pathstr= '';
     	$data = Db::table('com_district')
          ->where('value','=',$city_code)
          ->select();
        if (count($data)>0)
        {
            if ($data[0]['level_id'] == 1)
            {
            	$pathstr = $data[0]['name'];
            } else
            {
            	$pathstr = $data[0]['name'];
                $data = Db::table('com_district')
                        ->where('value','=',$data[0]['parent_id'])
                        ->select();
                if (count($data)>0)
                {
                	$pathstr = $data[0]['name'].",".$pathstr;
                }
            }	
        }
     	return $pathstr;
    }
}
