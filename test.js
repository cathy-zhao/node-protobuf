var messages = require('./protobuf_pb');
var http = require('http');

var codeList_req = new messages.codeList_req();
var CodeListRep = messages.codeList_rep;

codeList_req.setVersion(20170326);
var message1 = codeList_req.serializeBinary();
var postData = Buffer.from(message1.buffer);

var options = {
    host: 'hqabc.stockapp.net',
    port: 8000,
    path: '/api/quote/codeList',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

var req = http.request(options, (res) => {
    var array = [];
    var totalLength = 0;
    res.on('data', (chunk) => {
        array.push(chunk);
        totalLength += chunk.length;
    });

    res.on('end', () => {
        resultChunk = Buffer.concat(array, totalLength);
        var result = CodeListRep.deserializeBinary(new Uint8Array(resultChunk));
        var AddArrList = result.getAddArrList();
        var resultArray = [];
        var addArr = AddArrList.map((item) => {
            var item = {
                "marketId": item.getMarketId(),
                "code_type": item.getCodeType(),
                "code": item.getCode(),
                "name": item.getName(),
                "Pinyin": item.getPinyin(),
                "Pszmark": item.getPszmark()};
            resultArray.push(item);
        });
        console.log("resultArray", resultArray);
    });
});

req.write(postData);
req.end();
