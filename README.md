# 疫情防控每日上报-小程序版本
## 项目详细介绍
[2020NCOV-小程序端](https://github.com/2020NCOV/ncov-report-mini-program)与[2020NCOV-小程序服务端程序](https://github.com/2020NCOV/ncov-report-mini-program-server)所配套部署，形成一个基于微信小程序来进行疫情上报和人员健康管理的平台，旨在帮助各高校及企事业单位，在自己的服务器上本地部署一套人员健康管理系统，以满足机构的数据安全策略。

该项目使用微信开发者工具进行开发和调试，详细开发文档参见[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)，也可以参考我们所提供的[从零开始完成一个简单小程序]()的教程。
## 快速部署
### 1.部署后端服务程序
目前可选[PHP](https://github.com/2020NCOV/ncov-report-mini-program-server)，[java](https://github.com/2020NCOV/MiniProgram-server-JAVA)和[Golang](https://github.com/2020NCOV/MiniProgram-server-Golang)三个版本，详细部署方式见相应项目链接。
### 2.导入微信开发者工具
直接使用微信开发工具导入项目同名目录，注意使用自己的Appid。
### 3.配置域名
utils/config.js
```
...
const baseURL = 'your Domain name/index';
...
```
* 注：若您使用http协议，则需要在**微信开发者工具**中勾选：**详情**-**本地设置**-**不校验合法域名...**
### 4.使用
在「我的」中绑定个人账号，在「每日上报」中点击「今日上报」即可。
## License
[Apache 2.0 License.](https://opensource.org/licenses/Apache-2.0)
