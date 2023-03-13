
module.exports = function(app){


app.get("/pay", function(req, res){ 
    
    var log = req.session.log;
    var cart_num = req.query.cart_num;
    
    var renderData = {	
        "log" : log,
        "cart_num" : cart_num
    };


        res.render("tea/OS/pay/pay.ejs", renderData); 
    });    
}