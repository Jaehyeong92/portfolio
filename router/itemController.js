var mysql = require("mysql");
var conn_info = {
    host : "localhost",
    port : 3306,
    user : "root",
    password : "root",
    database : "_node_db_jh",
    multipleStatements: true

};

// var bodyParser = require("body-parser");
// var urlencodedParser = bodyParser.urlencoded({extended : false});

module.exports = function(app){

    // main페이지
    app.get("/mainitem", function(req, res){ 
        
        var log = req.session.log;
        var name = req.session.name;

        //res.render("item/itemAllList.ejs");
    //}); 

    //app.post("/getBookListAll", urlencodedParser, function(req, res){

        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM item ORDER BY item_sell DESC LIMIT 0, 4";
        conn.query(sql, function(error, rows) {

            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemMain.ejs", renderData); 
    });

});
    
    // 상품 상세 페이지
    app.get("/itemInfo", function(req, res){ 
        var log = req.session.log;
        var name = req.session.name;
        var item_num = req.query.item_num;

        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM item WHERE item_num = ?";
        var inputData = [item_num];
        conn.query(sql, inputData, function(error, rows) {
            
            var renderData = {	
                "log" : log,
                "name" : name,
                "item" : rows[0]
          
            };
            conn.end();
            res.render("tea/OS/item/itemInfo.ejs", renderData); 
        });
    });



    
    // 전체 상품 페이지
    app.get("/itemAllList", function(req, res){ 
        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM item ORDER BY item_num ASC";
        conn.query(sql, function(error, rows) {

            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemAllList.ejs", renderData); 
        });
    });    

    // 베스트 상품 페이지
    app.get("/itemBestList", function(req, res){ 
        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM item ORDER BY item_sell DESC";
        conn.query(sql, function(error, rows) {
            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemBestList.ejs", renderData); 
        });
    });      

    // teabag 카테고리 페이지
    app.get("/itemteabagList", function(req, res){ 
        var log = req.session.log;
        var name = req.session.name;
        
        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM item WHERE item_category = 'teabag' ORDER BY item_num ASC";
        conn.query(sql, function(error, rows) {
       

            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemteabagList.ejs", renderData); 
        });
    });  

    // piramid 카테고리 페이지
    app.get("/itempiramidList", function(req, res){ 
        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM item WHERE item_category = 'piramid' ORDER BY item_num ASC";
        conn.query(sql, function(error, rows) {

            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itempiramidList.ejs", renderData); 
        });
    });  
    

    // 검색 페이지
    app.get("/itemSearch", function(req, res){ 
        var log = req.session.log;
        var search = req.query.search;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT * FROM item WHERE item_name LIKE ?";
        var inputData = ["%" + search + "%"];
        console.log(sql);
        conn.query(sql, inputData, function(error, rows) {

            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows,
                "search" : search
            };
            conn.end();
            res.render("tea/OS/item/itemSearchList.ejs", renderData); 
        }); 
    }); 

     //상품 정렬 - 판매량순
     app.get("/itemsort2", function(req, res){

        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM item ORDER BY item_sell DESC";
        conn.query(sql, function(error, rows) {
            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemAllList.ejs", renderData); 
        });
    });
    
    //상품 정렬 - 이름순
    app.get("/itemsort1", function(req, res){

        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM item ORDER BY item_name ASC";
        conn.query(sql, function(error, rows) {
            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemAllList.ejs", renderData); 
        });
    });  
    

    //상품 정렬 - 신상품순
    app.get("/itemsort3", function(req, res){

        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM item ORDER BY item_date DESC";
        conn.query(sql, function(error, rows) {
            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemAllList.ejs", renderData); 
        });
    });    
    
    
    //상품 정렬 - 높은가격순
    app.get("/itemsort4", function(req, res){

        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM item ORDER BY item_price DESC";
        conn.query(sql, function(error, rows) {
            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemAllList.ejs", renderData); 
        });
    });      

    //상품 정렬 - 낮은가격순
    app.get("/itemsort5", function(req, res){

        var log = req.session.log;
        var name = req.session.name;

        var conn = mysql.createConnection(conn_info);
        var sql = " SELECT * FROM item ORDER BY item_price ASC";
        conn.query(sql, function(error, rows) {
            var renderData = {	
                "log" : log,
                "name" : name,
                "itemList" : rows
            };
            conn.end();
            res.render("tea/OS/item/itemAllList.ejs", renderData); 
        });
    });      

}
