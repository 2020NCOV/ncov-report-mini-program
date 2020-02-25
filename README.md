# 疫情防控每日上报-小程序版本
疫情防控每日上报-小程序版本

小程序环境
---
直接使用开发工具导入src_weixin目录中的代码

基于Thinkphp的小程序服务器环境说明
---
* `PHP`版本不低于`PHP5.4`
*  项目运行需支持`PATHINFO`
* `Apache`：已在项目根目录加入`.htaccess`文件，只需开启`rewrite`模块

> 数据库请移步：https://github.com/2020NCOV/ncov-report  

服务器端配置说明
---
applicaiton/config.php文件
```
    //修改以下内容为实际数据
    'wechat_appid'    => '小程序ID',
    'wechat_secret'		=> '秘钥',
```

applicaiton/database.php文件
```
    //修改以下内容为实际数据
    // 数据库类型
    'type'            => 'mysql',
    // 服务器地址
    'hostname'        => '127.0.0.1',
    // 数据库名
    'database'        => '数据库名',
    // 用户名
    'username'        => '用户名',
    // 密码
    'password'        => '密码',
```
