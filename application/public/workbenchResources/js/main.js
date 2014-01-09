
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


if(jQuery)(function($){$.extend($.fn,{miniColors:function(o,data){var create=function(input,o,data){var color=cleanHex(input.val());if(!color)color='FFFFFF';var hsb=hex2hsb(color);var trigger=$('<a class="miniColors-trigger" style="background-color: #'+color+'" href="#"></a>');trigger.insertAfter(input);input.addClass('miniColors').attr('maxlength',7).attr('autocomplete','off');input.data('trigger',trigger);input.data('hsb',hsb);if(o.change)input.data('change',o.change);if(o.readonly)input.attr('readonly',true);if(o.disabled)disable(input);trigger.bind('click.miniColors',function(event){event.preventDefault();input.trigger('focus');});input.bind('focus.miniColors',function(event){show(input);});input.bind('blur.miniColors',function(event){var hex=cleanHex(input.val());input.val(hex?'#'+hex:'');});input.bind('keydown.miniColors',function(event){if(event.keyCode===9)hide(input);});input.bind('keyup.miniColors',function(event){var filteredHex=input.val().replace(/[^A-F0-9#]/ig,'');input.val(filteredHex);if(!setColorFromInput(input)){input.data('trigger').css('backgroundColor','#FFF');}});input.bind('paste.miniColors',function(event){setTimeout(function(){input.trigger('keyup');},5);});};var destroy=function(input){hide();input=$(input);input.data('trigger').remove();input.removeAttr('autocomplete');input.removeData('trigger');input.removeData('selector');input.removeData('hsb');input.removeData('huePicker');input.removeData('colorPicker');input.removeData('mousebutton');input.removeData('moving');input.unbind('click.miniColors');input.unbind('focus.miniColors');input.unbind('blur.miniColors');input.unbind('keyup.miniColors');input.unbind('keydown.miniColors');input.unbind('paste.miniColors');$(document).unbind('mousedown.miniColors');$(document).unbind('mousemove.miniColors');};var enable=function(input){input.attr('disabled',false);input.data('trigger').css('opacity',1);};var disable=function(input){hide(input);input.attr('disabled',true);input.data('trigger').css('opacity',.5);};var show=function(input){if(input.attr('disabled'))return false;hide();var selector=$('<div class="miniColors-selector"></div>');selector.append('<div class="miniColors-colors" style="background-color: #FFF;"><div class="miniColors-colorPicker"></div></div>');selector.append('<div class="miniColors-hues"><div class="miniColors-huePicker"></div></div>');selector.css({top:input.is(':visible')?input.offset().top+input.outerHeight():input.data('trigger').offset().top+input.data('trigger').outerHeight(),left:input.is(':visible')?input.offset().left:input.data('trigger').offset().left,display:'none'}).addClass(input.attr('class'));var hsb=input.data('hsb');selector.find('.miniColors-colors').css('backgroundColor','#'+hsb2hex({h:hsb.h,s:100,b:100}));var colorPosition=input.data('colorPosition');if(!colorPosition)colorPosition=getColorPositionFromHSB(hsb);selector.find('.miniColors-colorPicker').css('top',colorPosition.y+'px').css('left',colorPosition.x+'px');var huePosition=input.data('huePosition');if(!huePosition)huePosition=getHuePositionFromHSB(hsb);selector.find('.miniColors-huePicker').css('top',huePosition.y+'px');input.data('selector',selector);input.data('huePicker',selector.find('.miniColors-huePicker'));input.data('colorPicker',selector.find('.miniColors-colorPicker'));input.data('mousebutton',0);$('BODY').append(selector);selector.fadeIn(100);selector.bind('selectstart',function(){return false;});$(document).bind('mousedown.miniColors',function(event){input.data('mousebutton',1);if($(event.target).parents().andSelf().hasClass('miniColors-colors')){event.preventDefault();input.data('moving','colors');moveColor(input,event);}
if($(event.target).parents().andSelf().hasClass('miniColors-hues')){event.preventDefault();input.data('moving','hues');moveHue(input,event);}
if($(event.target).parents().andSelf().hasClass('miniColors-selector')){event.preventDefault();return;}
if($(event.target).parents().andSelf().hasClass('miniColors'))return;hide(input);});$(document).bind('mouseup.miniColors',function(event){input.data('mousebutton',0);input.removeData('moving');});$(document).bind('mousemove.miniColors',function(event){if(input.data('mousebutton')===1){if(input.data('moving')==='colors')moveColor(input,event);if(input.data('moving')==='hues')moveHue(input,event);}});};var hide=function(input){if(!input)input='.miniColors';$(input).each(function(){var that=this;var selector=$(this).data('selector');$(this).removeData('selector');$(selector).fadeOut(100,function(){$(that).trigger('change');$(this).remove();});});$(document).unbind('mousedown.miniColors');$(document).unbind('mousemove.miniColors');};var moveColor=function(input,event){var colorPicker=input.data('colorPicker');colorPicker.hide();var position={x:event.clientX-input.data('selector').find('.miniColors-colors').offset().left+$(document).scrollLeft()-5,y:event.clientY-input.data('selector').find('.miniColors-colors').offset().top+$(document).scrollTop()-5};if(position.x<=-5)position.x=-5;if(position.x>=144)position.x=144;if(position.y<=-5)position.y=-5;if(position.y>=144)position.y=144;input.data('colorPosition',position);colorPicker.css('left',position.x).css('top',position.y).show();var s=Math.round((position.x+5)*.67);if(s<0)s=0;if(s>100)s=100;var b=100-Math.round((position.y+5)*.67);if(b<0)b=0;if(b>100)b=100;var hsb=input.data('hsb');hsb.s=s;hsb.b=b;setColor(input,hsb,true);};var moveHue=function(input,event){var huePicker=input.data('huePicker');huePicker.hide();var position={y:event.clientY-input.data('selector').find('.miniColors-colors').offset().top+$(document).scrollTop()-1};if(position.y<=-1)position.y=-1;if(position.y>=149)position.y=149;input.data('huePosition',position);huePicker.css('top',position.y).show();var h=Math.round((150-position.y-1)*2.4);if(h<0)h=0;if(h>360)h=360;var hsb=input.data('hsb');hsb.h=h;setColor(input,hsb,true);};var setColor=function(input,hsb,updateInputValue){input.data('hsb',hsb);var hex=hsb2hex(hsb);if(updateInputValue)input.val('#'+hex);input.data('trigger').css('backgroundColor','#'+hex);if(input.data('selector'))input.data('selector').find('.miniColors-colors').css('backgroundColor','#'+hsb2hex({h:hsb.h,s:100,b:100}));if(input.data('change')){input.data('change').call(input,'#'+hex,hsb2rgb(hsb));}};var setColorFromInput=function(input){var hex=cleanHex(input.val());if(!hex)return false;var hsb=hex2hsb(hex);var currentHSB=input.data('hsb');if(hsb.h===currentHSB.h&&hsb.s===currentHSB.s&&hsb.b===currentHSB.b)return true;var colorPosition=getColorPositionFromHSB(hsb);var colorPicker=$(input.data('colorPicker'));colorPicker.css('top',colorPosition.y+'px').css('left',colorPosition.x+'px');var huePosition=getHuePositionFromHSB(hsb);var huePicker=$(input.data('huePicker'));huePicker.css('top',huePosition.y+'px');setColor(input,hsb,false);return true;};var getColorPositionFromHSB=function(hsb){var x=Math.ceil(hsb.s/.67);if(x<0)x=0;if(x>150)x=150;var y=150-Math.ceil(hsb.b/.67);if(y<0)y=0;if(y>150)y=150;return{x:x-5,y:y-5};}
var getHuePositionFromHSB=function(hsb){var y=150-(hsb.h/2.4);if(y<0)h=0;if(y>150)h=150;return{y:y-1};}
var cleanHex=function(hex){hex=hex.replace(/[^A-Fa-f0-9]/,'');if(hex.length==3){hex=hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];}
return hex.length===6?hex:null;};var hsb2rgb=function(hsb){var rgb={};var h=Math.round(hsb.h);var s=Math.round(hsb.s*255/100);var v=Math.round(hsb.b*255/100);if(s==0){rgb.r=rgb.g=rgb.b=v;}else{var t1=v;var t2=(255-s)*v/255;var t3=(t1-t2)*(h%60)/60;if(h==360)h=0;if(h<60){rgb.r=t1;rgb.b=t2;rgb.g=t2+t3;}
else if(h<120){rgb.g=t1;rgb.b=t2;rgb.r=t1-t3;}
else if(h<180){rgb.g=t1;rgb.r=t2;rgb.b=t2+t3;}
else if(h<240){rgb.b=t1;rgb.r=t2;rgb.g=t1-t3;}
else if(h<300){rgb.b=t1;rgb.g=t2;rgb.r=t2+t3;}
else if(h<360){rgb.r=t1;rgb.g=t2;rgb.b=t1-t3;}
else{rgb.r=0;rgb.g=0;rgb.b=0;}}
return{r:Math.round(rgb.r),g:Math.round(rgb.g),b:Math.round(rgb.b)};};var rgb2hex=function(rgb){var hex=[rgb.r.toString(16),rgb.g.toString(16),rgb.b.toString(16)];$.each(hex,function(nr,val){if(val.length==1)hex[nr]='0'+val;});return hex.join('');};var hex2rgb=function(hex){var hex=parseInt(((hex.indexOf('#')>-1)?hex.substring(1):hex),16);return{r:hex>>16,g:(hex&0x00FF00)>>8,b:(hex&0x0000FF)};};var rgb2hsb=function(rgb){var hsb={h:0,s:0,b:0};var min=Math.min(rgb.r,rgb.g,rgb.b);var max=Math.max(rgb.r,rgb.g,rgb.b);var delta=max-min;hsb.b=max;hsb.s=max!=0?255*delta/max:0;if(hsb.s!=0){if(rgb.r==max){hsb.h=(rgb.g-rgb.b)/delta;}else if(rgb.g==max){hsb.h=2+(rgb.b-rgb.r)/delta;}else{hsb.h=4+(rgb.r-rgb.g)/delta;}}else{hsb.h=-1;}
hsb.h*=60;if(hsb.h<0){hsb.h+=360;}
hsb.s*=100/255;hsb.b*=100/255;return hsb;};var hex2hsb=function(hex){var hsb=rgb2hsb(hex2rgb(hex));if(hsb.s===0)hsb.h=360;return hsb;};var hsb2hex=function(hsb){return rgb2hex(hsb2rgb(hsb));};switch(o){case'readonly':$(this).each(function(){$(this).attr('readonly',data);});return $(this);break;case'disabled':$(this).each(function(){if(data){disable($(this));}else{enable($(this));}});return $(this);case'value':$(this).each(function(){$(this).val(data).trigger('keyup');});return $(this);break;case'destroy':$(this).each(function(){destroy($(this));});return $(this);default:if(!o)o={};$(this).each(function(){if($(this)[0].tagName.toLowerCase()!=='input')return;if($(this).data('trigger'))return;create($(this),o,data);});return $(this);}}});})(jQuery);

/*
 * zClip :: jQuery ZeroClipboard v1.1.1
 * http://steamdev.com/zclip
 *
 * Copyright 2011, SteamDev
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Wed Jun 01, 2011
 */
(function(a){a.fn.zclip=function(c){if(typeof c=="object"&&!c.length){var b=a.extend({path:"ZeroClipboard.swf",copy:null,beforeCopy:null,afterCopy:null,clickAfter:true,setHandCursor:true,setCSSEffects:true},c);return this.each(function(){var e=a(this);if(e.is(":visible")&&(typeof b.copy=="string"||a.isFunction(b.copy))){ZeroClipboard.setMoviePath(b.path);var d=new ZeroClipboard.Client();if(a.isFunction(b.copy)){e.bind("zClip_copy",b.copy)}if(a.isFunction(b.beforeCopy)){e.bind("zClip_beforeCopy",b.beforeCopy)}if(a.isFunction(b.afterCopy)){e.bind("zClip_afterCopy",b.afterCopy)}d.setHandCursor(b.setHandCursor);d.setCSSEffects(b.setCSSEffects);d.addEventListener("mouseOver",function(f){e.trigger("mouseenter")});d.addEventListener("mouseOut",function(f){e.trigger("mouseleave")});d.addEventListener("mouseDown",function(f){e.trigger("mousedown");if(!a.isFunction(b.copy)){d.setText(b.copy)}else{d.setText(e.triggerHandler("zClip_copy"))}if(a.isFunction(b.beforeCopy)){e.trigger("zClip_beforeCopy")}});d.addEventListener("complete",function(f,g){if(a.isFunction(b.afterCopy)){e.trigger("zClip_afterCopy", f, g)}else{if(g.length>500){g=g.substr(0,500)+"...\n\n("+(g.length-500)+" characters not shown)"}e.removeClass("hover");alert("Copied text to clipboard:\n\n "+g)}if(b.clickAfter){e.trigger("click")}});d.glue(e[0],e.parent()[0]);a(window).bind("load resize",function(){d.reposition()})}})}else{if(typeof c=="string"){return this.each(function(){var f=a(this);c=c.toLowerCase();var e=f.data("zclipId");var d=a("#"+e+".zclip");if(c=="remove"){d.remove();f.removeClass("active hover")}else{if(c=="hide"){d.hide();f.removeClass("active hover")}else{if(c=="show"){d.show()}}}})}}}})(jQuery);var ZeroClipboard={version:"1.0.7",clients:{},moviePath:"ZeroClipboard.swf",nextId:1,$:function(a){if(typeof(a)=="string"){a=document.getElementById(a)}if(!a.addClass){a.hide=function(){this.style.display="none"};a.show=function(){this.style.display=""};a.addClass=function(b){this.removeClass(b);this.className+=" "+b};a.removeClass=function(d){var e=this.className.split(/\s+/);var b=-1;for(var c=0;c<e.length;c++){if(e[c]==d){b=c;c=e.length}}if(b>-1){e.splice(b,1);this.className=e.join(" ")}return this};a.hasClass=function(b){return !!this.className.match(new RegExp("\\s*"+b+"\\s*"))}}return a},setMoviePath:function(a){this.moviePath=a},dispatch:function(d,b,c){var a=this.clients[d];if(a){a.receiveEvent(b,c)}},register:function(b,a){this.clients[b]=a},getDOMObjectPosition:function(c,a){var b={left:0,top:0,width:c.width?c.width:c.offsetWidth,height:c.height?c.height:c.offsetHeight};if(c&&(c!=a)){b.left+=c.offsetLeft;b.top+=c.offsetTop}return b},Client:function(a){this.handlers={};this.id=ZeroClipboard.nextId++;this.movieId="ZeroClipboardMovie_"+this.id;ZeroClipboard.register(this.id,this);if(a){this.glue(a)}}};ZeroClipboard.Client.prototype={id:0,ready:false,movie:null,clipText:"",handCursorEnabled:true,cssEffects:true,handlers:null,glue:function(d,b,e){this.domElement=ZeroClipboard.$(d);var f=99;if(this.domElement.style.zIndex){f=parseInt(this.domElement.style.zIndex,10)+1}if(typeof(b)=="string"){b=ZeroClipboard.$(b)}else{if(typeof(b)=="undefined"){b=document.getElementsByTagName("body")[0]}}var c=ZeroClipboard.getDOMObjectPosition(this.domElement,b);this.div=document.createElement("div");this.div.className="zclip";this.div.id="zclip-"+this.movieId;$(this.domElement).data("zclipId","zclip-"+this.movieId);var a=this.div.style;a.position="absolute";a.left=""+c.left+"px";a.top=""+c.top+"px";a.width=""+c.width+"px";a.height=""+c.height+"px";a.zIndex=f;if(typeof(e)=="object"){for(addedStyle in e){a[addedStyle]=e[addedStyle]}}b.appendChild(this.div);this.div.innerHTML=this.getHTML(c.width,c.height)},getHTML:function(d,a){var c="";var b="id="+this.id+"&width="+d+"&height="+a;if(navigator.userAgent.match(/MSIE/)){var e=location.href.match(/^https/i)?"https://":"http://";c+='<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+e+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+d+'" height="'+a+'" id="'+this.movieId+'" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+b+'"/><param name="wmode" value="transparent"/></object>'}else{c+='<embed id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+d+'" height="'+a+'" name="'+this.movieId+'" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+b+'" wmode="transparent" />'}return c},hide:function(){if(this.div){this.div.style.left="-2000px"}},show:function(){this.reposition()},destroy:function(){if(this.domElement&&this.div){this.hide();this.div.innerHTML="";var a=document.getElementsByTagName("body")[0];try{a.removeChild(this.div)}catch(b){}this.domElement=null;this.div=null}},reposition:function(c){if(c){this.domElement=ZeroClipboard.$(c);if(!this.domElement){this.hide()}}if(this.domElement&&this.div){var b=ZeroClipboard.getDOMObjectPosition(this.domElement);var a=this.div.style;a.left=""+b.left+"px";a.top=""+b.top+"px"}},setText:function(a){this.clipText=a;if(this.ready){this.movie.setText(a)}},addEventListener:function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");if(!this.handlers[a]){this.handlers[a]=[]}this.handlers[a].push(b)},setHandCursor:function(a){this.handCursorEnabled=a;if(this.ready){this.movie.setHandCursor(a)}},setCSSEffects:function(a){this.cssEffects=!!a},receiveEvent:function(d,f){d=d.toString().toLowerCase().replace(/^on/,"");switch(d){case"load":this.movie=document.getElementById(this.movieId);if(!this.movie){var c=this;setTimeout(function(){c.receiveEvent("load",null)},1);return}if(!this.ready&&navigator.userAgent.match(/Firefox/)&&navigator.userAgent.match(/Windows/)){var c=this;setTimeout(function(){c.receiveEvent("load",null)},100);this.ready=true;return}this.ready=true;try{this.movie.setText(this.clipText)}catch(h){}try{this.movie.setHandCursor(this.handCursorEnabled)}catch(h){}break;case"mouseover":if(this.domElement&&this.cssEffects){this.domElement.addClass("hover");$(this.domElement).trigger('hover');if(this.recoverActive){this.domElement.addClass("active")}}break;case"mouseout":if(this.domElement&&this.cssEffects){this.recoverActive=false;if(this.domElement.hasClass("active")){this.domElement.removeClass("active");this.recoverActive=true}this.domElement.removeClass("hover")}break;case"mousedown":if(this.domElement&&this.cssEffects){this.domElement.addClass("active")}break;case"mouseup":if(this.domElement&&this.cssEffects){this.domElement.removeClass("active");this.recoverActive=false}break}if(this.handlers[d]){for(var b=0,a=this.handlers[d].length;b<a;b++){var g=this.handlers[d][b];if(typeof(g)=="function"){g(this,f)}else{if((typeof(g)=="object")&&(g.length==2)){g[0][g[1]](this,f)}else{if(typeof(g)=="string"){window[g](this,f)}}}}}}};

(function($) {
    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g; // Regex for replacing addition symbol with a space
    var decode = function (str) { return decodeURIComponent( str.replace(decodeRE, " ") ); };
    $.parseParams = function(query) {
        var params = {}, e;
        while ( e = re.exec(query) ) params[ decode(e[1]) ] = decode( e[2] );
        return params;
    };
})(jQuery);

var Docs = {

    init: function() {
        $('form.config').bind('submit', function(e) {
            $(this).hide('slow');
            e.preventDefault();
            return false;
        });
        //$('form.config button.close').click('closeParentForm');
        $('#copyToClipboard').parent().each(function(){
            $(this).css('position', 'relative');
        });
        $('#copyToClipboard').zclip({
            path: '/workbenchResources/js/clipboard.swf',
            setHandCursor: true,
            copy: function() {
                return $('#showStylesContainer').html().replace(/(<br>)|(<br\/>)|(<br \/>)/g, "\r\n").replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            },
            afterCopy: function() {
                $this = $(this);
                if (!$this.hasClass('succes')) {
                    $this.addClass('succes');
                }
            }
        });

        var forms = $('form.formtastic').hide();
        $('.togglers li').show().children('a').click(function(evt) {
            forms.filter(':not(#' +$(this).attr('rel') + ')').hide();
            $('#' + $(this).attr('rel')).toggle('slow');
            return false;
        });

        $('a.addInputField').live('click', function(evt) {
            evt.preventDefault();
            var $cur = $(evt.currentTarget);
            $cur.parents('tr').find('a.removeInputField').show();
            var $elm = $cur.closest('tr');
            $elm.after($elm.clone());
            return $elm;
        });
        $('a.removeInputField').live('click', function(evt) {
            evt.preventDefault();
            var $cur = $(evt.currentTarget);
            var $anchorSiblings = $cur.closest('table').find('a[rel="' + $cur.attr('rel') + '"]');
            $anchorSiblings.show();
            if (1 >= ($anchorSiblings.length - 1)) {
                $anchorSiblings.hide();
            }
            $cur.parents('tr').remove();
        });

        var queries = [
           '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li div.heading ul.options li a',
           '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li div.content h4',
           '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li div.content div.sandbox_header a',
           '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li h3 span.http_method a',
           '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li div.content',
           '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li div.heading',
           '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li a.expandBody',
           'a.miniColors-trigger'
        ];
        queries = queries.join(', ');
        $('#resetStyles').click(function() {
            //Remove all the styles from styled elements
            $(queries).css({
                'backgroundColor': '',
                'borderColor': '',
                'color': ''
            });
            //Clear the output CSS container
            $('#showStylesContainer').html('');
            $('#copyToClipboard').removeClass('succes');
        });

        var elms = $('.expandBody');
        elms.data('open', false);
        $('.sandbox_header .submit').click(function() {
            elms.data('open', false).html('Full');
        });
        elms.click(function() {
            $this = $(this);
            $this.data('open', !$this.data('open'));
            $ref = $this.parents('div.response').find('.response_body pre');
            if (!$ref.data('maxHeight')) {
                var max = $ref.css('maxHeight');
                if ('' === max || 'none' === max) {
                    max = '300px';
                }
                $ref.data('maxHeight', max);
            }
            $ref.css('maxHeight', $ref.data('maxHeight'));

            var openClose = 'Full';
            if ($this.data('open')) {
                openClose = 'Small';
                $ref.css('maxHeight', '100%');
            }
            $this.html(openClose);
            return false;
        });

        $('#showStyles').click(function() {
            $('#showStylesContainer').toggle('slow');
            return false;
        });
        $('input.color').miniColors();

        this.shebang();
        //Work through the open and closed settings
        var open = $.cookie('explicitlyOpenTogglables') || [];
        if (-1 != document.location.hash.search(/#!\/([^\?]+)/)) {
            var hashBangId = document.location.hash.match(/#!\/([^\?]+)/)[1];
            open[hashBangId] = hashBangId;
        }
        var closed = $.cookie('explicitlyClosedTogglables') || [];
        var elm = null;
        for (id in open) {
            if (0 < id.length) {
                elm = $('#' + id);
                this.expandOperation(elm);
            }
        }
        for (id in closed) {
            if (0 < id.length) {
                this.collapseEndpointListForResource(id.replace('resource_', ''));
            }
        }
        if (elm instanceof jQuery) {
            setTimeout(function() {
                $.scrollTo(elm.parent('li'), 800, {offset: {left: 0, top: -8}});
            }, 800);
        }
        $('form .api-host').change(function(evt) {
            $('.api-host').not($(this)).html(this.value);
        });
        $('.closeAll').click(function(evt) {
            evt.preventDefault();
            $('#resources>li').each(function() {
                Docs.collapseEndpointListForResource($(this).attr('id').split('_')[1] || '');
            });
            return false;
        });
        $('.openAll').click(function(evt) {
            evt.preventDefault();
            $('#resources>li').each(function() {
                Docs.expandEndpointListForResource($(this).attr('id').split('_')[1] || '', false);
            });
            return false;
        });
    },

    shebang: function() {
        // If shebang has an operation nickname in it..
        // e.g. /docs/#!/words/get_search
        var fragments = $.param.fragment();
        fragments = fragments.split('?');
        var queryValues = [];
        if (fragments[1]) {
            queryValues = fragments[1].split('&');
        }
        fragments = fragments[0];
        if (fragments.length) {
            var $parentList = $('a[href="#' + fragments + '"]').first().parents('li').first();
            $.scrollTo($parentList, 800, {top: -10});
            var id = $parentList.attr('id');
            if (0 === id.indexOf('resource')) {
                Docs.expandEndpointListForResource(id.replace('resource_', ''));
            } else {
                var $div = $('#' + id + '>div');
                Docs.expandOperation($div);
                var $form = $div.find('form');
                for (i in queryValues) {
                    var key = queryValues[i].split('=');
                    var value = key[1];
                    key = decodeURIComponent(key[0]);
                    var elm = $form.find('input[name="' + key + '"]').last();
                    if (-1 != key.match('][]')) {
                        elm.parents('tr').find('a.addInputField').first().click();
                    }
                    elm.val(value);
                }
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
    expandEndpointListForResource: function(resource, scroll) {
        if (undefined == scroll) {
            scroll = true;
        }
        var resource = $('#resource_' + resource);
        var entries = resource.children('ul.endpoints');

        resource.addClass('active');
        entries.slideDown();
        $.removeSubCookie('explicitlyClosedTogglables', resource.attr('id'));
        $.cookie('explicitlyClosedTogglables');
        if (scroll) {
            $.scrollTo(entries.siblings('.heading'), 800, {offset: {left: 0, top: 4}});
        }
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
        elem.parents('ul.endpoints').slideDown();
        elem.removeClass('hidden');
        elem.slideDown();
        $.setSubCookie('explicitlyOpenTogglables', elem.attr('id'), true);
    },

    collapseOperation: function(elem) {
        elem.slideUp();
        elem.addClass('hidden');
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

$(function() {
     //Must be first!
     Docs.init();
     $('#oauth').hide();
     $("#colorchange").change(function(evt) {
         $('#copyToClipboard').removeClass('succes');
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
                 var fontColor = $form.find('#fontColor').attr('value');
                 $form.find('#styleMethod option').each(function(elm) {
                     methods.push(this.value);
                 });
                 if (!$form.find('#styleAll').attr('checked')) {
                     active = $form.find('#styleMethod').attr('value');
                 }

                 var count = 1;
                 for (i in methods) {
                     var method = methods[i];

                     var queries = [
                         '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.heading ul.options li a',
                         '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.content h4',
                         '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.content div.sandbox_header a',
                         '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' a.expandBody'
                     ];
                     queries = queries.join(', ');

                     val = '';
                     if (response[100] && (null === active || active === method)) {
                         val = response[100].hex;
                         foo += '/** ' + method.toUpperCase() + ' override **/<br/>';
                         foo += queries + ' { color: ' + response[100].hex + '; }';
                     }
                     $(queries).css('color', val);

                     queries = [
                         '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' h3 span.http_method a'
                     ];
                     queries = queries.join(', ');
                     val = {
                         'backgroundColor': '',
                         'color': '',
                     };
                     var cssString = '';
                     if (response[100] && (null === active || active === method)) {
                         cssString += 'background-color: ' + response[100].hex + ';';
                         val.backgroundColor = response[100].hex;
                     }
                     if (fontColor && (null === active || active === method)) {
                         val.color = fontColor;
                         cssString += ' color: ' + fontColor + ';';
                     }
                     if (cssString.length) {
                         foo += "<br/>" + queries + ' { ' + cssString + ' }';
                     }
                     $(queries).css(val);

                     queries = [
                          '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.content',
                          '#content ul#resources li.resource ul.endpoints li.endpoint ul.operations li.' + method + ' div.heading'
                     ];
                     queries = queries.join(', ');
                     val = {
                         'backgroundColor': '',
                         'borderColor': ''
                     };
                     if (response[100] && (null === active || active === method)) {
                         val = {
                             'backgroundColor': response[10].hex,
                             'borderColor': response[25].hex
                         };
                         foo += "<br/>" + queries + ' { background-color: ' + response[10].hex + '; border-color: ' + response[25].hex + '; }';
                         if (methods.length != count) {
                             foo += '<br/><br/>';
                         }
                     }
                     $(queries).css(val);
                     ++count;
                 }
                 $('#showStylesContainer').html(foo);
             },
             error: function (xhr, status, error) { }
         });
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
         var accept = $(evt.target).parents('table').find('.accept');
         switch (accept[0].nodeName.toLowerCase()) {
             case 'select':
                 $(accept).find('option').each(function(index, elm) {
                     var $elm = $(elm),
                         value = $elm.val().replace(/(\+[a-z]+)/, '+' + evt.target.value);
                     $elm.val(value).html(value);
                 });
                 break;
             case 'input':
                 accept.val(accept.val().replace(/(\+[a-z]+)/, '+' + evt.target.value));
                 break;
         }
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
                 data = data.concat($('#misc').serializeArray());
                 $throbber.show();
                 $this.siblings('div.response').css('opacity', '0.1');
                 var startTime = new Date();
                 $.ajax({
                     url: url,
                     data: data,
                     dataType: dataType,
                     type: method.toUpperCase(),
                     beforeSend: function (xhr) {
                        var elements = $(el).find('*[name^="params"][value!=""], *[name^="query"][value!=""], *[name^="core"]');
                        elements = elements.filter(function(k, v) {
                            var attr = $(v).attr('name');
                            if ('core[path]' === attr) {
                                return null;
                            }
                            if ('core[http_method]' === attr) {
                                return null;
                            }
                            return v;
                        });
                        elements = elements.serialize();
                        document.location.hash = '#!/' + el.parent('div').attr('id') + '?' + elements;
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
                         $this.parent('div.content').find('div.response a.ref').click(function(evt) {
                             var href = this.href;
                             //Take of the querystring, not needed for URL comparison
                             var link = href.split('?')[0];
                             //Remove the host from the URL
                             var check = link.replace($('#misc-host').val(), '');
                             //Make array from string with / as separator
                             link = check.split('/');
                             var found = false;
                             $('li.get input[name="core[path]"]').each(function(index) {
                                 if (found) {
                                     //Skip remaining entries
                                     return;
                                 }
                                 //Make array from string with / as separator
                                 var split = this.value.split('/');
                                 //Start with a URL
                                 var url = '/';
                                 //Prepare dynamic parts
                                 var dynamic = {};
                                 for (i in link) {
                                     //Skip empty entries and first matches
                                     if ((0 == i && '' == link[i]) || (1 == i && link[i] != split[i])) {
                                         //Do not use return as this will break everything!
                                         continue;
                                     }
                                     if (link[i] == split[i] && link[i] != '') {
                                         url += link[i];
                                     } else if (split[i] && 0 == split[i].indexOf('{')) {
                                         var key = split[i].replace('{', '');
                                         key = key.replace('}', '');
                                         dynamic[key] = link[i];
                                         url += link[i];
                                     }
                                     //Only add trailing slashes if we have items left
                                     if (i < link.length) {
                                         url += '/';
                                     }
                                 }
                                 //Trim the URL
                                 url = url.substring(0, url.length - 1);
                                 if (check == url) {
                                     //Fetch the currently matched URL parent its form
                                     var $form = $(this).parents('form');
                                     //Fill in the dynamics
                                     for (a in dynamic) {
                                         $form.find('input.' + a).val(dynamic[a]);
                                     }
                                     var query = $.parseParams(href.split('?')[1] || '');
                                     //Fill in the query params
                                     for (b in query) {
                                         $form.find('input.' + b).val(query[b]);
                                     }
                                     //Find matching list item
                                     var listitem = $form.parents('li.operation');
                                     //Fix hash
                                     document.location.hash = '#!/' + listitem.find('div.content').attr('id');
                                     //???
                                     Docs.shebang();
                                     //Scroll to the item
                                     $.scrollTo(listitem, 800, {offset: {left: 0, top: -8}});
                                     //Submit the form
                                     $form.submit();
                                     //Done!
                                     found = true;
                                 }
                             });
                             evt.preventDefault();
                             return false;
                         });
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
     $('form.sandbox').live('submit.rails', function (e) {
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
