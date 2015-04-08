/*
*
*create by zhouzuchuan (.com)
*https://github.com/zhouzuchuan/waterfall
*兼容性 ： IE6+/FF/Chrome... 
*版本 ： v1.0 【2015.03.12】
*        v1.1 【2015.04.07】
*              # 改写插件结构、名称及调用方式,新增部分API，具体见托管网站
*              # 优化滚动加载方式和解决不能加载分页的bug
*
*/

;(function ($) {

  if ($.fn.waterfall) return;

  // 给页面装载默认css
  var style = '<style type="text/css">' + 
              '.zzc_wf_loading {position: fixed; _position: absolute; left: 50%; bottom: 200px; }' + 
              '.zzc_wf_loading p {position: absolute; top: 0; left: 0; z-index: 1000; width: 100%; height: 100%; background: #fff url(http://365jia.cn/images/load.gif) no-repeat 10px center; opacity: .8; filter: alpha(opacity=80); border-radius: 10px; }' +
              '.zzc_wf_loading div {position: absolute; top: 0; left: 0; z-index: 1001; text-align: center; }' + 
              '.zzc_wf_loading strong {display: inline-block; color: #555; font-size: 18px; font-weight: normal; font-family: Microsoft YaHei,SimHei; padding: 0 10px; white-space: nowrap; vertical-align: middle; }' + 
              '.zzc_wf_loading em {display: inline-block; width: 32px; height: 32px; padding: 10px 0 10px 10px; vertical-align: middle; }' + 
              '.ajaxAppendBox li {visibility: hidden}' +
              '.loadingTypeBtn {position:absolute;top:-100px;right:0px;width:10px;height:10px;background:green;z-index:-1;}' + 
              '.zzc_wf_in {animation: zzc_wf_fade 1s; -webkit-animation: zzc_wf_fade 1s; }' + 
              '@-webkit-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@-moz-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@-o-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@-ms-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' ;
  $('head').append(style);

  
  $.fn.waterfall = function (options) {

    // 内部存储调用区块
    var configs = {
      ele : $(this) ,
      eul : $(this).find('ul') ,
      eli : $(this).find('ul').children('li') 
    };

    options = $.extend({} , configs , options || {});

    $.waterfall(options , configs);

  }

  $.waterfall = function (options , configs) {
    // 外部储存调用区块
    var external = $.extend({} , pfDefault , options || {});
    // 内部存储调用区块
    var internal = $.extend({} , configs , {
      h : [] ,        /*储存高度*/
      loadingType : 0 ,     /*异步加载执行类型*/
      loadingDom : '.loadingTypeBtn' ,
      otherSpacing : 0 ,  /*每个区块除了本身宽度之外的宽度,如padding*/
      allWidth : '' ,          /*每个区块的整体宽度 包括padding等*/
      selfWidth :  ''  ,       /*每个区块本身的宽度width*/
      showMode : 'zzc_wf_in' ,          /*每个区块显示的方式*/
      loadingClass : 'zzc_wf_loading' , /*加载样式*/
      ajaxPage : '' ,             /*ajax加载分页地址的页数*/
      ajaxMain : '' ,             /*ajax加载分页地址的主体部分*/
      ajaxSuffix : '' ,   /*ajax加载分页地址的后缀*/
      ajaxUrl : '' ,    /*ajax加载地址*/
      delta : '' , 
      flag : true , /*时间控制器*/
      scrollH : 0  /*实时存储滚动的距离*/      
    });

    // 方法
    var fun = {

      // 初始化位置
      _init : function() {
        
        external.width = (typeof external.width === 'string') ? internal.ele.width() : external.width;

        internal.allWidth = Math.floor((external.width - (external.length - 1) * external.spacing) / external.length) ;
        internal.otherSpacing = internal.eli.outerWidth() - internal.eli.width() ;
        internal.selfWidth = internal.allWidth - internal.otherSpacing ;

        var min_h , key , max_h , wan = 0 , jia = 0 , startNum = external.length , endNum = internal.eli.length , a;

        internal.eli.css({visibility : 'hidden'});
        internal.eul.css({position : 'relative'});


        if ((external.type == 1) && is_number(external.type)) {
          a = 0
          startNum = 0 ;
          setH2();
        } else if ((external.type == 0) && is_number(external.type)) {
          a = min_h + external.spacing ;
          setH();
        }

        // 定位第一排区块
        function setH() {
          internal.eli.slice(0,startNum).each(function(index,element) {
            $(element).addClass(internal.showMode).css({
              position : 'absolute' ,
              width : internal.selfWidth ,
              top : 0 ,
              left : index * (internal.allWidth + external.spacing) ,
              visibility : 'visible'
            });

            fun.imgLoad($(element).find('img').get(0) , function (obj) {
              wan ++ ;

              $(obj).width((obj.width > internal.selfWidth) ? internal.selfWidth : obj.width);
              $(obj).height($(obj).height());

              if (!(wan == (external.length > internal.eli.length ? internal.eli.length : external.length))) return false;
              
              for ( var j = 0 ; j < external.length ; j ++ ) {
                internal.h[j] = internal.eli.eq(j).outerHeight(true);
              }

              internal.eul.height(Math.max.apply(null,internal.h));

              if (external.length >= internal.eli.length) {
                setTimeout(function() {
                  fun.reposition();
                },500);
                return false;
              }
              setH2();
            });
          });        
        }


        function setH2() {
          internal.eli.slice(startNum,endNum).each(function(index,element) {
            fun.imgLoad($(element).find('img').get(0),function (obj) {

              $(obj).width((obj.width > internal.selfWidth) ? internal.selfWidth : obj.width);
              $(obj).height($(obj).height());

              min_h = Math.min.apply(null,internal.h);
              key = fun.getArrayKey(internal.h , min_h);
              $(obj).parents('li').addClass(internal.showMode).css({
                position : 'absolute' ,
                width : internal.selfWidth ,
                top : min_h + external.spacing,
                left : key * (internal.allWidth + external.spacing) ,
                visibility : 'visible'
              });  

              max_h = internal.h[key] += $(obj).parents('li').outerHeight(true) + external.spacing;
              internal.eul.height((Math.max.apply(null,internal.h) > max_h) ? Math.max.apply(null,internal.h) : max_h); 
              jia ++;
              if ((wan + jia) === internal.eli.size()) {
                setTimeout(function() {
                  fun.reposition();
                  jia = 0
                },500);
              }
            });  
          });
        }

      } ,
      // 获取数组中的指针
      getArrayKey : function(z , c) {
        for (var i in z) {
          if (z[i] == c) {
            return i;
          }
        }
      } , 
      // 判断图片是否加载
      imgLoad : function (obj ,callback) {
        var timer2 = setInterval(function() {
          if (obj.complete || (obj.width && obj.height && document.all)) {
            callback(obj);
            clearInterval(timer2);
          }
        },30);
      } ,
      // 设置加载样式
      setLoading : function () {
        var oloading = document.createElement('div') , fragment = document.createDocumentFragment() ;

        $(oloading).attr('class',internal.loadingClass).html('<p></p><div><em></em><strong> '+ external.loadingText +' </strong></div>');
        fragment.appendChild(oloading);
        internal.ele.append(fragment);

        var sw = $(oloading).find('strong').outerWidth(true) , sh = $(oloading).find('strong').outerHeight(true) , ew = $(oloading).find('em').outerWidth(true) , eh = $(oloading).find('em').outerHeight(true);
        $(oloading).css({
          'width' : sw + ew ,
          'height' : (sh > eh) ? sh : eh ,
          'margin-left' : - (sw + ew) / 2 
        });
      } ,
      // 重新定位
      reposition : function () {

        var  h = [] , min_h , key , max_h ;

        if (is_true(external.reposition)) {
          for (var i = 0 ; i < external.length ; i ++) {
            h[i] = - external.spacing;
          }
          internal.eul.find('li').each(function(index,element) {
            min_h = Math.min.apply(null,h);
            key = fun.getArrayKey(h , min_h);
            $(element).css({
              position : 'absolute' ,
              width : internal.selfWidth ,
              top : min_h + external.spacing ,
              left : key * (internal.allWidth + external.spacing) 
            }); 
            max_h = h[key] += $(element).outerHeight(true) + external.spacing;
          }); 
          internal.h = h;
          internal.eul.height(Math.max.apply(null,h));
        }

        external.after();

        $('.zzc_wf_loading').stop().animate({
          'opacity' : 0 ,
          'margin-bottom' : -70 
        },1000).queue(function(next){
          $(this).remove();
          next();
        });

        $(external.loading).remove();

      } ,
      // 异步加载定位
      ajaxPosition : function () {

        var min_h , key , max_h , wan = 0;

        if (!internal.flag) return false;
        internal.flag = false;
        external.eul.append('<div class="ajaxAppendBox"></div>');
        var ajaxAppendBox = $('.ajaxAppendBox');
        if (is_object(external.ajax.url)) {
          internal.ajaxUrl = internal.ajaxMain + internal.ajaxPage + internal.ajaxSuffix;
        }

        $.ajax({
          type : external.ajax.type ,
          url : internal.ajaxUrl,
          timeout : 1000,
          dataType : external.ajax.dataType ,
          beforeSend : external.ajaxBefore() ,
          success : function(response , status , xhr) {
            if (is_true(external.loading) || is_string(external.loading)) {
              fun.setLoading();
            }

            ajaxAppendBox.html(response);
            ajaxAppendBox.find('li').each(function(index,element) {
              
              fun.imgLoad($(element).find('img').get(0) , function(obj) {

              $(obj).width((obj.width > internal.selfWidth) ? internal.selfWidth : obj.width);
              $(obj).height($(obj).height());

                min_h = Math.min.apply(null,internal.h);
                key = fun.getArrayKey(internal.h , min_h);
                $(obj).parents('li').addClass(internal.showMode).css({
                  position : 'absolute' ,
                  width : internal.selfWidth ,
                  top : min_h + external.spacing ,
                  left : key * (internal.allWidth + external.spacing) ,
                  visibility : 'visible'
                });  
                max_h = internal.h[key] += $(obj).parents('li').outerHeight(true) + external.spacing;
                internal.eul.height(Math.max.apply(null,internal.h)); 
                wan ++ ;
                if (wan == ajaxAppendBox.find('li').size()) {
                  ajaxAppendBox.find('li').unwrap();
                  fun.reposition();
                  wan = 0
                  internal.ajaxPage += 1 ;
                  setTimeout(function () {
                    internal.flag = true ;
                  } , 300);
                }
              });
              
            });
          } ,
          error : function(xhr) {
            alert(xhr.status + ' : ' + xhr.statusText );
          }
        });
      } 

    };


    // 设置加载
    if (is_true(external.loading) || is_string(external.loading)) {
      if (/^\#|^\./.test(external.loading)) {
        loadingClass = external.loading.slice(1,external.loading.length);
      }
      fun.setLoading();
    }

    // 判断是否显示显示效果
    if (is_false(external.showClass)) {
      internal.showMode = '';
    } else if (is_string(external.showClass)) {
      if (/^\#|^\./.test(external.showClass)) {
        internal.showMode = external.showClass.slice(1,external.showClass.length);
      } else {
        internal.showMode = '';
      }
    }

    // 处理ajax路径
    if (is_object(external.ajax.url)) {
      if (is_number(external.ajax.url.page)) {
        internal.ajaxPage = external.ajax.url.page ;
      }
      internal.ajaxMain = external.ajax.url.main ;
      internal.ajaxSuffix = external.ajax.url.suffix + '?fresh=' + Math.random();
    } else if (is_string(external.ajax.url)) {
      internal.ajaxUrl = external.ajax.url;
    }

    for (var i = 0 ; i < external.length ; i ++) {
      internal.h[i] = - external.spacing;
    }

    // 判断是否使用ajax
    if (!is_undefined(external.ajax.url)) {
      if (external.ajax.domType == 'scroll') {
        internal.loadingType = 'scroll';
        if (!is_undefined(external.ajax.dom)) {
          internal.loadingDom = external.ajax.dom ;
        }
        internal.ele.append('<div class="loadingTypeBtn"></div>');
        external.ajax.domDistance = is_undefined(external.ajax.domDistance) ? 0 : external.ajax.domDistance ;
        $(window).on({
          scroll : function() {
            var st = parseInt($(document).height() - $(window).height() - external.ajax.domDistance) ;
            // alert(options.delta);
            if (($(this).scrollTop() - st >= 0) && ($(this).scrollTop() > internal.scrollH) && options.delta < 0) {
              setTimeout(function() {
                  fun.ajaxPosition();
              },500);
              internal.scrollH = $(this).scrollTop();          
            }
          }
        });
      } else if ((external.ajax.domType == 'click') && !is_undefined(external.ajax.dom)) {
        internal.loadingType = 'click';
        internal.loadingDom = external.ajax.dom ;  
      }
      $(internal.loadingDom).on({
        click : function () {
          fun.ajaxPosition();
        }
      });  
    }

    // 初始化定位
    fun._init(external.type);

    function MouseWheelHandler(e){
        var oEvent = e || event ;
        options.delta = Math.max(-1, Math.min(1, (oEvent.wheelDelta || -oEvent.detail)));
    };

    // 执行滚轮函数
    wheel(document , MouseWheelHandler , false);

  }

  // 对外接口
  var pfDefault = {
    type : 0 ,                        /*瀑布流加载类型*/
    width : 'auto' ,                  /*瀑布流的整体宽度*/
    length : 6 ,                      /*每行显示的个数*/
    spacing : 10,                     /*每个独立块之间的间距*/
    loading : true,                   /*是否显示加载样式，可以自定义加载样式（指定类或者ID）*/
    loadingText : '加载中…' ,         /*加载显示的文字*/
    showClass : false ,               /*是否开启每个独立块显示样式，可以自定义css3动画*/
    reposition : true ,               /*加载完是否重新排序*/
    after : $.noop  ,                 /*图片显示之后执行的函数*/
    ajaxBefore : $.noop ,             /*异步加载之前执行的的函数*/        
    ajax : {
      type : 'GET' ,                  /*类型*/      
      url : '' ,                      /*加载连接*/
      dataType : '' ,                 /*加载数据类型*/
      dom : '' ,                      /*触发执行异步加载对象*/      
      domType : 'click'  ,            /*触发执行异步加载类型*/
      domDistance : 100               /*触发执行异步加载距离底部的高度*/
    }
  }

  // 跨浏览器绑定鼠标滚动事件
  function wheel(obj, fn ,useCapture){
    //判断是不是FF
    var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
    if (obj.attachEvent)  {//if IE (and Opera depending on user setting) 
      obj.attachEvent("on"+mousewheelevt, fn, useCapture); 
    }
    else if (obj.addEventListener) {//WC3 browsers 
      obj.addEventListener(mousewheelevt, fn, useCapture);
    }
  };
  // 辅助方法
  function is_null(a) {
    return (a === null);
  }
  function is_undefined(a) {
    return (is_null(a) || typeof a == 'undefined' || a === '' || a === 'undefined');
  }
  function is_array(a) {
    return (a instanceof Array);
  }
  function is_jquery(a) {
    return (a instanceof jQuery);
  }
  function is_object(a) {
    return ((a instanceof Object || typeof a == 'object') && !is_null(a) && !is_jquery(a) && !is_array(a) && !is_function(a));
  }
  function is_number(a) {
    return ((a instanceof Number || typeof a == 'number') && !isNaN(a));
  }
  function is_string(a) {
    return ((a instanceof String || typeof a == 'string') && !is_undefined(a) && !is_true(a) && !is_false(a));
  }
  function is_function(a) {
    return (a instanceof Function || typeof a == 'function');
  }
  function is_boolean(a) {
    return (a instanceof Boolean || typeof a == 'boolean' || is_true(a) || is_false(a));
  }
  function is_true(a) {
    return (a === true || a === 'true');
  }
  function is_false(a) {
    return (a === false || a === 'false');
  }
  function is_percentage(x) {
    return (is_string(x) && x.slice(-1) == '%');
  }

}) (jQuery);