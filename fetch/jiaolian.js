var _ = require("underscore");  
  
  
// 叫连论坛的捕获分为2步  
// 第一步浏览列表页,获取各个详情页的"标题"和"链接"  
module.exports = function(opts){  
    // list 储存各个详情页的"标题"和"链接"  
    // fetchList 储存捕获来的信息  
    var list,fetchList;  
    function getTitAndUrl(){
                var aString = ".act_index_cont";  
                var rst = [];
                var nodeList =  document.querySelectorAll(aString);
                for (var i = 0; i < nodeList.length; i++) {  
                    var node = nodeList[i];
                    var domain = location.origin;  
                        // 发帖人  
                        var userNameNode = node.querySelector(".Venue_span");  
                        var userName = userNameNode ? userNameNode.innerHTML : "err userName";  
      
      
                        // 发帖时间  
                        var postTimeNode = node.querySelector(".center_act_time");  
                        var postTime =postTimeNode ? postTimeNode.innerHTML : "err postTime";  
                          
                        // 图片  
                        var imgs = node.querySelector(".ld_headpic");                 
                        var imgUrls = [];  
                        //for (var i = 0; i < imgs.length; i++) {  
                            var imgSrc = imgs.getAttribute("src");  
                            if(imgSrc.indexOf("http://") == -1){  
                                imgSrc = domain+imgSrc;  
                            }  
                            imgUrls.push(imgSrc);  
                        //};
                        rst.push({
                            title:title,  
                            userName:userName ,  
                            postTime:postTime,  
                            imgUrls:imgUrls  
                        });  
                };
               

                        return rst.length==0 ? [{title:'sth wrong'}] : rst;  
        }
    // 遍历列表  
    this.thenOpen(opts.url,function(){ 
        var res = null;
            this.waitFor(function check(){
                return this.evaluate(function(){
                    return document.querySelectorAll(".act_index_cont").length>=1;
                })
            },function then(){res = this.evaluate(getTitAndUrl)},function timeout(){
                this.echo("time out",'ERROR')
            }); 
            list = res;
         
        
        this.echo(res);
    });  
  

  
  
    this.then(function(){  
        this.echo("list length:"+list.length);  
        this.echo("list -> ");  
        
            _.each(list,function(li){
                this.echo(li.title);
           
        })
    });  
  
  
    
  
    this.then(function(){  
        // save to file  
        var category = opts.category;  
        //this.emit("saveData",{category:category,fetchList:list});  
    });  
};  

