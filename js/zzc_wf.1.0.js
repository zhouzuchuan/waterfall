/*
*
*create by zhouzuchuan (.com)
*版本 ： v1.0 【2015.03.12】
*兼容性 ： IE6+/FF/Chrome... 
*
*/

;(function($) {

  // 给页面装载默认css
  var style = '<style type="text/css">' + 
              '.zzc_wf_loading {position: fixed; _position: absolute; left: 50%; bottom: 200px; }' + 
              '.zzc_wf_loading p {position: absolute; top: 0; left: 0; z-index: 1000; width: 100%; height: 100%; background: #fff url(http://365jia.cn/images/load.gif) no-repeat 10px center; opacity: .8; filter: alpha(opacity=80); border-radius: 10px; }' +
              '.zzc_wf_loading div {position: absolute; top: 0; left: 0; z-index: 1001; text-align: center; }' + 
              '.zzc_wf_loading strong {display: inline-block; color: #555; font-size: 18px; font-weight: normal; font-family: Microsoft YaHei,SimHei; padding: 0 10px; white-space: nowrap; vertical-align: middle; }' + 
              '.zzc_wf_loading em {display: inline-block; width: 32px; height: 32px; padding: 10px 0 10px 10px; vertical-align: middle; }' + 
              '.zzc_wf_box li {visibility: hidden}' +
              '.zzc_wf_loading_btn {position:absolute;top:-100px;right:0px;width:10px;height:10px;background:green;z-index:-1;}' + 
              '.zzc_wf_in {animation: zzc_wf_fade 1s; -webkit-animation: zzc_wf_fade 1s; }' + 
              '@-webkit-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@-moz-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@-o-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@-ms-keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' +
              '@keyframes zzc_wf_fade {0% {opacity: 0; } 100% {opacity: 1; } }' ;
  $('head').append(style);

  // 给对象添加方法
  $.fn.zzc_wf = function(options) {
    var z = $.extend({} , wfDefault , options || {});

    $.zzc_wf($(this) , options);
  }
  // jquery添加调用方法
  $.zzc_wf = function(elements , options) {
    if(!elements) return false;
    var z = $.extend({} , wfDefault , options || {});

    $.o = {
      z : z , 
      ele : elements ,
      eul : elements.children('ul') ,
      eli : elements.children('ul').children('li') ,
      h : [] ,        /*储存高度*/
      typeNum : 0     /*异步加载执行类型*/
    }



    // 设置加载
    if (((typeof $.o.z.loading == 'string') && ($.o.z.loading != '')) || ((typeof $.o.z.loading == 'boolean') && $.o.z.loading)) {
      $.zzc_wf.setLoading();
    }

    for (var i = 0 ; i < $.o.z.length ; i ++) {
      $.o.h[i] = - $.o.z.spacing;
    }

    // 初始化定位
    $.zzc_wf.setPostion($.o.z.showClass , $.o.z.type);
    // 判断是否使用ajax
    if ($.o.z.ajax.url != '' ) {
      if ($.o.z.ajax.domType == 'scroll') {
        $.o.typeNum = 1;
      }
      $.zzc_wf.ajaxPosition($.o.z.showClass);
    }

  }

  $.extend($.zzc_wf , {

    // 初始化位置
    setPostion : function(a , n) {
      
      a = (typeof a === 'string') ? a : (a ? 'zzc_wf_in' : '') ;

      if (/^\#|^\./.test(a)) {
        a = a.slice(1,a.length);
      }

      $.o.z.width = (typeof $.o.z.width === 'string') ? $.o.ele.width() : $.o.z.width;

      var iw = Math.floor(($.o.z.width - ($.o.z.length - 1) * $.o.z.spacing) / $.o.z.length) , min_h , key , max_h , otherSpacing = $.o.eli.outerWidth() - $.o.eli.width() , wan = 0 , jia = 0 , startNum = $.o.z.length , endNum = $.o.eli.length ;

      $.o.eli.css({visibility : 'hidden'});
      $.o.eul.css({position : 'relative'});

      if (n === 1) {
        startNum = 0 ;
        setH2();
      } else {
        setH();
      }

      // 定位第一排区块
      function setH() {
        $.o.eli.slice(0,startNum).each(function(index,element) {
          $(element).addClass(a).css({
            position : 'absolute' ,
            width : iw - otherSpacing ,
            top : 0 ,
            left : index * (iw + $.o.z.spacing) ,
            visibility : 'visible'
          });
          $.zzc_wf.imgLoad($(element).find('img') , function (obj) {
            wan ++ ;

            $(obj).width((obj.get(0).width > (iw - otherSpacing)) ? (iw - otherSpacing) : obj.get(0).width);
            $(obj).height($(obj).height());

            if (!(wan == ($.o.z.length > $.o.eli.length ? $.o.eli.length : $.o.z.length))) return false;
            
            for ( var j = 0 ; j < $.o.z.length ; j ++ ) {
              $.o.h[j] = $.o.eli.eq(j).outerHeight(true);
            }

            $.o.eul.height(Math.max.apply(null,$.o.h));


            if ($.o.z.length >= $.o.eli.length) {
              setTimeout(function() {
                $.zzc_wf.reposition();
              },500);
              return false;
            }
            setH2();
          });
        });        
      }

      function setH2() {
        $.o.eli.slice(startNum,endNum).each(function(index,element) {
          $.zzc_wf.imgLoad($(element).find('img'),function (obj) {

            $(obj).width((obj.get(0).width > (iw - otherSpacing)) ? (iw - otherSpacing) : obj.get(0).width);
            $(obj).height($(obj).height());

            min_h = Math.min.apply(null,$.o.h);
            key = $.zzc_wf.getArrayKey($.o.h , min_h);
            $(obj).parents('li').addClass(a).css({
              position : 'absolute' ,
              width : iw - otherSpacing ,
              top : min_h + $.o.z.spacing,
              left : key * (iw + $.o.z.spacing) ,
              visibility : 'visible'
            });  
            max_h = $.o.h[key] += $(obj).parents('li').outerHeight(true) + $.o.z.spacing;
            $.o.eul.height((Math.max.apply(null,$.o.h) > max_h) ? Math.max.apply(null,$.o.h) : max_h); 
            jia ++;
            if ((wan + jia) === $.o.eli.size()) {
              setTimeout(function() {
                $.zzc_wf.reposition();
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
    // 设置加载样式
    setLoading : function () {
      var oloading = document.createElement('div') , fragment = document.createDocumentFragment() , loadingClass = (typeof $.o.z.loading == 'boolean') ? 'zzc_wf_loading' : $.o.z.loading;
     
      if (/^\#|^\./.test(loadingClass)) {
        loadingClass = loadingClass.slice(1,loadingClass.length);
      }

      $(oloading).attr('class',loadingClass).html('<p></p><div><em></em><strong> '+ $.o.z.loadingText +' </strong></div>');
      fragment.appendChild(oloading);
      $.o.ele.append(fragment);
      var sw = $(oloading).find('strong').outerWidth(true) , sh = $(oloading).find('strong').outerHeight(true) , ew = $(oloading).find('em').outerWidth(true) , eh = $(oloading).find('em').outerHeight(true);
      $(oloading).css({
        'width' : sw + ew ,
        'height' : (sh > eh) ? sh : eh ,
        'margin-left' : - (sw + ew) / 2 
      });
    },
    // 重新定位
    reposition : function () {

      if ($.o.z.reposition) {
        $.o.z.width = ($.o.z.width > $.o.ele.width()) ? $.o.ele.width() : $.o.z.width;
        var iw = Math.floor(($.o.z.width - ($.o.z.length - 1) * $.o.z.spacing) / $.o.z.length) , h = [] , min_h , key , max_h , otherSpacing = $.o.eli.outerWidth() - $.o.eli.width();

        for (var i = 0 ; i < $.o.z.length ; i ++) {
          h[i] = - $.o.z.spacing;
        }
        
        $.o.eul.find('li').each(function(index,element) {
          min_h = Math.min.apply(null,h);
          key = $.zzc_wf.getArrayKey(h , min_h);
          $(element).css({
            position : 'absolute' ,
            width : iw - otherSpacing ,
            top : min_h + $.o.z.spacing ,
            left : key * (iw + $.o.z.spacing) 
          }); 
          max_h = h[key] += $(element).outerHeight(true) + $.o.z.spacing;
        }); 
        $.o.h = h;
        $.o.eul.height(Math.max.apply(null,h));
      }

      $.o.z.after();

      $('.zzc_wf_loading').stop().animate({
        'opacity' : 0 ,
        'margin-bottom' : -70 
      },1000).queue(function(next){
        $(this).remove();
        next();
      });

      $($.o.z.loading).remove();


    } ,
    // 异步加载定位
    ajaxPosition : function (a) {
      
      a = (typeof a === 'string') ? a : (a ? 'zzc_wf_in' : '') ;

      if (/^\#|^\./.test(a)) {
        a = a.slice(1,a.length);
      }

      var iw = Math.floor(($.o.z.width - ($.o.z.length - 1) * $.o.z.spacing) / $.o.z.length) , min_h , key , max_h , otherSpacing = $.o.eli.outerWidth() - $.o.eli.width() , flag = 1 , wan = 0;

      if ($.o.typeNum == 1) {
        $.o.ele.append('<div class="zzc_wf_loading_btn" style=""></div>');
        if (typeof $.o.z.ajax.dom === 'undefined') {
          $.o.z.ajax.dom = '.zzc_wf_loading_btn';
        }
        $(window).on({
          scroll : function() {
            var st = parseInt($(document).height() - $(window).height()) ;
            if ($(this).scrollTop() < st) return false ;
            setTimeout(function() {
              $($.o.z.ajax.dom).trigger('click');
            },500);
          }
        });
      }

      $($.o.z.ajax.dom).on({
        click : btnClick 
      });

      function btnClick () {
        if (flag != 1) return false;
        flag = 0;
        $.o.eul.append('<div class="zzc_wf_box"></div>');
        $.ajax({
          type : $.o.z.ajax.type ,
          url : $.o.z.ajax.url ,
          timeout : 1000,
          beforeSend : $.o.z.ajaxBefore() ,
          success : function(response , status , xhr) {
            if (((typeof $.o.z.loading == 'string') && ($.o.z.loading != '')) || ((typeof $.o.z.loading == 'boolean') && $.o.z.loading)) {
              $.zzc_wf.setLoading();
            }
            $('.zzc_wf_box').html(response);
            $('.zzc_wf_box').find('li').each(function(index,element) {
              
              $.zzc_wf.imgLoad($(element).find('img') , function(obj) {

                $(obj).width((obj.get(0).width > (iw - otherSpacing)) ? (iw - otherSpacing) : obj.get(0).width);
                $(obj).height($(obj).height());

                min_h = Math.min.apply(null,$.o.h);
                key = $.zzc_wf.getArrayKey($.o.h , min_h);
                $(obj).parents('li').addClass(a).css({
                  position : 'absolute' ,
                  width : iw - otherSpacing ,
                  top : min_h + $.o.z.spacing ,
                  left : key * (iw + $.o.z.spacing) ,
                  visibility : 'visible'
                });  
                max_h = $.o.h[key] += $(obj).parents('li').outerHeight(true) + $.o.z.spacing;
                $.o.eul.height(Math.max.apply(null,$.o.h)); 
                wan ++ ;
                if (wan == $('.zzc_wf_box').find('li').size()) {
                  $('.zzc_wf_box').find('li').unwrap();
                  $.zzc_wf.reposition();
                  wan = 0
                  flag = 1 ;
                }
              });
              
            });

          } ,
          error : function(xhr) {
            alert(xhr.status + ' : ' + xhr.statusText );
          }

        });
      }


    } ,
    // 判断图片是否加载
    imgLoad : function (obj ,callback) {
      var timer2 = setInterval(function() {
        if (obj.complete || (obj.width && obj.height && document.all)) {
          callback(obj);
          clearInterval(timer);
        }
      },30);
    } 


  });

  
  
  // 默认参数
  var wfDefault = {
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
      dom : '' ,                      /*触发执行异步加载对象*/      
      domType : 'click'               /*触发执行异步加载类型*/
    }
  };

}) (jQuery);