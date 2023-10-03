#!/bin/bash

echo '启动服务器' && cd .. && node appTest.js &


curl localhost:5500/ && echo '测试/'  &&
    curl localhost:5500/api &&  echo '测试/api'  &&
    curl localhost:5500/login &&  echo '测试/login'  &&
    curl localhost:5500/api/login-status &&  echo '测试/login-status'  &&
    curl localhost:5500/api/passage?method=get&detail=list &&  echo '测试文章列表'  &&
    curl localhost:5500/api/passage?method=get&detail=latest &&  echo '测试最新文章'  && echo '测试完毕，等待服务器关闭'
    # curl localhost:5500/api/passage?method=data&detail=0001.md && echo '测试文章0001.md'
