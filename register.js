var mysql = require('mysql');
var fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var session= require('express-session');
var fileStore= require('session-file-store')(session);
const serverCa = [fs.readFileSync("/var/task/DigiCertGlobalRootCA.crt.pem", "utf8")];

app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use(express.static('static')); 
app.use(session({
    secret: 'kang',
    resave: false,
    saveUninitialized: true,
    store: new fileStore()
}));


var main_board = "SELECT * FROM member, board WHERE member.id = board.member_id ORDER BY board.board_id;";
var board_write = "";

const config = {
    host    : "prod-kb97-mysql.mysql.database.azure.com",
    user    : "admin1",
    password: "It12345!",
    port    : 3306,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
}
var connection = mysql.createConnection(config);

connection.connect(function(err) {
        if (err) {
                console.error("Database connection failed : " + err.stack);
                return;
        }

        console.log('Connected to database.');
});

connection.changeUser({
    database : 'project'
}, (err) => {
    if (err) {
      console.log('Error in changing database', err);
      return;
    }
    // Do another query
});
    // register controller
app.post('/register.js',function(req,res){
        // post로 회원가입 정보를 받아온다
    var data = req.body;
        // 아이디 중복 검사
        // DB에 쿼리문을 날려 err,rows,fields값을 받아오는 콜백함수를 사용한다.
    connection.query('SELECT * from member where id="'+data.id+'";',function(err,rows,fields){
        if(err) {
            // 쿼리 에러
            console.log('Error: '+err);
            throw err;
        }
        if (rows.length<=0){
            // 중복되는 아이디가 없다. 회원가입 성공. DB에 레코드를 추가한다.
            var params= [null,data.email,data.full_name,data.password,data.phone_number,data.department_name];
            console.log(" datas : " + data.email +"  , "+data.department_name);
            connection.query('insert into member values(?,?,?,?,?,?)',params,function(err,results){
                if(err){
                    //쿼리 에러
                    console.log('Error insert query : '+err);
                    throw err;
                }
                else{
                     // insert 쿼리 성공: 성공 창을 띄우고 이전 로그인 페이지로 돌아간다
                     res.send("<script>alert('success'); location.href='/login.html';</script> ");
                }
            });
        }else{
            // 아이디가 중복된다
            // 회원가입 실패. 에러를 띄우고 회원가입 페이지를 초기화 시킨다.
                // + 비밀번호 유효성
                // + 이메일 유효성
                // + 전화번호 유효성 검사
                res.send("<script>alert('중복된 아이디입니다.'); location.href='/register.html';</script> ");
        }
    })
});

app.get('/health.html',function(req,res,err){
	res.sendStatus(200);
});

var server = app.listen(port, function () {
    console.log("Express server has started on port : " + port);
});