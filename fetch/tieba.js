var _ = require("underscore");  
  
  
// 贴吧的捕获分为2步  
// 第一步浏览列表页,获取各个详情页的"标题"和"链接"  
module.exports = function(opts){  
    // list 储存各个详情页的"标题"和"链接"  
    // fetchList 储存捕获来的信息  
    var list,fetchList,nextP;  
    // 遍历列表  
    this.thenOpen(opts.url,function(){  
        var res = this.evaluate(function(){  
            // 沙箱里面不能用_,只能用for,因为_不能传入沙箱  
            var aString = "a.j_th_tit";  
            var rst = [];  
            var nodeList =  document.querySelectorAll(aString);  
            var nxtString = ".pagination-item.next";
            var nxt =  document.querySelector(nxtString).getAttribute("href"); 

            for (var i = 0; i < nodeList.length; i++) {  
                var node = nodeList[i];  
                var title = node.innerHTML;  
                var url = node.getAttribute("href");  
                if(url.indexOf("http://")==-1){  
                    url = location.origin+url;  
                }  
                rst.push({title:title,url:url});  
            };  
            return {rst:rst,nxt:nxt};  
        });  
        list = res.rst;
        nextP = res.nxt;
    });  
  
  
    this.then(function(){  
        this.echo("list length:"+list.length);  
        this.echo("list -> ");  
        this.echo("next -> "+nextP); 
    });  
  
  
    this.then(function(){  
        fetchList = [];  
        var index = 0;  
        // 遍历列表中各个链接,去捕获消息  
        _.each(list,function(li){  

            this.thenOpen(li.url,function(li){  
                this.echo('--------------'+li.url+'-------------')
                var rst = this.evaluate(function(opts){  
                    var domain = location.origin;  
                    // 发帖人  
                    var userNameNode = document.querySelector(".p_postlist .l_post .d_author .p_author_name");  
                    var userName = userNameNode ? userNameNode.innerHTML : "err userName";  
  
  
                    // 发帖时间  
                    var postTimeNode = document.querySelector(".p_postlist .l_post .d_post_content_firstfloor .core_reply .post-tail-wrap>.tail-info:last-child");  
                    var postTime =postTimeNode ? postTimeNode.innerHTML : "err postTime";  
                      
                    // 图片  
                    var imgs = document.querySelectorAll(".p_postlist .d_post_content_firstfloor .p_content .BDE_Image");                 
                    var imgUrls = [];  
                    for (var i = 0; i < imgs.length; i++) {  
                        var imgSrc = imgs[i].getAttribute("src");  
                        if(imgSrc.indexOf("http://") == -1){  
                            imgSrc = domain+imgSrc;  
                        }  
                        imgUrls.push(imgSrc);  
                    };  
                    return {  
                        url:opts.url,  
                        title:opts.title,  
                        userName:userName ,  
                        postTime:postTime,  
                        imgUrls:imgUrls  
                    };  
                // 简单原始的对象li可以被注入   
                },li);  
                  
                // 把imgurl转成img的base64                
                /*this.then(function(){  
                    var imgCodes = [];  
                    _.each(rst.imgUrls,function(imgUrl){  
                        this.thenOpen(imgUrl,function(imgUrl){  
                            var imgCode = this.base64encode(imgUrl);  
                            imgCodes.push(imgCode);  
                        }.bind(this,imgUrl));  
                    }.bind(this));  
                    this.then(function(){  
                        rst.imgCodes = imgCodes;  
                    });  
                });  */
  
  
                this.echo(index+": "+this.getCurrentUrl());  
                index++;  
                fetchList.push(rst);  
            }.bind(this,li));  
        }.bind(this));  
    });  
  
  
    this.then(function(){  
        // save to file  
        var category = opts.category;  
        this.emit("saveData",{category:category,fetchList:fetchList, nextPage:nextP});  
    });  
};  

