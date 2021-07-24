var http = require('http');
var fs = require('fs');
var url = require('url');//url 이라는 모듈을 사용할 것이다
var qs = require('querystring');

var templeteHTML = function(title,list,body){
  return  `
        <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
    </body>
    </html>` ;
}
var listHTML = function(filelist) {
  var list = '<ul>';
      
      var i = 0;
      while (i < filelist.length) {
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i+1;
      }
      list = list + '</ul>';
      return list;
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathName = url.parse(_url, true).pathname;
   

    if(pathName === '/'){
      if(queryData.id === undefined){

        fs.readdir(`./data`, function(error, filelist) {
          var title ='welcome';
          var description = 'hello node js';
          var list = listHTML(filelist);
          var template = templeteHTML(title,list,`<h2>${title}</h2>${description}`);

                response.writeHead(200);
                response.end(template);
        })
          
        
      } else {
        
      
          fs.readdir(`./data`, function(error, filelist) {

            fs.readFile(`data/${title}`, 'utf8', function(err, description){
          
            var list = listHTML(filelist);
            var template = templeteHTML(title,list,`<h2>${title}</h2>${description}`);
               
                response.writeHead(200);
                response.end(template);

          })
        })
      }
      
    } else if(pathName === '/create') {
      fs.readdir(`./data`, function(error, filelist) {
        var title ='opinion';
        var list = listHTML(filelist);
        var template = templeteHTML(title,list,`<form action="http://localhost:3000/create_process" method="POST">
        <p>
            <input type = 'text' name="title" placeholder="title">
        </p>
        <p> 
            <textarea name="description" placeholder="write here" id="" cols="30" rows="10"></textarea>
        </p>
       <input type="submit">
    </form>`);

              response.writeHead(200);
              response.end(template);
      })

    } else if(pathName === '/create_process'){
      var body = '';
      request.on('data', function(data) {
        body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        // Location: `/?id=${encodeURI(title)}
        fs.writeFile(`data/${title}`,description,'utf8',function(err) {
              response.writeHead(302,{Location: `/?id=${encodeURI(title, description)}`});
              response.end();
        })
       
      });
              

    } else {
          response.writeHead(404);
          response.end('not found');
    } 
});
app.listen(3000); // 3000번 포트의 우리 웹서버의 node. js 를 실행시킨 것    
// 정리를 하면 cmd창에서 서버가 돌아가고 있는데(node.js로 짠 main.js가) 
// 클라이언트가 브라우저 상에서 주소:포트번호/?객체이름=값 을 주면, main.js 즉, 서버가 이 입력값을 받아서 거기에 해당하는 값을 출력하는 거군요. 
// end() 안에 객체 아이디에 해당하는 value값을 출력하는거로 말이죠.