
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

    app.get("/boardList", function(req, res){ 
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
            var sql1 = "SELECT COUNT(*) FROM board";
            conn.query(sql1, function(error, rows) {
                var json = JSON.stringify(rows);
                var data = JSON.parse(json);
                boardListCount = data[0]["COUNT(*)"];

                var onePageBoardCount = 10;                  
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

                var sql2 = "SELECT * FROM board ORDER BY board_num DESC LIMIT ?, ?";
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
                        "boardList" : rows,
                        "curPageNum" : curPageNum,
                        "boardPageCount" : boardPageCount,
                        "onepagepaingNumber" : onepagepaingNumber,
                        "curPageBeginPagingNumber" : curPageBeginPagingNumber,
                        "curPageEndPagingNumber" : curPageEndPagingNumber
                    };

                    conn.end();
                    res.render("tea/OS/board/boardList.ejs", renderData); 
                });
                
            });
        }
    });


app.get("/boardInfo", function(req, res){
    var log = req.session.log;
    var name = req.session.name;
    var board_num = req.query.board_num;

    var conn = mysql.createConnection(conn_info);
    var sql1 = "UPDATE board SET boardReadCount = boardReadCount + 1 WHERE board_num = ?";
    var inputData = [board_num];
    conn.query(sql1, inputData, function(error) {
        var sql2 = "SELECT * FROM board WHERE board_num = ?";
        inputData = [board_num];

        conn.query(sql2, inputData, function(error, rows) {

            var check = false;
            if(rows[0]["board_userId"] == log) {
                check = true;
            }
    
            var renderData = {	
                "log" : log,
                "name" : name,
                "board" : rows[0],
                "check" : check
            };

            conn.end();
            res.render("tea/OS/board/boardInfo.ejs",   renderData); 

        });

    });
 });

app.get("/boardModify", function(req, res){
    var log = req.session.log;
    var name = req.session.name;
    var board_num = req.query.board_num;

    var conn = mysql.createConnection(conn_info);
    var sql = "SELECT * FROM board WHERE board_num = ?";
    var inputData = [board_num];

    conn.query(sql, inputData, function(error, rows) {
        var renderData = {	
            "log" : log,
            "name" : name,
            "board" : rows[0]
        };

        conn.end();
        res.render("tea/OS/board/boardModify.ejs", renderData); 
    });
 });

app.get("/boardModifyPro", function(req, res){

    var board_num = req.query.board_num;

    var board_title = req.query.board_title;
    var board_content = req.query.board_content;

    var conn = mysql.createConnection(conn_info);
    var sql = "UPDATE board SET board_title = ?, board_content = ? WHERE board_num = ?";
    var inputData = [board_title, board_content, board_num];
    conn.query(sql, inputData, function(error) {
        conn.end();
        res.redirect("boardList");
    });
}); 

app.get("/boardDelete", function(req, res){
    var board_num = req.query.board_num;

    var conn = mysql.createConnection(conn_info);
    var sql = "DELETE FROM board WHERE board_num = ?";
    var inputData = [board_num];
    conn.query(sql, inputData, function(error) {
        conn.end();
        res.redirect("boardList");
    });
});

app.get("/boardWrite", function(req, res){
    var log = req.session.log;
    var name = req.session.name;

    var conn = mysql.createConnection(conn_info);
    var sql = "SELECT MAX(board_num) FROM board";
    conn.query(sql, function(error, rows) {
        var json = JSON.stringify(rows);
        var data = JSON.parse(json);
        var board_num = data[0]["MAX(board_num)"] + 1;
        
        var renderData = {	
            "log" : log,
            "name" : name,
            "board_num" : board_num
        };

        conn.end();
        res.render("tea/OS/board/boardWrite.ejs", renderData); 
    });
});    

app.get("/boardWritePro", function(req, res){
    var log = req.session.log;

    var board_num = req.query.board_num;
    var board_userId = log;
    var board_title = req.query.board_title;
    var board_content = req.query.board_content;

    var conn = mysql.createConnection(conn_info);
    var sql = "INSERT INTO board VALUES(?, ?, ?, ?, ?)";
    var inputData = [board_num, board_userId, board_title, board_content, 0];
    conn.query(sql, inputData, function(error) {
        conn.end();
        res.redirect("boardList");
    });
});  

}