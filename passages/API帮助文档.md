# 这是一个关于SB_web的API使用帮助的文档。
-------------------------------------
如果你要使用本站API，那么下面是api使用说明：

**/api** 开头的路径是提供api服务的。

**/api/passages** 是用于查询文章信息的，请求时有且仅有两个参数，method与detail。

当 **method** 参数为 **get** 时，**detail** 参数可以为 **latest** 与 **list** ，其为 **latest** 时将尝试获取最新创建的文章；其为 **list** 时将尝试获取文章列表，他们都被存放在 **passages/** 目录

当 **method** 参数为 **data** 时，**detail** 参数可以为的值为 **/api/passages?method=get&detail=list** 中 **files** 键对应数组里面的任意一个文件名，比如 **/api/passages?data=0001.md**
