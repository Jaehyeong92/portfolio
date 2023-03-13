
var mysql = require("mysql");
var conn_info = {
    host : "localhost",
    port : 3306,
    user : "root",
    password : "root",
    database : "_node_db_jh",
    multiplestatements : true
};



module.exports = function(app){

    app.get("/csList", function(req, res){ 
        var log = req.session.log;

        if(log == null) {
            res.redirect("userLogin");
        } else {
       
            var name = req.session.name;

            var curPageNum = req.query.curPageNum;
            if(curPageNum == null) {
                curPageNum = 1;
            }

            var boardListCount = 0;

            var conn = mysql.createConnection(conn_info);
            var sql1 = "SELECT COUNT(*) FROM cs";
            conn.query(sql1, function(error, rows) {
                var json = JSON.stringify(rows);
                var data = JSON.parse(json);
                boardListCount = data[0]["COUNT(*)"];

                var onePageBoardCount = 5;                  
                var boardPageCount = parseInt(boardListCount / onePageBoardCount);    
                if(boardListCount % onePageBoardCount > 0) {
                    boardPageCount += 1;   
                }
                var curPageBeginBoardNum = (curPageNum - 1) * onePageBoardCount;  

                var onepagepaingNumber = 2;         
                var curPageBeginPagingNumber = 1;  
                if(curPageNum % onepagepaingNumber > 0) {
                    curPageBeginPagingNumber = parseInt(curPageNum / onepagepaingNumber) * onepagepaingNumber + 1;
                } else {
                    curPageBeginPagingNumber = (parseInt(curPageNum / onepagepaingNumber) - 1) * onepagepaingNumber + 1;
                }
        
                var curPageEndPagingNumber = curPageBeginPagingNumber + onepagepaingNumber - 1;       
                if(curPageEndPagingNumber > boardPageCount) {
                    curPageEndPagingNumber = boardPageCount;
                }

                var sql2 = "SELECT * FROM cs ORDER BY cs_num DESC LIMIT ?, ?";
                var inputData = [curPageBeginBoardNum, onePageBoardCount];
                conn.query(sql2, inputData, function(error, rows) {

                    var count = 0;
                    if(rows != null) {
                        count = rows.length;
                    }

                    var renderData = {	
                        "log" : log,
                        "name" : name,
                        "count" : count,
                        "csList" : rows,
                        "curPageNum" : curPageNum,
                        "boardPageCount" : boardPageCount,
                        "onepagepaingNumber" : onepagepaingNumber,
                        "curPageBeginPagingNumber" : curPageBeginPagingNumber,
                        "curPageEndPagingNumber" : curPageEndPagingNumber
                    };

                    conn.end();
                    res.render("tea/OS/cs/csList.ejs", renderData); 
                });
                
            });
        }
    });


app.get("/csInfo", function(req, res){
    var log = req.session.log;
    var name = req.session.name;
    var cs_num = req.query.cs_num;

    var conn = mysql.createConnection(conn_info);
    var sql1 = "UPDATE cs SET csReadCount = csReadCount + 1 WHERE cs_num = ?";
    var inputData = [cs_num];
    conn.query(sql1, inputData, function(error) {
        var sql2 = "SELECT * FROM cs WHERE cs_num = ?";
        inputData = [cs_num];

        conn.query(sql2, inputData, function(error, rows) {

            var check = false;
            if(rows[0]["cs_userId"] == log) {
                check = true;
            }
    
            var renderData = {	
                "log" : log,
                "name" : name,
                "cs" : rows[0],
                "check" : check
            };

            conn.end();
            res.render("tea/OS/cs/csInfo.ejs",   renderData); 

        });

    });
 });

app.get("/csModify", function(req, res){
    var log = req.session.log;
    var name = req.session.name;
    var cs_num = req.query.cs_num;

    var conn = mysql.createConnection(conn_info);
    var sql = "SELECT * FROM cs WHERE cs_num = ?";
    var inputData = [cs_num];

    conn.query(sql, inputData, function(error, rows) {
        var renderData = {	
            "log" : log,
            "name" : name,
            "cs" : rows[0]
        };

        conn.end();
        res.render("tea/OS/cs/csModify.ejs", renderData); 
    });
 });

app.get("/csModifyPro", function(req, res){

    var cs_num = req.query.cs_num;

    var cs_title = req.query.cs_title;
    var cs_content = req.query.cs_content;

    var conn = mysql.createConnection(conn_info);
    var sql = "UPDATE cs SET cs_title = ?, cs_content = ? WHERE cs_num = ?";
    var inputData = [cs_title, cs_content, cs_num];
    conn.query(sql, inputData, function(error) {
        conn.end();
        res.redirect("csList");
    });
}); 

app.get("/csDelete", function(req, res){
    var cs_num = req.query.cs_num;

    var conn = mysql.createConnection(conn_info);
    var sql = "DELETE FROM cs WHERE cs_num = ?";
    var inputData = [cs_num];
    conn.query(sql, inputData, function(error) {
        conn.end();
        res.redirect("csList");
    });
});

app.get("/csWrite", function(req, res){
    var log = req.session.log;
    var name = req.session.name;

    var conn = mysql.createConnection(conn_info);
    var sql = "SELECT MAX(cs_num) FROM cs";
    conn.query(sql, function(error, rows) {
        var json = JSON.stringify(rows);
        var data = JSON.parse(json);
        var cs_num = data[0]["MAX(cs_num)"] + 1;
        
        var renderData = {	
            "log" : log,
            "name" : name,
            "cs_num" : cs_num
        };

        conn.end();
        res.render("tea/OS/cs/csWrite.ejs", renderData); 
    });
});    

app.get("/csWritePro", function(req, res){
    var log = req.session.log;

    var cs_num = req.query.cs_num;
    var cs_userId = log;
    var cs_title = req.query.cs_title;
    var cs_content = req.query.cs_content;

    var conn = mysql.createConnection(conn_info);
    var sql = "INSERT INTO cs VALUES(?, ?, ?, ?, ?)";
    var inputData = [cs_num, cs_userId, cs_title, cs_content, 0];
    conn.query(sql, inputData, function(error) {
        conn.end();
        res.redirect("csList");
    });
});  

}