var fs = require('fs');

module.exports = function(p){
    this.then(function(){
        this.echo(p.fn);
        fs.write(p.fn,p.c,'a+') ;
        p.cb();
        /*fs.writeFile(fn, c,  function(err) {
           if (err) {
               return console.error(err);
           }
           console.log("数据写入成功！");
           cb();
        });*/
    }
}