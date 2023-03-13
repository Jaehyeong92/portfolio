// 서버 세팅 
var express = require("express");
var app = express();
var port = 3702;
var server = app.listen(port, function(){
	console.log("서버가 가동되었습니다" + port);
});

// ejs 세팅(views)
var ejs = require("ejs");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("ejs", ejs.renderFile);
//---------------------------------------------------------------------------------------

// img폴더 경로 셋팅
app.use(express.static('./img'));			
app.use(express.static('./css'))
//---------------------------------------------------------------------------------------

// session 세팅
var session = require("express-session");
app.use(session({							
	secret : "abcdefg",						
	resave : false,							
	saveUninitialized : false
}));
//---------------------------------------------------------------------------------------

// 라우터 폴더 연결
require("./router/itemController")(app);
require("./router/cartController")(app);
require("./router/orderController")(app);
require("./router/userController")(app);
require("./router/payController")(app);
require("./router/boardController")(app);
require("./router/csController")(app);





// 라우터 세팅
app.get("/", function(req, res){ 
    res.redirect("mainitem"); 
});