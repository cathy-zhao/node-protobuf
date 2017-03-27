#! /bin/bash

echo 1: 读取入参文件里的入参
echo 2: 转换入参
req=`node test.js`
echo $req
echo 3: 发请求
curl -d $req http://127.0.0.1:8000/api/quote/pb_codeList > result.txt
echo 4: 转换并保存响应结果
