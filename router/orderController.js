
var mysql = require("mysql");
var conn_info = {
	host : "localhost",
	port : 3306,
	user : "root",
	password : "root",
	database : "_node_db_jh",
    multipleStatements: true   
};


module.exports = function(app){

    // 주문서 확인
    app.get("/orderItem", function(req, res){ 
       
       var log = req.session.log;
       
       var conn = mysql.createConnection(conn_info);
      

       var sql1 = "SELECT * FROM cart WHERE cart_userId = ?";
       var inputData = [log];
       conn.query(sql1, inputData, function(error, rows) {

           var orderList = rows;
           
           var sql2 = "SELECT MAX(order_num) FROM orderItem";
           conn.query(sql2, function(error, rows) {
               var json = JSON.stringify(rows);
               var data = JSON.parse(json);
               var order_num = data[0]["MAX(order_num)"] + 1;

               // 다중 쿼리문
               var sqls = "";
               var sql3 = "INSERT INTO orderItem VALUES(?, ?, ?, ?, ?, ?);";
               for(var i=0; i<orderList.length; i++) {
                   inputData = [order_num, orderList[i]["cart_userId"], orderList[i]["cart_itemName"], orderList[i]["cart_BuyCount"], orderList[i]["cart_itemImage"], orderList[i]["cart_buyitemPrice"]];
                   sqls += mysql.format(sql3, inputData);
               }

               var sql4 = "DELETE FROM cart WHERE cart_userId = ?;";
               inputData = [log];
               sqls += mysql.format(sql4, inputData);
               
               console.log(sqls);

               conn.query(sqls, function(error) {
                   conn.end();
                   res.redirect("orderList");
               });
           });
       }); 

        
   });


   // 주문내역
   app.get("/orderList", function(req, res){ 
       var log = req.session.log;
       var name = req.session.name;

       var conn = mysql.createConnection(conn_info);
       var sql = "SELECT * FROM orderItem WHERE order_userId = ?";
       var inputData = [log];
       conn.query(sql, inputData, function(error, rows) {

           var count = 0;
           if(rows != null) {
               count = rows.length;
           }

           var renderData = {	
               "log" : log,
               "name" : name,
               "orderList" : rows,
               "count" : count
           };
   
           conn.end();
           res.render("tea/OS/order/orderList.ejs", renderData); 
       });
   
   });   



}