
// httpモジュールの読み込み
var http = require("http");

// httpsモジュールの読み込み
var https = require("https");

// fsモジュールの読み込み
var fs = require("fs");

// pathモジュールの読み込み
var path = require("path");

// httpサーバを立てる
var server = http.createServer(requestListener);

// サーバ（自分）のIPアドレスを取得
var os = require('os');
var server_address = getLocalAddress().ipv4[0].address;

// ポート番号
var port = 7000;

// httpサーバーを起動する。
server.listen((process.env.PORT || port), function() {
    console.log("-----------------");
    console.log( "http://" + server_address + ":" + (process.env.PORT || port) + " でHTTPサーバーが起動しました。");
    console.log( "このコンピュータからアクセスする場合は localhost:" + (process.env.PORT || port) + " でもOKです。" );
    console.log( "サーバを停止させるときは control + c を入力してください。" );
    console.log("-----------------");
});


// サーバーにリクエストがあった際に実行される関数
function requestListener(request, response) {

	// リクエストがあったファイル
    var requestURL = request.url;

	// リクエストのあったファイルの拡張子を取得
    var extensionName = path.extname(requestURL);

	// ファイルの拡張子に応じてルーティング処理
    switch(extensionName) {
        case ".html":
            readFileHandler(requestURL, "text/html", false, response);
            break;
        case ".css":
            readFileHandler(requestURL, "text/css", false, response);
            break;
        case ".js":
        case ".ts":
            readFileHandler(requestURL, "text/javascript", false, response);
            break;
        case ".png":
            readFileHandler(requestURL, "image/png", true, response);
            break;
        case ".jpg":
            readFileHandler(requestURL, "image/jpeg", true, response);
            break;
        case ".gif":
            readFileHandler(requestURL, "image/gif", true, response);
            break;
        case ".mp3":
            readFileHandler(requestURL, "audio/mpeg", true, response);
            break;
        case ".json":
            readFileHandler(requestURL, "application/json", false, response);
            break;
        default:
            // どこにも該当しない場合は、index.htmlを読み込む
            readFileHandler("/index.html", "text/html", false, response);
            break;
    }
}


// ファイルの読み込み
function readFileHandler(fileName, contentType, isBinary, response) {
    // エンコードの設定
    var encoding = !isBinary ? "utf8" : "binary";
    var filePath = __dirname + fileName;
    fs.exists(filePath, function(exits) {
        if (exits) {
            fs.readFile(filePath, {encoding: encoding}, function (error, data) {
                if (error) {
                    response.statusCode = 500;
                    response.end("Internal Server Error");
                } else {
                    response.statusCode = 200;
                    response.setHeader("Content-Type", contentType);
                    if(!isBinary)
                    {
                        response.end(data);
                    }
                    else
                    {
                        response.end(data, "binary");
                    }
                }
            });
        }
        else {
            // ファイルが存在しない場合は400エラーを返す。
            response.statusCode = 400;
            response.end("400 Error");
        }
    });
}


// ローカル（自分）のIPアドレスを取得する関数
// 参考：http://qiita.com/_shimizu/items/b38d1459abf8436f7f1f
function getLocalAddress() {
    var ifacesObj = {}
    ifacesObj.ipv4 = [];
    ifacesObj.ipv6 = [];
    var interfaces = os.networkInterfaces();

    for (var dev in interfaces) {
        interfaces[dev].forEach(function(details){
            if (!details.internal){
                switch(details.family){
                    case "IPv4":
                        ifacesObj.ipv4.push({name:dev, address:details.address});
                    break;
                    case "IPv6":
                        ifacesObj.ipv6.push({name:dev, address:details.address})
                    break;
                }
            }
        });
    }
    return ifacesObj;
};
