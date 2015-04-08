# waterfall


* 版本：v1.1
* 注：1 、 为了避免出现错误，该版本引用jquery库请选择1.7版本以上
*     2 、 插件框架用的是ul标签搭建，里面尽可能不要用ul和li标签



## 一 、 整体框架

  &lt;div class="wf"&gt;
    &lt;ul&gt;
      &lt;li&gt;区域一&lt;/li&gt;
      &lt;li&gt;区域二&lt;/li&gt;
      &lt;li&gt;区域三&lt;/li&gt;
      &lt;li&gt;区域四&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/div&gt;


## 二 、 调用方法（根据具体需求选择调用）

  $('.wf').zzc_wf({
    type : 0 ,            
    zhou : 'dddd',
    width : 'auto' ,         
    length : 6 ,              
    spacing : 10,             
    loading : true,                
    loadingText : '加载中…' ,     
    showClass : false ,        
    reposition : true ,          
    after : $.noop  ,             
    ajaxBefore : $.noop ,             
    ajax : {
      type : 'GET' ,                   
      url : '' ,                    
      dataType : '' ,            
      dom : '' ,                     
      domType : 'click'  ,        
      domDistance : 100              
    }
  });



## 三 、 API : 


<em>可选（number），瀑布流的加载方式，0为第一排加载完成并显示之后加显示其他的，1为不设前后，一起加载显示 ，默认为 0</em>

### type : 0  

=================================

<em>可选（number），瀑布流的整体宽度，如果没有设置会向上查找父级的宽度，（建议父级标签设置宽度），默认为获去父级宽度</em>

### width : 1200  

=================================

<em>必选（number），每行显示的个数，默认为 </em>

### length : 6       

=================================

<em>可选（number），每个独立块之间的间距（上下间距是一样的），默认为 10</em>                   

### spacing : 10     

=================================

<em>可选（true/false/class/ID），是否显示加载样式，默认为显示，可以自定义加载样式（注：该标签下有子标签结构&lt;p&gt;&lt;/p&gt;&lt;div&gt;&lt;em&gt;&lt;/em&gt;&lt;strong&gt;加载中…&lt;/strong&gt;&lt;/div&gt;）可自己定义使用 ， 其中：class和ID需带上标示符，如'.wf' , 默认为 true </em>                   

### loading : true     

=================================

<em>可选（string），加载显示的文字 ，默认为 “加载中…”</em>    

### loadingText : '加载中…' 

=================================

<em>可选（true/false/class/ID），是否开启每个独立块显示样式 ，可以自定义css3动画 ，其中：class和ID需带上标示符，如'.wf'，默认为 false</em>           

### showClass : false   

=================================

<em>可选（true/false），是否在图片加载完成后重新排序图片，默认为 true</em>            

### reposition : true            

=================================

<em>可选，图片显示之后（包括重新排序）执行的函数</em>   

### after : $.noop             

=================================

<em>可选，异步加载之前执行的的函数</em> 

### ajaxBefore : $.noop   

=================================

<em>异步加载</em>      

### ajax : {

  <em>可选（GET/POST），类型 默认为'GET'</em>
  
  <strong>type : 'GET'  </strong>
  
  =================================

  <em>必选，加载地址 ，现有两种状态</em>

   1、如下，为指定唯一的加载地址，即一直加载都是这个地址

     url : ''  

   2、如下，可以动态加载分页地址（下面加载的实际地址为   info1.html  ）

     url : {

       必选，加载地址主体部分，即页数前面的部分 

       main : 'info'  

      ================================

       必选，加载地址起始页数 

       page : 1  

      ================================

       必选，加载地址后缀，即页数后面的部分 
       suffix : '.html'  

      ================================

     } 
  
  =================================

  <em>必选，加载的数据格式，如 'json'</em>                

  <strong>dataType : '' </strong> 
  
  =================================

  <em>可选，触发执行异步加载对象，指定一对象点击时异步加载 ，其中：class和ID需带上标示符，如'.wf' ,（如果加载类型为click，那该属性为必选）</em>                

  <strong>dom : '' </strong> 

  =================================
  
  <em>必选，触发执行异步加载类型（click/scroll）选择scroll 不需要指定dom,如果指定dom会同时应用两种加载（点击和滚动都会加载）默认为 click</em>                   
  
  <strong>domType : 'click'  </strong>

  =================================
  
  <em>可选（number），选择scroll 为当整体页面移动到距离文档底部指定高度时触发ajax ，不设置默认为0 则滚动条移动到文档底部时再加载</em>                   
  
  <strong>domDistance : 100  </strong>

  
### }
