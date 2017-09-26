![](http://oetuly2ki.bkt.clouddn.com/QQ%E6%88%AA%E5%9B%BE20170926112749.png)
## 功能点：
- 所有变量存储在localstroage里
- 初始化，加载localstroage数据，没有则为空
- 可以添加，从页面里环境变量中选取或者手动添加
- 可以删除，任意一条或者多条localstorage中的值
- 可以修改localstorage中的值
- 填充页面，单选或者多选，有该key则修改，没有则添加
- 清空所有localstorage中值


## 技术知识点：
- ES6
- webpack
- babel
- less
- vue組件通信
- chrome插件--扩展和content_script通信（长链接和短链接）
- chrome插件--content_script对tab内页面dom的操作
- chrome插件--本地存储使用方法

## 使用方法

下载`/src`目录下的`dist.crx`，拖动到浏览器扩展页即可安装该插件。

打开appFactory或者apiManage，进入到应用：
- 点击环境->具体的环境->环境变量
- 浏览器右上角打开刚才安装的扩展程序
- 点击抓取环境变量按钮，即可获取到当前应用中的环境变量，也可手动添加
- 选择相应的环境变量，点击保存即可保存到浏览器内
- 进入到另一个应用
- 点击环境->具体的环境->环境变量
- 浏览器右上角打开安装的扩展程序
- 点击获取localStorage按钮，即可获取到浏览器内存储的环境变量
- 选择相应的环境变量，点击写入页面，提示成功
- 关闭扩展程序页面，应用中的环境变量也会对应的修改或者增加


## 特别感谢

[lavyun](https://github.com/lavyun/Easy-todo)

