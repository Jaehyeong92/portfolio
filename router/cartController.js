var mysql = require("mysql");
var conn_info = {
    host : "dbwogud92.cafe24app.com",
    port : 3306,
    user : "dbwogud92",
    password : "Yu12db34",
    database : "dbwogud92",
    multipleStatements: true

};


module.exports = function(app){
    
    // 장바구니 등록 페이지
    app.get("/addCart", function(req, res){ 
        console.log("addCart");
        var log = req.session.log;

        if(log == null) {
            res.redirect("userLogin");
        } else {

            var conn = mysql.createConnection(conn_info);
            var sql1 = " SELECT MAX(cart_num) FROM cart ";
            conn.query(sql1, function(error, rows) {
                console.log("1error" , error);
                var json = JSON.stringify(rows);
                var data = JSON.parse(json);
                var cart_num = data[0]["MAX(cart_num)"] + 1;


                var cart_userId = log;
                var cart_itemName = req.query.item_name;
                var cart_BuyCount = Number(req.query.buyCount);
                var cart_itemImage = req.query.item_image;
                var cart_buyitemPrice = Number(req.query.buyPrice);
                var cart_discount = Number(req.query.item_discount);

                console.log(cart_num ,cart_userId , cart_itemName ,cart_BuyCount , cart_itemImage ,  cart_buyitemPrice ,  cart_discount);

                var sql2 = " INSERT INTO cart VALUES(?, ?, ?, ?, ?, ?, ?) ";

                var inputData = [cart_num, cart_userId, cart_itemName, cart_BuyCount, cart_itemImage, cart_buyitemPrice, cart_discount];

                conn.query(sql2, inputData, function(error) {
                    console.log("2error" , error);
                    conn.end();
                    res.redirect("cartInfo");
                });

             });
         }
    });

    // 장바구니 확인 페이지
    app.get("/cartInfo", function(req, res){
        var log = req.session.log;
        var name = req.session.name;


        if(log == null) {
            res.redirect("userLogin");
        } else {
            var conn = mysql.createConnection(conn_info);
            var sql1 = "SELECT SUM(cart_BuyCount * cart_buyitemPrice) FROM cart WHERE cart_userId = ?";
            var inputData = [log];
            conn.query(sql1, inputData, function(error, rows) {
                console.log('1',error)
                var json = JSON.stringify(rows);
                var data = JSON.parse(json);
                var total = data[0]["SUM(cart_BuyCount * cart_buyitemPrice)"];

                sql2 = "SELECT * FROM cart WHERE cart_userId = ? ORDER BY cart_num ASC";
                
                inputData = [log];
                conn.query(sql2, inputData, function(error, rows) {
                    console.log('2',error)
                    var renderData = {	
                        "log" : log,
                        "name" : name,
                        "total" : total,
                        "cartList" : rows,
                    };
                    
                    conn.end();
                    res.render("tea/OS/cart/cartInfo.ejs", renderData); 
                });
            });
            
         }
    });

    // 장바구니 삭제
    app.get("/deleteCart", function(req, res){
       
        var cart_num = req.query.cart_num;
        
        var conn = mysql.createConnection(conn_info);
        var sql = "DELETE FROM cart WHERE cart_num = ?";
        var inputData = [cart_num];
        conn.query(sql, inputData, function(error) {
            conn.end();
            res.redirect("cartInfo");
        });
    });

    app.get("/delselect", function(req, res){
       
        var cart_num = req.query.itemCheck;
        var conn = mysql.createConnection(conn_info);
        var sqls = '';
        var sql = " DELETE FROM cart WHERE cart_num = ?;";
        // var inputData = [cart_num];

        for (const no of cart_num) {
            sqls += mysql.format(sql, no);
        }
        console.log(sqls);
        conn.query(sqls, function(error) {
            conn.end();
            res.redirect("cartInfo");
        });

    })

}