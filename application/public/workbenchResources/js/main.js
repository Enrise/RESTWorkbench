// ###############################################
//
// AUTHOR: Nick LaPrell (http://nick.laprell.org)  
//
// Project Home: http://code.google.com/p/ezcookie/
//
// ###############################################

(function($){
  
  // Default options
  dOptions = {
    expires : 365,
    domain : '.docs.dev',
    secure : false,
    path : '/'
  }

  // Returns the cookie or null if it does not exist.
  $.cookie = function(cookieName) {
    var value = null;
    if(document.cookie && document.cookie != ''){
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = jQuery.trim(cookies[i]);
        if (cookie.substring(0, cookieName.length + 1) == (cookieName + '=')) {
          value = decodeURIComponent(cookie.substring(cookieName.length + 1));
          break;
        }
      }
    }
    try {
        // Test for a JSON string and return the object
        return JSON.parse(value);
    } catch(e){
        // or return the string
        return value;
    }
  }
  
  $.subCookie = function(cookie,key){
    var cookie = $.cookie(cookie);
    if(!cookie || typeof cookie != 'object'){return null;}
    return cookie[key];
  }
  
  // Write the defined value to the given cookie
  $.setCookie = function(cookieName,cookieValue,options){
    // Combine defaults and passed options, if any
    var options = typeof options != 'undefined' ? $.extend(dOptions, options) : dOptions;
    // Set cookie attributes based on options
    var path = '; path=' + (options.path);
    var domain = '; domain=' + (options.domain);
    var secure = options.secure ? '; secure' : '';
    if (cookieValue && (typeof cookieValue == 'function' || typeof cookieValue == 'object')) {
        cookieValue = JSON.stringify(cookieValue);
    }
    cookieValue = encodeURIComponent(cookieValue);
    var date;
    // Set expiration
    if (typeof options.expires == 'number') {
      date = new Date();
      date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
    } else {
      date = options.expires;
    }
    var expires = '; expires=' + date.toUTCString();
    // Write the cookie
    document.cookie = [cookieName, '=', cookieValue, expires, path, domain, secure].join('');
  }
  
  $.setSubCookie = function(cookie,key,value,options){
    var options = typeof options != 'undefined' ? $.extend(dOptions, options) : dOptions;
    var existingCookie = $.cookie(cookie);
    var cookieObject = existingCookie && typeof existingCookie == 'object' ? existingCookie : {};
    cookieObject[key] = value;
    $.setCookie(cookie,cookieObject,options);
  }
  
  $.removeSubCookie = function(cookie,key){
    var cookieObject = $.cookie(cookie);
    if(cookieObject && typeof cookieObject == 'object' && typeof cookieObject[key] != 'undefined'){
        delete cookieObject[key];
        $.setCookie(cookie,cookieObject);
    }
  }

  $.removeCookie = function(cookie){
    $.setCookie(cookie,'',{expires:-1});
  }

  $.clearCookie = function(cookie){
    $.setCookie(cookie,'');
  }
  
})(jQuery);

// Begin minified json2.js library from json.org
// http://www.json.org/js.html
if(!this.JSON){this.JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());



/*
jQuery Wiggle
Author: WonderGroup, Jordan Thomas
URL: http://labs.wondergroup.com/demos/mini-ui/index.html
License: MIT (http://en.wikipedia.org/wiki/MIT_License)
*/
jQuery.fn.wiggle=function(o){var d={speed:50,wiggles:3,travel:5,callback:null};var o=jQuery.extend(d,o);return this.each(function(){var cache=this;var wrap=jQuery(this).wrap('<div class="wiggle-wrap"></div>').css("position","relative");var calls=0;for(i=1;i<=o.wiggles;i++){jQuery(this).animate({left:"-="+o.travel},o.speed).animate({left:"+="+o.travel*2},o.speed*2).animate({left:"-="+o.travel},o.speed,function(){calls++;if(jQuery(cache).parent().hasClass('wiggle-wrap')){jQuery(cache).parent().replaceWith(cache);}
if(calls==o.wiggles&&jQuery.isFunction(o.callback)){o.callback();}});}});};

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);

