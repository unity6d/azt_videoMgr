define(function(a){function b(a){var b=a.getFullYear(),c=a.getMonth()+1,d=a.getDate();return b+"-"+(10>c?"0"+c:c)+"-"+(10>d?"0"+d:d)}function c(a){var b=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),e=a.getHours(),f=a.getMinutes();return b+"-"+(10>c?"0"+c:c)+"-"+(10>d?"0"+d:d)+" "+(10>e?"0"+e:e)+":"+(10>f?"0"+f:f)}function d(){r=new Date(t.getTime());var a=new Date(t.getTime());a.setMonth(a.getMonth()+2),s=new Date(a.getTime()-864e5),u("#CalendarLeft thead tr th").eq(1).html(b(r).substring(0,7)),u("#CalendarRight thead tr th").eq(0).html(b(s).substring(0,7))}function e(){var a=u("#CalendarLeft tbody tr").empty(),b=u("#CalendarRight tbody tr").empty(),c=-1,d=new Date(r.getTime()),e=d.getDay();e=0==e?7:e,d.setMonth(d.getMonth()+1);var f=new Date(d.getTime()-864e5).getDay();f=0==f?7:f,d=new Date(s.getTime());var g=d.getDay();g=0==g?7:g,d.setMonth(d.getMonth(),1);var h=new Date(d.getTime()),i=h.getDay();i=0==i?7:i;for(var k=0,l=0,m=0;42>m;m++){m%7==0&&c++;var n=new Date(r.getTime()+864e5*k);e-1>m||n.getMonth()>r.getMonth()?a.eq(c).append("<td class='null'>&nbsp;</td>"):(a.eq(c).append(j(1,1,n,0)),k++),n=new Date(h.getTime()+864e5*l),i-1>m||n.getMonth()>s.getMonth()?b.eq(c).append("<td class='null'>&nbsp;</td>"):(b.eq(c).append(j(1,1,n,0)),l++)}w.showPartail()}function f(){var a=u("#campaignId").val();u.getJSON("CampaignPartialDate.html?campaignId="+a+"&_t="+(new Date).getTime(),function(a){var b=new Date;b.setHours(0,0,0,0);for(var c=0;c<a.length;c++){var d=new Date(a[c].start.replace(new RegExp("-","gm"),"/")),e=new Date(a[c].end.replace(new RegExp("-","gm"),"/"));b>d&&(d=b),e>b&&w.addPartail(w.getSize(),new m(d,e))}if(w.isEmpty()){var f=b,g=new Date(b.getTime()+25056e5);g.setHours(23,59,0,0),w.addPartail(w.getSize(),new m(f,g))}w.showPartail()})}function g(){void 0==r&&void 0==s&&void 0==t&&(t=new Date,t.setMonth(t.getMonth(),1),d()),u.getJSON("GetMediaBuyAdspaceScheduleBlock.json",{start:b(r),end:b(s),isFirst:v,_t:(new Date).getTime()},function(a){if(a.block.length>0){var b=a.block[0];i(b.scheduleblock.adspacecolor),h(b.scheduleblock.partialdate),v&&0==b.scheduleblock.partialdate.length&&f()}else e();v=0,u("#selectall-checkbox").prop("checked",!1)})}function h(a){for(var b in a){var c=new Date(a[b].start.replace(new RegExp("-","gm"),"/")),d=new Date(a[b].end.replace(new RegExp("-","gm"),"/")),e=new m(c,d);w.addPartail(w.getSize(),e)}w.showPartail()}function i(a){for(var b=u("#CalendarLeft tbody tr").empty(),c=u("#CalendarRight tbody tr").empty(),d=-1,e=0;e<a.length;e++){var f=new Date(a[e].date.replace(new RegExp("-","mg"),"/")),g=new Date(f.getTime()+864e5),h=f.getDay();if(h=0==h?7:h,1==f.getDate()&&(d=0),1!=f.getDate()&&1==h&&d++,1==f.getDate())for(var i=0;h-1>i;i++)f.getMonth()==t.getMonth()?b.eq(d).append("<td class='null'>&nbsp;</td>"):c.eq(d).append("<td class='null'>&nbsp;</td>");if(f.getMonth()==t.getMonth()?b.eq(d).append(j(a[e].color,a[e].status,f)):c.eq(d).append(j(a[e].color,a[e].status,f)),1==g.getDate())for(var k=7*(5-d)+(7-h),i=0;k>i;i++)f.getMonth()==t.getMonth()?(7==b.eq(d).find("td").length&&d++,b.eq(d).append("<td class='null'>&nbsp;</td>"),7==b.eq(d).find("td").length&&d++):(7==c.eq(d).find("td").length&&d++,c.eq(d).append("<td class='null'>&nbsp;</td>"),7==c.eq(d).find("td").length&&d++,7==c.eq(d).find("td").length&&d++)}}function j(a,b,c){var d,e=new Date((new Date).setHours(0,0,0,0));d=1==a?"available":2==a?"allsell available":"somesell available";var f="";c.getTime()<e.getTime()&&d.indexOf("disabled")<0&&(d+=" disabled"),9==b&&(x=!1,f+=" noborder"),8==b&&(f+=" noborder");var g=u('<td class="'+d+'"><a><i class="glyphicon '+f+'"></i>'+c.getDate()+"</a></td>");if(g.data("date",c),!g.hasClass("null")&&!g.hasClass("disabled")&&!g.hasClass("allsell")&&(g.on("click",function(){var a=u(this).data("date");a.setHours(0),a.setMinutes(0);var b=new Date(a);a.setHours(23),a.setMinutes(59);var c=new Date(a);u(this).hasClass("active")?w.Delete(new Date(b.getTime()-6e4),new Date(c.getTime()+6e4)):w.Add(b,c,6e4),w.showPartail()}),g.hasClass("allsell")&&"3"==u("#txtToufangType").val())){var h=c;h.setHours(0),h.setMinutes(0);var i=new Date(h);h.setHours(23),h.setMinutes(59);var j=new Date(h);w.Delete(new Date(i.getTime()-6e4),new Date(j.getTime()+6e4)),g.children().children().addClass("noborder")}return g}function k(){t=new Date(new Date(r.getTime()-864e5)),t.setMonth(t.getMonth(),1),d(),g()}function l(){t=new Date(new Date(s.getTime()+864e5)),t.setMonth(t.getMonth()-1,1),d(),g()}function m(a,b){this.edit(a,b)}function n(){this.partials=new Array,this.current=-1}function o(a){y=u(a);var b=y.parent().prev().prev().prev().html(),c=y.parent().prev().prev().html(),d=new Date(b.replace(new RegExp("-","mg"),"/")),e=new Date(c.replace(new RegExp("-","mg"),"/")),f=new m(d,e);w.deletePartail(w.indexOf(f)),w.showPartail()}function p(a){u("#j-DateView tbody td").each(function(){if(!u(this).hasClass("disabled")&&!u(this).hasClass("null")&&!u(this).hasClass("allsell")){var b=u(this).data("date");b.setHours(0),b.setMinutes(0),b.setSeconds(0),b.setMilliseconds(0);var c=new Date(b);b.setHours(23),b.setMinutes(59),b.setSeconds(0),b.setMilliseconds(0);var d=new Date(b);!u(a).prop("checked")||u(this).hasClass("allsell")&&"3"==u("#txtToufangType").val()&&u(this).children().children().hasClass("noborder")?w.Delete(new Date(c.getTime()-6e4),new Date(d.getTime()+6e4)):w.Add(c,d,6e4)}}),w.showPartail()}function q(a){var d=u(a.target),e=d.hasClass("set-partialdate"),f=d.offset(),g=f.top+d.height()+10,h=f.left+d.width()/2,i=new Date,j=b(i),k=u("#id-date-range-picker-1");moment().startOf("minute"),i.setHours(23),i.setMinutes(59);var l=c(new Date(i));if(e&&(j=d.parent().prev().prev().prev().html(),l=d.parent().prev().prev().html(),z=new Date(j.replace(new RegExp("-","mg"),"/")),A=new Date(l.replace(new RegExp("-","mg"),"/"))),u(".daterangepicker").remove(),k.removeData("daterangepicker"),k.daterangepicker({format:"YYYY-MM-DD HH:mm",separator:"~",startDate:j,endDate:l,minDate:c(new Date),showDropdowns:!0,timePicker:!0,timePickerIncrement:1,timePicker12Hour:!1,applyClass:"btn btn-small btn-success",locale:{applyLabel:"确定",cancelLabel:"取消",fromLabel:"开始时间",toLabel:"结束时间",customRangeLabel:"Custom Range",daysOfWeek:["日","一","二","三","四","五","六"],monthNames:["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],firstDay:1}},function(a,b){if(e){var c=new m(z,A);w.deletePartail(w.indexOf(c))}w.Add(new Date(a),new Date(b),6e4),w.showPartail()}),e){var n=new Date;if(n.setHours(0,0,0,0),z.getTime()<n.getTime()){var o=u("#id-date-range-picker-1").data("daterangepicker");u(".calendar.left").off("click","td.available",u.proxy(o.clickDate,o)),u(".calendar.left select").prop("disabled","disabled")}}var p=u(".daterangepicker");p.css({left:h,top:g}).show(),k.off("cancel.daterangepicker").on("cancel.daterangepicker",function(){p.hide()}),k.off("apply.daterangepicker").on("apply.daterangepicker",function(a,b){if(e){var c=new m(z,A);w.deletePartail(w.indexOf(c))}w.Add(new Date(b.startDate.format("YYYY-MM-DD HH:mm")),new Date(b.endDate.format("YYYY-MM-DD HH:mm")),6e4),w.showPartail(),p.hide()})}var r,s,t,u=a("$"),v=1,w=new n,x=!0;g(),window.prevMonth=k,window.nextMonth=l,m.prototype.edit=function(a,b){if(!(b>a))throw new Error("Error:start time later than end time.");this.Start=a,this.End=b},m.prototype.toString=function(){return c(this.Start)+"~"+c(this.End)},m.prototype.getDays=function(){var a=new Date(this.Start),b=new Date(this.End);return a.setHours(0,0,0,0),b.setHours(23,59,59,999),Math.ceil((b.getTime()-a.getTime())/864e5)},n.prototype.getSize=function(){return this.partials.length},n.prototype.hasNext=function(){return void 0!=this.partials[this.current+1]},n.prototype.moveNext=function(){return void 0!=this.partials[this.current+1]?(this.current++,!0):!1},n.prototype.movePrev=function(){return this.current>=0?(this.current--,!0):!1},n.prototype.moveToFirst=function(){this.current=0},n.prototype.moveToLast=function(){this.current=this.partials.length-1},n.prototype.isEmpty=function(){return 0==this.partials.length},n.prototype.getCurrent=function(){return this.partials[this.current]},n.prototype.Add=function(a,b,c){c=c||0;var d=!1,e=!1;if(a.setSeconds(0),a.setMilliseconds(0),0==b.getHours()&&0==b.getMinutes()&&(b=new Date(b.getTime()-6e4)),b.setSeconds(0),b.setMilliseconds(0),this.isEmpty())try{return this.addPartail(0,new m(a,b)),!0}catch(f){return!1}this.moveToFirst();do{var g=this.getCurrent();if(d||!B.lt(a,g.Start,c)&&!B.le(a,g.End,c)||(d=new Date(Math.min(a,g.Start))),B.lt(b,g.Start,c)){e=b;break}if(B.le(b,g.End,c)){e=new Date(Math.max(b,g.End)),this.deleteCurrentPartail();break}if(d&&(this.deleteCurrentPartail(),this.movePrev()),!this.hasNext()){d=d?d:a,e=b,this.current++;break}}while(this.moveNext());try{return this.addPartail(this.current,new m(d,e)),!0}catch(f){return!1}},n.prototype.addPartail=function(a,b){var c=!1;return u(this.partials).each(function(){this.toString()==b.toString()&&(c=!0)}),c?!1:(this.partials.splice(a,0,b),!0)},n.prototype.getDays=function(){for(var a=0,b=0;b<this.partials.length;b++)a+=this.partials[b].getDays();return a},n.prototype.deleteCurrentPartail=function(){this.deletePartail(this.current)},n.prototype.deletePartail=function(a){this.partials.splice(a,1)},n.prototype.Delete=function(a,b){if(a.setSeconds(0),a.setMilliseconds(0),b.setSeconds(0),b.setMilliseconds(0),!this.isEmpty()){this.moveToFirst();do{var c=this.getCurrent();if(b>=c.Start)if(a<=c.Start){if(b<c.End){c.edit(b,c.End);break}this.deleteCurrentPartail(),this.movePrev()}else if(a<c.End){if(b<c.End){var d=new m(b,new Date(c.End));c.edit(c.Start,a),this.addPartail(this.current+1,d);break}c.edit(c.Start,a)}}while(this.moveNext())}},n.prototype.showPartail=function(){u("#j-TimeView table tbody").empty();var a=0,b=new Date;b.setHours(0,0,0,0);for(var d=0;d<this.partials.length;d++){var e=this.partials[d].getDays(),f="<tr><td>"+c(this.partials[d].Start)+"</td><td>"+c(this.partials[d].End)+"</td><td>共"+e+"天</td><td>"+(this.partials[d].End.getTime()>=b.getTime()?'<a class="j-setPartialdate set-partialdate" href="javascript:void(0)">编辑</a>':"")+(this.partials[d].Start.getTime()>=b.getTime()?'<a href="javascript:void(0)" onclick="delPartialdate(this)">删除</a></td>':"");u("#j-TimeView table tbody").append(f),a+=e}u("#allDays").html("共"+a+"天");var g=this;u("#j-DateView tbody td").each(function(){if(!u(this).hasClass("null")){var a=u(this).data("date");a.setHours(0),a.setMinutes(0),a.setSeconds(0),a.setMilliseconds(0);var b=new Date(a);a.setHours(23),a.setMinutes(59),a.setSeconds(0),a.setMilliseconds(0);var c=new Date(a),d=new Date,e=d>c?2:1;if(!g.isEmpty()){g.moveToFirst();do{var f=g.getCurrent();if(B.gt(f.Start,b,0)&&B.le(f.Start,c,0)||B.ge(f.End,b,0)&&B.lt(f.End,c,6e4)){e=d>c?6:5;break}if(B.le(f.Start,b,6e4)&&B.ge(f.End,c,6e4)){e=d>c?4:3;break}}while(g.moveNext())}u(this).children().children().removeClass("glyphicon-ok").removeClass("glyphicon-exclamation-sign"),u(this).removeClass("active"),3==e||4==e?(u(this).children().children().removeClass("glyphicon-ok").addClass("glyphicon-ok"),u(this).removeClass("active").addClass("active"),!u(this).hasClass("allsell")||"3"!=u("#txtToufangType").val()||x&&!u(this).children().children().hasClass("noborder")||u(this).children().children().removeClass("glyphicon-exclamation-sign").addClass("glyphicon-exclamation-sign")):(5==e||6==e)&&(u(this).children().children().removeClass("glyphicon-ok").addClass("glyphicon-ok"),u(this).removeClass("active").addClass("active"),!u(this).hasClass("allsell")||"3"!=u("#txtToufangType").val()||x&&!u(this).children().children().hasClass("noborder")||u(this).children().children().removeClass("glyphicon-exclamation-sign").addClass("glyphicon-exclamation-sign"))}})},n.prototype.indexOf=function(a){var b=-1;this.moveToFirst();do{var c=this.getCurrent();if(B.eq(c.Start,a.Start,0)&&B.eq(c.End,a.End,0)){b=this.current;break}}while(this.moveNext());return b};var y,z,A,B={eq:function(a,b,c){return Math.abs(a-b)<=c},lt:function(a,b,c){return b>a&&Math.abs(a-b)>c},le:function(a,b,c){return this.eq(a,b,c)||this.lt(a,b,c)},gt:function(a,b,c){return a>b&&Math.abs(a-b)>c},ge:function(a,b,c){return this.eq(a,b,c)||this.gt(a,b,c)}};window.delPartialdate=o,window.selectAllDate=p,u("#j-TimeView").on("click",".j-setPartialdate",function(a){q(a)})});