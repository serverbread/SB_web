这是一个关于SB_web的API使用帮助的文档。

如果你要使用本站APi，那么下面是api使用说明：
/api开头的路径是用于api的。
/api/passages是用于查询文章信息的，接受两个参数，get与data。
/api/passages?get=的值可以为list或latest
其中参数为list时将尝试获取所有的文章，参数为latest时将尝试获取最新创建的文章，他们都被存放在passages/文件夹
/api/passages?data的值为/api/passages?get=list中files键对应列表里面的任意一个文件名，比如/api/passages?data=0001.md
先写到这吧