var Docs = {
        init: function() {
            $('#oauth').hide();
            //Work through the open and closed settings
            var open = $.cookie('explicitlyOpenTogglables') || [];
            var closed = $.cookie('explicitlyClosedTogglables') || [];
            
            for (id in open) {
                if (0 < id.length) {
                    var elem = $('#' + id);
                    this.expandOperation(elem);
                }
            }
            for (id in closed) {
                if (0 < id.length) {
                    this.collapseEndpointListForResource(id.replace('resource_', ''));
                }
            }
            this.shebang();
        },
        
        shebang: function() {
            // If shebang has an operation nickname in it..
            // e.g. /docs/#!/words/get_search
            var fragments = $.param.fragment();
            if (fragments.length) {
                var id = $('a[href="#' + fragments + '"]').first().parents('li').first().slideto({highlight: false}).attr('id');
                if (0 === id.indexOf('resource')) {
                    Docs.expandEndpointListForResource(id.replace('resource_', ''));
                } else {
                    Docs.expandOperation($('#' + id + '>div'));
                }
            }
        },
        
        toggleEndpointListForResource: function(resource) {
            var elem = $('li#resource_' + resource + ' ul.endpoints');
            if (elem.is(':visible')) {
                Docs.collapseEndpointListForResource(resource);
            } else {
                Docs.expandEndpointListForResource(resource);
            }
        },
        
        // Expand resource and remove explicit closure cookie
        expandEndpointListForResource: function(resource) {
            var resource = $('#resource_' + resource);
            var entries = resource.children('ul.endpoints');
            
            resource.addClass('active');
            entries.slideDown();
            $.removeSubCookie('explicitlyClosedTogglables', resource.attr('id'));
            $.cookie('explicitlyClosedTogglables');
            $.scrollTo(entries.siblings('.heading'), 800, {offset: {left: 0, top: 4}});
        },
        
        // Collapse resource and mark as explicitly closed
        collapseEndpointListForResource: function(resource) {
            var resource = $('#resource_' + resource);
            var entries = resource.children('ul.endpoints');
            
            resource.removeClass('active');
            entries.slideUp();
            $.setSubCookie('explicitlyClosedTogglables', resource.attr('id'), true);
            $.cookie('explicitlyClosedTogglables');
        },
        
        expandOperationsForResource: function(resource) {
            // Make sure the resource container is open..
            Docs.expandEndpointListForResource(resource);
            $('li#resource_' + resource + ' li.operation div.content').each(function() {
                Docs.expandOperation($(this));
            });
        },
        
        toggleOperationsForResource: function(resource) {
            
        },
        
        collapseOperationsForResource: function(resource) {
            // Make sure the resource container is open..
            Docs.expandEndpointListForResource(resource);
            $('li#resource_' + resource + ' li.operation div.content').each(function() {
                Docs.collapseOperation($(this));
            });
        },
        
        expandOperation: function(elem) {
            elem.slideDown();
            $.setSubCookie('explicitlyOpenTogglables', elem.attr('id'), true);
        },
        
        collapseOperation: function(elem) {
            elem.slideUp();
            $.removeSubCookie('explicitlyOpenTogglables', elem.attr('id'));
        },
        
        toggleOperationContent: function(dom_id) {
            var elem = $('#' + dom_id);
            if (elem.is(':visible')) {
                Docs.collapseOperation(elem);
            } else {
                Docs.expandOperation(elem);
                if (elem) {
                    $.scrollTo(elem.parent('li'), 800, {offset: {left: 0, top: -8}});
                }
            }
        }
};


