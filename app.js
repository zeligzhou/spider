// 使用方法：  casperjs app.js --url="http://tieba.baidu.com/f?kw=%E4%B9%92%E4%B9%93%E7%90%83&fr=index&fp=0&ie=utf-8" --category=dino --fetch=tieba
// verbose默认值为false,即不输出来自phantom的信息(请记住,casper是基于phantom的)  
// logLevel表示何种级别输出信息,枚举为debug, info, warning, error  
var casper = require('casper').create({  
    verbose: true,  
    logLevel: 'debug'  
});  
  

// 读取命令行的参数  
var url = casper.cli.get("url"),  
    fetch = casper.cli.get("fetch"),  
    category = casper.cli.get("category");  
  

var opts = {  
    url : casper.cli.get("url"),  
    fetch : casper.cli.get("fetch"),  
    category : casper.cli.get("category")  
};  
  
  
// 用来计算时间  
var startTime, endTime;  
  
  
// start中可以什么都不写  
casper.start();  
  
  
// 这句很重要,如果没有设置userAgent,则很多website会拒绝访问  
var userAgentString = 'Mozilla/5.0 (Macintosh; Intel Mac OS X)';  
casper.userAgent(userAgentString);  
  
  
// 定义"保存数据"事件  
// 数据捕获完毕,则保存到文件中  
casper.on("saveData",function(data){  
    var category = data.category,  
        fetchList = data.fetchList;  
    opts.url = data.nextPage;
    var json = JSON.stringify(fetchList,undefined,2); 
    var fs = require("fs") ;
     //写入文件,使用phantomjs的接口
     
     this.then(function(){
        this.echo("file saving");
        fs.write("./data/"+category+".json",json,'a+') ;
    });

     this.then(function(){
        this.echo(opts.url);
        //casper.wait(5000,runSpider);
    });
     
     /*var params = {
        fn:"./data/"+category+".json",
        c:json,
        cb:function(){
            casper.wait(5000,runSpider);
         }
     }
     require("./save").call(casper,params);
     this.echo("file saving");*/
});  
  
function runSpider(){
    // 记录开始时间  
    casper.then(function(){startTime = + new Date;this.echo('*******************start at : '+startTime)});  
      
      
    // 使用fetch文件夹中相对应的方法去捕获信息  
    casper.then(function(){  
        require("./fetch/"+fetch).call(casper,opts);  
    });  
      
      
    // 记录结束时间  
    casper.then(function(){endTime = + new Date;});  
      
      
    // 打印消耗的时间,单位分钟  
    casper.then(function() {  
        var mins = Math.floor((endTime - startTime) / 60 / 100)/10;  
        this.echo('*******************'+mins+" mins");  
        //this.exit();
    });  
      
      
    casper.run(function() {
      this.echo('~~~~~~~~So the whole suite ended.~~~~~~~~');
      //this.exit(); // <--- don't forget me!
      runSpider();
    });  
}

runSpider();
