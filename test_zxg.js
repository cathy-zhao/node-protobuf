var messages = require('./protobuf_pb');
var http = require('http');

var multi_selectedStocks_req = new messages.multi_selectedStocks_req();
var selectedStocks_req = new messages.selectedStocks_req();
var rank_option = new messages.rank_option();

var MultiSelectedStocksRep = messages.multi_selectedStocks_rep;

// 组装入参
rank_option.setWtype(0);
rank_option.setBsort(0);
rank_option.setBdirect(true);
rank_option.setWfrom(0);
rank_option.setWcount(4);
rank_option.setFieldsBitmap(4095);

selectedStocks_req.setPszcodes("000001,399001,399006,834652");
selectedStocks_req.setMarketlist("2,1,1,4");
selectedStocks_req.setOptions(rank_option);

var array = [];
array.push(selectedStocks_req);
multi_selectedStocks_req.setReqsList(array);
var message1 = multi_selectedStocks_req.serializeBinary();
var postData = Buffer.from(message1.buffer);

var options = {
    host: 'hqabc.stockapp.net',
    port: 8000,
    path: '/api/quote/pbSelected',
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
        var result = MultiSelectedStocksRep.deserializeBinary(new Uint8Array(resultChunk));
        var RepsList = result.getRepsList();
        var resultArray = [];
        var addArr = RepsList.map((item) => {
            var tt = {};
            var myItem = item.getRep();
            var options = myItem.getOptions();
            var dataArrList = myItem.getDataarrList();
            var arr = [];
            var stockInfo = {};
            dataArrList.map((i) => {
                stockInfo = {
                            "marketId": i.getMarketid(),
                            "stockCode": i.getStockCode(),
                            "stockName": i.getStockName(),
                            "cjj": i.getNcjje()
                            };
                arr.push(stockInfo);
            });
            tt.options = options.getBsort();
            tt.stockDetailsData = arr;
            resultArray.push(tt);
        });
        console.log("resultArray", resultArray[0].stockDetailsData);
    });
});

req.write(postData);
req.end();
