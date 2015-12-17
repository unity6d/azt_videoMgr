define("arale/widget/1.1.1/widget",["arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","$","./daparser","./auto-render"],function(a,b,c){function d(){return"widget-"+w++}function e(a){return"[object String]"===v.call(a)}function f(a){return"[object Function]"===v.call(a)}function g(a){return x(document.documentElement,a)}function h(a){return a.charAt(0).toUpperCase()+a.substring(1)}function i(a){return f(a.events)&&(a.events=a.events()),a.events}function j(a,b){var c=a.match(y),d=c[1]+q+b.cid,e=c[2]||void 0;return e&&e.indexOf("{{")>-1&&(e=k(e,b)),{type:d,selector:e}}function k(a,b){return a.replace(z,function(a,c){for(var d,f=c.split("."),g=b;d=f.shift();)g=g===b.attrs?b.get(d):g[d];return e(g)?g:A})}function l(a){return null==a||void 0===a}var m=a("arale/base/1.1.1/base"),n=a("$"),o=a("./daparser"),p=a("./auto-render"),q=".delegate-events-",r="_onRender",s="data-widget-cid",t={},u=m.extend({propsInAttrs:["initElement","element","events"],element:null,events:null,attrs:{id:null,className:null,style:null,template:"<div></div>",model:null,parentNode:document.body},initialize:function(a){this.cid=d();var b=this._parseDataAttrsConfig(a);u.superclass.initialize.call(this,a?n.extend(b,a):b),this.parseElement(),this.initProps(),this.delegateEvents(),this.setup(),this._stamp(),this._isTemplate=!(a&&a.element)},_parseDataAttrsConfig:function(a){var b,c;return a&&(b=n(a.initElement?a.initElement:a.element)),b&&b[0]&&!p.isDataApiOff(b)&&(c=o.parseElement(b)),c},parseElement:function(){var a=this.element;if(a?this.element=n(a):this.get("template")&&this.parseElementFromTemplate(),!this.element||!this.element[0])throw new Error("element is invalid")},parseElementFromTemplate:function(){this.element=n(this.get("template"))},initProps:function(){},delegateEvents:function(a,b,c){if(0===arguments.length?(b=i(this),a=this.element):1===arguments.length?(b=a,a=this.element):2===arguments.length?(c=b,b=a,a=this.element):(a||(a=this.element),this._delegateElements||(this._delegateElements=[]),this._delegateElements.push(n(a))),e(b)&&f(c)){var d={};d[b]=c,b=d}for(var g in b)if(b.hasOwnProperty(g)){var h=j(g,this),k=h.type,l=h.selector;!function(b,c){var d=function(a){f(b)?b.call(c,a):c[b](a)};l?n(a).on(k,l,d):n(a).on(k,d)}(b[g],this)}return this},undelegateEvents:function(a,b){if(b||(b=a,a=null),0===arguments.length){var c=q+this.cid;if(this.element&&this.element.off(c),this._delegateElements)for(var d in this._delegateElements)this._delegateElements.hasOwnProperty(d)&&this._delegateElements[d].off(c)}else{var e=j(b,this);a?n(a).off(e.type,e.selector):this.element&&this.element.off(e.type,e.selector)}return this},setup:function(){},render:function(){this.rendered||(this._renderAndBindAttrs(),this.rendered=!0);var a=this.get("parentNode");if(a&&!g(this.element[0])){var b=this.constructor.outerBoxClass;if(b){var c=this._outerBox=n("<div></div>").addClass(b);c.append(this.element).appendTo(a)}else this.element.appendTo(a)}return this},_renderAndBindAttrs:function(){var a=this,b=a.attrs;for(var c in b)if(b.hasOwnProperty(c)){var d=r+h(c);if(this[d]){var e=this.get(c);l(e)||this[d](e,void 0,c),function(b){a.on("change:"+c,function(c,d,e){a[b](c,d,e)})}(d)}}},_onRenderId:function(a){this.element.attr("id",a)},_onRenderClassName:function(a){this.element.addClass(a)},_onRenderStyle:function(a){this.element.css(a)},_stamp:function(){var a=this.cid;(this.initElement||this.element).attr(s,a),t[a]=this},$:function(a){return this.element.find(a)},destroy:function(){this.undelegateEvents(),delete t[this.cid],this.element&&this._isTemplate&&(this.element.off(),this._outerBox?this._outerBox.remove():this.element.remove()),this.element=null,u.superclass.destroy.call(this)}});n(window).unload(function(){for(var a in t)t[a].destroy()}),u.query=function(a){var b,c=n(a).eq(0);return c&&(b=c.attr(s)),t[b]},u.autoRender=p.autoRender,u.autoRenderAll=p.autoRenderAll,u.StaticsWhiteList=["autoRender"],c.exports=u;var v=Object.prototype.toString,w=0,x=n.contains||function(a,b){return!!(16&a.compareDocumentPosition(b))},y=/^(\S+)\s*(.*)$/,z=/{{([^}]+)}}/g,A="INVALID_SELECTOR"}),define("arale/widget/1.1.1/daparser",["$"],function(a,b){function c(a){return a.toLowerCase().replace(g,function(a,b){return(b+"").toUpperCase()})}function d(a){for(var b in a)if(a.hasOwnProperty(b)){var c=a[b];if("string"!=typeof c)continue;h.test(c)?(c=c.replace(/'/g,'"'),a[b]=d(i(c))):a[b]=e(c)}return a}function e(a){if("false"===a.toLowerCase())a=!1;else if("true"===a.toLowerCase())a=!0;else if(/\d/.test(a)&&/[^a-z]/i.test(a)){var b=parseFloat(a);b+""===a&&(a=b)}return a}var f=a("$");b.parseElement=function(a,b){a=f(a)[0];var e={};if(a.dataset)e=f.extend({},a.dataset);else for(var g=a.attributes,h=0,i=g.length;i>h;h++){var j=g[h],k=j.name;0===k.indexOf("data-")&&(k=c(k.substring(5)),e[k]=j.value)}return b===!0?e:d(e)};var g=/-([a-z])/g,h=/^\s*[\[{].*[\]}]\s*$/,i=this.JSON?JSON.parse:f.parseJSON}),define("arale/widget/1.1.1/auto-render",["$"],function(a,b){var c=a("$"),d="data-widget-auto-rendered";b.autoRender=function(a){return new this(a).render()},b.autoRenderAll=function(a,e){"function"==typeof a&&(e=a,a=null),a=c(a||document.body);var f=[],g=[];a.find("[data-widget]").each(function(a,c){b.isDataApiOff(c)||(f.push(c.getAttribute("data-widget").toLowerCase()),g.push(c))}),f.length&&seajs.use(f,function(){for(var a=0;a<arguments.length;a++){var b=arguments[a],f=c(g[a]);if(!f.attr(d)){var h={initElement:f,renderType:"auto"},i=f.attr("data-widget-role");h[i?i:"element"]=f,b.autoRender&&b.autoRender(h),f.attr(d,"true")}}e&&e()})};var e="off"===c(document.body).attr("data-api");b.isDataApiOff=function(a){var b=c(a).attr("data-api");return"off"===b||"on"!==b&&e}});