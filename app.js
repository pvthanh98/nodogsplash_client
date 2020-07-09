var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var express = require('express');
var fs = require ("fs");
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);

var client = require("socket.io-client");
var socket = client.connect("http://localhost:5000");

socket.on("server_send_ad", data=> {
    // fs.writeFile("./path_advertising.txt", data, function(err){
    //     if(!err) console.log("file copy successfuly")
    // });
    const file = fs.createWriteStream("./public/images/ad/"+data);
    const request = http.get("http://localhost:5000/download/"+data, function(response) {
        response.pipe(file);
    });

    var head_splash = fs.readFileSync("./file/splash_head.html",{encoding:"UTF-8"});
    var advertising_img = '<img src="./public/images/ad/'+ data+'">';
    var footer_splash =  fs.readFileSync("./file/splash_footer.html",{encoding:"UTF-8"});
    var ad = head_splash + advertising_img + footer_splash;

    fs.writeFile("./new_splash.html", ad, function(err){
        if(!err) console.log("new splash generated")
    });

});

app.get('/',function(req, res){
    var path_ad = fs.readFileSync("./path_advertising.txt", {encoding:"UTF-8"})
    res.render("splash",{path_ad})
});

server.listen(3000,()=>console.log("client on port 3000"));
