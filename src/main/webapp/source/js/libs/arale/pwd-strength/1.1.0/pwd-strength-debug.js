define("arale/pwd-strength/1.1.0/pwd-strength",["arale/widget/1.1.1/widget","$","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","./pwd-strength.css","./pwd-strength.tpl"],function(a,b,c){var d=a("arale/widget/1.1.1/widget"),e=a("$");a("./pwd-strength.css");var f=d.extend({lowLevelText:"建议您使用英文、数字混合的密码并增加长度。",midLevelText:"您可以使用英文大小写、数字、符号混合的密码，提高安全程度。",highLevelText:"请牢记您的密码。",M_STR:{UPPER:"ABCDEFGHIJKLMNOPQRSTUVWXYZ",LOWER:"abcdefghijklmnopqrstuvwxyz",NUMBER:"0123456789",CHARACTER:"!@#$%^&*?_~/\\(){}[]<> . -+=|,"},levelExplainMap:{low:"低",mid:"中",high:"高"},attrs:{triggerEvents:[],hideEvent:"",needTrim:!1,showElement:"showElement",barTemplate:a("./pwd-strength-debug.tpl")},currentStat:"",events:{},initAttrs:function(a){f.superclass.initAttrs.call(this,a);for(var b=this.get("triggerEvents"),c=this.get("hideEvent"),d=0;d<b.length;d++){var e=b[d];this.events[e]="analyzeElement"}c&&(this.events[c]="hide")},getPassword:function(a){return this.get("needTrim")&&(a=a.replace(/^\s*/,"")),a},hide:function(){this.getShowElement_().css("display","none")},show:function(){this.getShowElement_().css("display","block")},getShowElement_:function(){return e("#"+this.get("showElement"))},analyze:function(a){var b=this.getPassword(a),c=this.getScore(b),d=b&&this.levelCalcAlgorithm(c),e={score:c,level:d,msg:this.getMsgByLevel(d)};return this.showPwdLevel(d),e},analyzeElement:function(){this.analyze(this.element[0].value)},showPwdLevel:function(a){this.createPwdLevelBar(),this.pwdLevelBar&&(this.currentStat&&this.pwdLevelBar.removeClass("ui-pwd-strength-"+this.currentStat),a&&this.pwdLevelBar.addClass("ui-pwd-strength-"+a),this.pwdLevelBarExplain[0].innerHTML=this.levelExplainMap[a],this.currentStat=a,this.show())},createPwdLevelBar:function(){var a=this.getShowElement_();a.length&&!a.find(".ui-pwd-strength").length&&(a.append(this.get("barTemplate")),this.pwdLevelBar=a.find(".ui-pwd-strength"),this.pwdLevelBarExplain=a.find(".ui-pwd-strength-word"))},getMsgByLevel:function(a){return this[a+"LevelText"]},getLevel:function(a){a=this.getPassword(a);var b=this.getScore(a);return this.levelCalcAlgorithm(b)},levelCalcAlgorithm:function(a){return a>45?"high":a>25?"mid":"low"},getScore:function(a){if(a=this.getPassword(a)){var b=0;6===a.length?b+=6:a.length>=7&&a.length<=8?b+=8:a.length>=9&&a.length<=10?b+=12:a.length>10&&(b+=18);var c=this._countContain(a,this.M_STR.UPPER),d=this._countContain(a,this.M_STR.LOWER);0!==d&&(b+=1),0!==c&&(b+=5);var e=this._countContain(a,this.M_STR.NUMBER);0!==e&&(b+=5),e>=3&&(b+=7);var f=this._countContain(a,this.M_STR.CHARACTER),g=this._countContain(a.charAt(0),this.M_STR.CHARACTER);return 1!==f||g||(b+=5),f>1&&(b+=12),0!=c&&0!=d&&(b+=2),0==c&&0==d||0==e||(b+=3),0==c&&0==d&&0==e||0==f||(b+=3),b}},_countContain:function(a,b){var c=0;for(i=0;i<a.length;i++)b.indexOf(a.charAt(i))>-1&&c++;return c},_ESC_DATA:"! \\ / . $ * ^ ( ) [ ] { } ? + - |".split(" "),toEsc:function(a){for(var b=this._ESC_DATA,c=0,d=b.length;d>c;c++)a=a.replace(new RegExp("\\"+b[c],"g"),"\\"+b[c]);return a}});c.exports=f});