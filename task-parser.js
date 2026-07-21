(function(root,factory){
  var api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.TaskParser=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  var digits={零:0,〇:0,一:1,二:2,两:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9};

  function chineseNumber(value){
    if(/^\d+$/.test(value))return Number(value);
    if(value==='十')return 10;
    var ten=value.indexOf('十');
    if(ten>=0){
      var tens=ten===0?1:digits[value.charAt(ten-1)];
      var ones=ten===value.length-1?0:digits[value.charAt(ten+1)];
      if(tens==null||ones==null)return NaN;
      return tens*10+ones;
    }
    var total=0;
    for(var i=0;i<value.length;i++){
      if(digits[value.charAt(i)]==null)return NaN;
      total=total*10+digits[value.charAt(i)];
    }
    return total;
  }

  function pad(value){return String(value).padStart(2,'0')}

  function formatLocal(date){
    return date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate())+'T'+pad(date.getHours())+':'+pad(date.getMinutes());
  }

  function cleanTitle(text,matchedText){
    var title=text.replace(matchedText,' ')
      .replace(/^\s*(?:后)?\s*(?:提醒我|提醒一下我|记得|帮我|叫我|喊我)\s*/,'')
      .replace(/^\s*我(?:要|得)\s*/,'')
      .replace(/\s+/g,' ')
      .trim();
    return title;
  }

  function parseRelativeTask(text,now){
    if(typeof text!=='string'||!(now instanceof Date)||Number.isNaN(now.getTime()))return null;
    var raw=text.trim();
    var match=raw.match(/(\d+|[零〇一二两三四五六七八九十]+)(?:个)?(半)?(小时|分钟)后/);
    var halfHour=match?null:raw.match(/半小时后/);
    match=match||halfHour;
    if(!match)return null;
    var minutes;
    if(halfHour)minutes=30;
    else{
      var amount=chineseNumber(match[1]);
      if(!Number.isFinite(amount)||amount<=0)return null;
      if(match[2])amount+=0.5;
      minutes=match[3]==='小时'?amount*60:amount;
    }
    var title=cleanTitle(raw,match[0]);
    if(!title)return null;
    var due=new Date(now.getTime()+minutes*60000);
    return {title:title,dueDate:formatLocal(due),hasTime:true};
  }

  return {parseRelativeTask:parseRelativeTask};
});
