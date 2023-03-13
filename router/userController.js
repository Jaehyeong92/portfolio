
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

     // 회원가입 페이지
     app.get("/userJoin", function(req, res){ 
        
        var log = req.session.log;
       
    
        var renderData = {	
            "log" : log,
        };

        res.render("tea/OS/user/userJoin.ejs", renderData); 
    });

    app.get("/userJoinPro", function(req, res){ 
        var log = req.session.log;

        var user_id = req.query.user_id;
        var user_pw = req.query.user_pw;
        var user_name = req.query.user_name;
        var user_email = req.query.user_email;

        var conn = mysql.createConnection(conn_info);

        var sql1 = "SELECT MAX(user_num) FROM user";

        conn.query(sql1, function(error, rows) {
            var json = JSON.stringify(rows);
            var data = JSON.parse(json);
            var user_num = data[0]["MAX(user_num)"] + 1;
            
            var sql2 = "INSERT INTO user VALUES(?, ?, ?, ?, ?)";

            var inputData = [user_num, user_id, user_pw, user_name, user_email];
            conn.query(sql2, inputData, function(error) {
                conn.end();
                res.redirect("userLogin"); 
            });
            
         });
    });
    
    // 로그인 페이지
    app.get("/userLogin", function(req, res){ 

        var log = req.session.log;
    
        var renderData = {	
            "log" : log,
        };

        res.render("tea/OS/user/userLogin.ejs", renderData); 
    });

    app.get("/userLoginPro", function(req, res){ 

        var log = req.session.log;

        var user_id = req.query.user_id;
        var user_pw = req.query.user_pw;
    
        var conn = mysql.createConnection(conn_info);
        var sql = "SELECT user_name FROM user WHERE user_id = ? AND user_pw = ?";
        var inputData = [user_id, user_pw];
        conn.query(sql, inputData, function(error, rows) {
            
            var location = "";
            if(rows[0] == null) {
                location = "userLogin";
            } else {
                var user_name = rows[0].user_name;
                
                req.session.log = user_id;
                req.session.name = user_name;
                location = "mainitem";
            }
            conn.end();
            res.redirect(location);
        });
    });  
    // 로그아웃
    app.get("/userLogout", function(req, res){ 

        req.session.log = null;
        req.session.name = null;
    
        res.redirect("mainItem"); 
    });    

    // 회원 탈퇴
    app.get("/userDelete", function(req, res){ 

        var log = req.session.log;
        

        var conn = mysql.createConnection(conn_info);

        var sqls = "";
        var sql1 = "DELETE FROM orderItem WHERE order_userId = ?;";
        var inputData = [log];
        sqls += mysql.format(sql1, inputData);

        var sql2 = "DELETE FROM cart WHERE cart_userId = ?;";
        inputData = [log];
        sqls += mysql.format(sql2, inputData);

        var sql3 = "DELETE FROM user WHERE user_id = ?;";
        inputData = [log];
        sqls += mysql.format(sql3, inputData);

        console.log(sqls);

        conn.query(sqls, function(error) {
            req.session.log = null;

            conn.end();
            res.redirect("mainItem"); 
        });
       
    }); 

}