/*
* jQuery BBQ: Back Button & Query Library - v1.2.1 - 2/17/2010
* http://benalman.com/projects/jquery-bbq-plugin/
*
* Copyright (c) 2010 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
*/
(function($,p){var i,m=Array.prototype.slice,r=decodeURIComponent,a=$.param,c,l,v,b=$.bbq=$.bbq||{},q,u,j,e=$.event.special,d="hashchange",A="querystring",D="fragment",y="elemUrlAttr",g="location",k="href",t="src",x=/^.*\?|#.*$/g,w=/^.*\#/,h,C={};function E(F){return typeof F==="string"}function B(G){var F=m.call(arguments,1);return function(){return G.apply(this,F.concat(m.call(arguments)))}}function n(F){return F.replace(/^[^#]*#?(.*)$/,"$1")}function o(F){return F.replace(/(?:^[^?#]*\?([^#]*).*$)?.*/,"$1")}function f(H,M,F,I,G){var O,L,K,N,J;if(I!==i){K=F.match(H?/^([^#]*)\#?(.*)$/:/^([^#?]*)\??([^#]*)(#?.*)/);J=K[3]||"";if(G===2&&E(I)){L=I.replace(H?w:x,"")}else{N=l(K[2]);I=E(I)?l[H?D:A](I):I;L=G===2?I:G===1?$.extend({},I,N):$.extend({},N,I);L=a(L);if(H){L=L.replace(h,r)}}O=K[1]+(H?"#":L||!K[1]?"?":"")+L+J}else{O=M(F!==i?F:p[g][k])}return O}a[A]=B(f,0,o);a[D]=c=B(f,1,n);c.noEscape=function(G){G=G||"";var F=$.map(G.split(""),encodeURIComponent);h=new RegExp(F.join("|"),"g")};c.noEscape(",/");$.deparam=l=function(I,F){var H={},G={"true":!0,"false":!1,"null":null};$.each(I.replace(/\+/g," ").split("&"),function(L,Q){var K=Q.split("="),P=r(K[0]),J,O=H,M=0,R=P.split("]["),N=R.length-1;if(/\[/.test(R[0])&&/\]$/.test(R[N])){R[N]=R[N].replace(/\]$/,"");R=R.shift().split("[").concat(R);N=R.length-1}else{N=0}if(K.length===2){J=r(K[1]);if(F){J=J&&!isNaN(J)?+J:J==="undefined"?i:G[J]!==i?G[J]:J}if(N){for(;M<=N;M++){P=R[M]===""?O.length:R[M];O=O[P]=M<N?O[P]||(R[M+1]&&isNaN(R[M+1])?{}:[]):J}}else{if($.isArray(H[P])){H[P].push(J)}else{if(H[P]!==i){H[P]=[H[P],J]}else{H[P]=J}}}}else{if(P){H[P]=F?i:""}}});return H};function z(H,F,G){if(F===i||typeof F==="boolean"){G=F;F=a[H?D:A]()}else{F=E(F)?F.replace(H?w:x,""):F}return l(F,G)}l[A]=B(z,0);l[D]=v=B(z,1);$[y]||($[y]=function(F){return $.extend(C,F)})({a:k,base:k,iframe:t,img:t,input:t,form:"action",link:k,script:t});j=$[y];function s(I,G,H,F){if(!E(H)&&typeof H!=="object"){F=H;H=G;G=i}return this.each(function(){var L=$(this),J=G||j()[(this.nodeName||"").toLowerCase()]||"",K=J&&L.attr(J)||"";L.attr(J,a[I](K,H,F))})}$.fn[A]=B(s,A);$.fn[D]=B(s,D);b.pushState=q=function(I,F){if(E(I)&&/^#/.test(I)&&F===i){F=2}var H=I!==i,G=c(p[g][k],H?I:{},H?F:2);p[g][k]=G+(/#/.test(G)?"":"#")};b.getState=u=function(F,G){return F===i||typeof F==="boolean"?v(F):v(G)[F]};b.removeState=function(F){var G={};if(F!==i){G=u();$.each($.isArray(F)?F:arguments,function(I,H){delete G[H]})}q(G,2)};e[d]=$.extend(e[d],{add:function(F){var H;function G(J){var I=J[D]=c();J.getState=function(K,L){return K===i||typeof K==="boolean"?l(I,K):l(I,L)[K]};H.apply(this,arguments)}if($.isFunction(F)){H=F;return G}else{H=F.handler;F.handler=G}}})})(jQuery,this);
/*
* jQuery hashchange event - v1.2 - 2/11/2010
* http://benalman.com/projects/jquery-hashchange-plugin/
*
* Copyright (c) 2010 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
*/
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=f.msie&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);



(function(b){b.fn.slideto=function(a){a=b.extend({slide_duration:"slow",highlight_duration:3E3,highlight:true,highlight_color:"#FFFF99"},a);return this.each(function(){obj=b(this);b("body").animate({scrollTop:obj.offset().top},a.slide_duration,function(){a.highlight&&b.ui.version&&obj.effect("highlight",{color:a.highlight_color},a.highlight_duration)})})}})(jQuery);



$(function() {
     //Must be first! 
     Docs.init();
     $('#oauth').hide();
     $("#colorchange").change(function(evt) {
         var $form = $(this);
         $.ajax({
             url: '/workbench/index/color',
             data: $form.serializeArray(),
             type: 'get',
             dataType: 'json',
             success: function (response, status, xhr) {
                 var foo = '';
                 var methods = [];
                 var active = null;
                 $form.find('#styleMethod option').each(function(elm) {
                     methods.push(this.value);
                 });
                 if (!$form.find('#styleAll').attr('checked')) {
                     active = $form.find('#styleMethod').attr('value');
                 }
                 
                 for (i in methods) {
                     var method = methods[i];
                     
                     var queries = [
                         'ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.heading ul.options li a',
                         'ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.content h4',
                         'ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.content div.sandbox_header a'
                     ];
                     queries = queries.join(', ');
                     val = '';
                     if (null === active || active === method) {
                         val = response[100].hex;
                         foo += '/** ' + method.toUpperCase() + ' override **/<br/>';
                         foo += queries + ' { color: ' + response[100].hex + '; }';
                     }
                     $(queries).css('color', val);
                     
                     queries = [
                         'ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' h3 span.http_method a'
                     ];
                     queries = queries.join(', ');
                     val = '';
                     if (null === active || active === method) {
                         val = response[100].hex;
                         foo += "<br/>" + queries + ' { background-color: ' + response[100].hex + '; }';
                     }
                     $(queries).css('backgroundColor', val);
                     
                     queries = [
                          'ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.content',
                          'ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.heading'
                     ];
                     queries = queries.join(', ');
                     val = {
                         'backgroundColor': '',
                         'borderColor': ''
                     };
                     if (null === active || active === method) {
                         val = {
                             'backgroundColor': response[10].hex,
                             'borderColor': response[25].hex
                         };
                         foo += "<br/>" + queries + ' { background-color: ' + response[10].hex + '; border-color: ' + response[25].hex + '; }<br/><br/>';
                     }
                     $(queries).css(val);
                     
                 }
                 $('#showStylesContainer').html(foo);
             },
             error: function (xhr, status, error) { }
         });
     });
     $('#showStyles').click(function(evt) {
         $('#showStylesContainer').toggle('slow');
         return false;
     });
     
     // Helper function for vertically aligning DOM elements
     // http://www.seodenver.com/simple-vertical-align-plugin-for-jquery/
     $.fn.vAlign = function() {
         return this.each(function(i) {
             var ah = $(this).height();
             var ph = $(this).parent().height();
             var mh = (ph - ah) / 2;
             $(this).css('margin-top', mh);
         });
     };
     $.fn.stretchFormtasticInputWidthToParent = function() {
         return this.each(function(i) {
             var p_width = $(this).closest("form").innerWidth();
             var p_padding = parseInt($(this).closest("form").css('padding-left') ,10) + parseInt($(this).closest("form").css('padding-right'), 10);
             var this_padding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10);
             $(this).css('width', p_width - p_padding - this_padding);
         });
     };
     $('form.formtastic li.string input, form.formtastic textarea').stretchFormtasticInputWidthToParent();
     // Vertically center these paragraphs
     // Parent may need a min-height for this to work..
     $('ul.downplayed li div.content p').vAlign();
     
     $('form.sandbox select[name="core[format]"]').change(function(evt) {
         var accept = $(evt.target).parents('table').find('input[name="core[accept]"]');
         accept.val(accept.val().replace(/(\+[a-z]+)/, '+' + evt.target.value));
     });
     
     // When a sandbox form is submitted..
     $("form.sandbox").submit(function() {
         var error_free = true;
         // Cycle through the forms required inputs
         $(this).find("input.required").each(function() {
             // Remove any existing error styles from the input
             $(this).removeClass('error');
             // Tack the error style on if the input is empty..
             if ($(this).val() == '') {
                 $(this).addClass('error');
                 $(this).wiggle();
                 error_free = false;
             }
         });
         return error_free;
     });
 });
 // Logging function that accounts for browsers that don't have window.console
 function log(m) {
     //if (window.console) console.log(m);
 }

 /*
 * jquery-ujs
 *
 * http://github.com/rails/jquery-ujs/blob/master/src/rails.js
 *
 * This rails.js file supports jQuery 1.4.3 and 1.4.4 .
 *
 */
 jQuery(function ($) {
     var csrf_token = $('meta[name=csrf-token]').attr('content'),
     csrf_param = $('meta[name=csrf-param]').attr('content');
     
     $.fn.extend({
         /**
         * Triggers a custom event on an element and returns the event result
         * this is used to get around not being able to ensure callbacks are placed
         * at the end of the chain.
         */
         triggerAndReturn: function (name, data) {
             var event = new $.Event(name);
             this.trigger(event, data);
             return event.result !== false;
         },
         /**
         * Handles execution of remote calls. Provides following callbacks:
         *
         * - ajax:beforeSend - is executed before firing ajax call
         * - ajax:success - is executed when status is success
         * - ajax:complete - is executed when the request finishes, whether in failure or success
         * - ajax:error - is execute in case of error
         */
         callRemote: function () {
             var el = this,
             method = el.attr('method') || el.attr('data-method') || 'GET',
             url = el.attr('action') || el.attr('href'),
             dataType = el.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType);
             if (url === undefined) {
                 throw "No URL specified for remote call (action or href must be present).";
             } else {
                 var $this = $(this),
                     $throbber = $this.find('.throbber'),
                     data = el.is('form') ? el.serializeArray() : [];
                 
                 data = data.concat($('#oauth').serializeArray());
                 $throbber.show();
                 $this.siblings('div.response').css('opacity', '0.1');
                 var startTime = new Date();
                 $.ajax({
                     url: url,
                     data: data,
                     dataType: dataType,
                     type: method.toUpperCase(),
                     beforeSend: function (xhr) {
                         if ($this.triggerHandler('ajax:beforeSend') === false) {
                             return false;
                         }
                         // if user has used jQuery.ajaxSetup then call beforeSend callback
                         var beforeSendGlobalCallback = $.ajaxSettings && $.ajaxSettings.beforeSend;
                         if (beforeSendGlobalCallback !== undefined) {
                             beforeSendGlobalCallback(xhr);
                         }
                     },
                     success: function (response, status, xhr) {
                         el.trigger('ajax:success', [response, status, xhr]);
                         $throbber.hide();
                         $this.siblings('div.response').css('opacity', '1');
                     },
                     complete: function (xhr) {
                         el.trigger('ajax:complete', xhr);
                         $throbber.hide();
                         $this.siblings('div.response').css('opacity', '1');
                     },
                     error: function (xhr, status, error) {
                         el.trigger('ajax:error', [xhr, status, error]);
                         $throbber.hide();
                         $this.siblings('div.response').css('opacity', '1');
                     }
                 });
             }
         }
     });
     /**
     * confirmation handler
     */
     $('body').delegate('a[data-confirm], button[data-confirm], input[data-confirm]', 'click.rails', function () {
         var el = $(this);
         if (el.triggerAndReturn('confirm')) {
             if (!confirm(el.attr('data-confirm'))) {
                 return false;
             }
         }
     });
     /**
     * remote handlers
     */
     $('form[data-remote]').live('submit.rails', function (e) {
         $(this).callRemote();
         e.preventDefault();
     });
     $('a[data-remote],input[data-remote]').live('click.rails', function (e) {
         $(this).callRemote();
         e.preventDefault();
     });
     /**
     * <%= link_to "Delete", user_path(@user), :method => :delete, :confirm => "Are you sure?" %>
     *
     * <a href="/users/5" data-confirm="Are you sure?" data-method="delete" rel="nofollow">Delete</a>
     */
     $('a[data-method]:not([data-remote])').live('click.rails', function (e){
         var link = $(this),
             href = link.attr('href'),
             method = link.attr('data-method'),
             form = $('<form method="post" action="'+href+'"></form>'),
             metadata_input = '<input name="_method" value="'+method+'" type="hidden" />';
         
         if (csrf_param !== undefined && csrf_token !== undefined) {
             metadata_input += '<input name="'+csrf_param+'" value="'+csrf_token+'" type="hidden" />';
         }
         form.hide()
             .append(metadata_input)
             .appendTo('body');
         e.preventDefault();
         form.submit();
     });
     /**
     * disable-with handlers
     */
     var disable_with_input_selector = 'input[data-disable-with]',
         disable_with_form_remote_selector = 'form[data-remote]:has(' + disable_with_input_selector + ')',
         disable_with_form_not_remote_selector = 'form:not([data-remote]):has(' + disable_with_input_selector + ')';
     
     var disable_with_input_function = function () {
         $(this).find(disable_with_input_selector).each(function () {
         var input = $(this);
         input.data('enable-with', input.val())
              .attr('value', input.attr('data-disable-with'))
              .attr('disabled', 'disabled');
         });
     };
     $(disable_with_form_remote_selector).live('ajax:before.rails', disable_with_input_function);
     $(disable_with_form_not_remote_selector).live('submit.rails', disable_with_input_function);
     $(disable_with_form_remote_selector).live('ajax:complete.rails', function () {
         $(this).find(disable_with_input_selector).each(function () {
             var input = $(this);
             input.removeAttr('disabled')
                  .val(input.data('enable-with'));
         });
     });
});
 