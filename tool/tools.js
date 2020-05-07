(function () {
    function getScreen() {
        let width, height;
        if(window.innerWidth){
            width = window.innerWidth;
            height = window.innerHeight;
        }else if(document.compatMode === "BackCompat"){
            width = document.body.clientWidth;
            height = document.body.clientHeight;
        }else{
            width = document.documentElement.clientWidth;
            height = document.documentElement.clientHeight;
        }
        return {
            width: width,
            height: height
        }
    }
    function getPageScroll() {
        let x, y;
        if(window.pageXOffset){
            x = window.pageXOffset;
            y = window.pageYOffset;
        }else if(document.compatMode === "BackCompat"){
            x = document.body.scrollLeft;
            y = document.body.scrollTop;
        }else{
            x = document.documentElement.scrollLeft;
            y = document.documentElement.scrollTop;
        }
        return {
            x: x,
            y: y
        }
    }
    function addEvent(ele, name, fn) {
        if(ele.attachEvent){
            ele.attachEvent("on"+name, fn);
        }else{
            ele.addEventListener(name, fn);
        }
    }
    function getStyleAttr(obj, name) {
        if(obj.currentStyle){
            return obj.currentStyle[name];
        }else{
            return getComputedStyle(obj)[name];
        }
    }
    function debounce(fn, delay) { // fn = test
        let timerId = null;
        return function () {
            let self = this;
            let args = arguments;
            timerId && clearTimeout(timerId);
            timerId = setTimeout(function () {
                fn.apply(self, args);
            }, delay || 1000);
        }
    }
    function throttle(fn, delay) { // fn = test
        let timerId = null;
        let flag = true;
        return function () {
            if(!flag) return;
            flag = false;
            let self = this;
            let args = arguments;
            timerId && clearTimeout(timerId);
            timerId = setTimeout(function () {
                flag = true;
                fn.apply(self, args);
            }, delay || 1000);
        }
    }
    //封装的原生ajax
    function xhxAjax(obj) {
        if(obj.type.toLowerCase() == "get"){
            var arr = [];
            for (var key in obj.data) {
                var dataStr = key + "=" + obj.data[key];
                arr.push(dataStr);
            }
            var str = arr.join("&");
            var oo = obj.url.indexOf("?") == -1 ? "?" : "&";
            obj.url = obj.url + oo + str;
        }else if(obj.type.toLowerCase() == "post"){
            var formData = new FormData();
            for (var key in obj.data){
                formData.append(key, obj.data[key]);
            }
        }else{
            console.log("类型有误");
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    var res = JSON.parse(xhr.responseText);
                    obj.success(res);
                }
            }
        };
        xhr.open(obj.type, obj.url, true);
        if (obj.type.toLowerCase() == "get") {
            xhr.send(null);
        }else if(obj.type.toLowerCase() == "post"){
            xhr.send(formData);
        }else{
            console.log("类型有误");
        }
    }
    //秒 格式化成 时分秒
    function getDifferentTime(allSecond) {
        //计算总小时
        let hour = Math.floor(allSecond/(60 * 60) % 24);
        hour = hour >= 10 ? hour : "0"+hour;
    
        //计算总分钟
        let minute = Math.floor(allSecond / 60 % 60);
        minute = minute >= 10 ? minute : "0"+minute;
    
        //计算总秒
        let second = Math.floor(allSecond % 60);
        second = second >= 10 ? second : "0"+second;
    
        return {
            hour: hour,
            minute: minute,
            second: second
        }
    }
    // 时间格式化
    function dateFormart(value, fmStr) {
        // console.log(fmStr);
        let date = new Date(value);
        let year = date.getFullYear();
        let month = date.getMonth() + 1 + "";
        let day = date.getDate() + "";
        let hour = date.getHours() + "";
        let minute = date.getMinutes() + "";
        let second = date.getSeconds() + "";
        if(fmStr && fmStr === "yyyy-MM-dd"){
            return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
    }
    //请求全屏播放
    function toFullVideo(videoDom){
        if(videoDom.requestFullscreen){
            return videoDom.requestFullscreen();
        }else if(videoDom.webkitRequestFullScreen){
            return videoDom.webkitRequestFullScreen();
        }else if(videoDom.mozRequestFullScreen){
            return videoDom.mozRequestFullScreen();
        }else{
            return videoDom.msRequestFullscreen();
        }
    }

    // 格式化歌词方法
function parseLyric (lrc) {
    const lyrics = lrc.split('\n')
    // [00:00.000] 作曲 : 林俊杰
    // 1.定义正则表达式提取[00:00.000]
    const reg1 = /\[\d*:\d*\.\d*\]/g
    // 2.定义正则表达式提取 [00
    const reg2 = /\[\d*/i
    // 3.定义正则表达式提取 :00
    const reg3 = /\:\d*/i
    // 4.定义对象保存处理好的歌词
    const lyricObj = {}
    lyrics.forEach(function (lyric) {
      // 1.提取时间
      let timeStr = lyric.match(reg1)
      if (!timeStr) { return }
      timeStr = timeStr[0]
      // 2.提取分钟
      const minStr = timeStr.match(reg2)[0].substr(1)
      // 3.提取秒钟
      const secondStr = timeStr.match(reg3)[0].substr(1)
      // 4.合并时间, 将分钟和秒钟都合并为秒钟
      const time = parseInt(minStr) * 60 + parseInt(secondStr)
      // 5.处理歌词
      const text = lyric.replace(reg1, '').trim()
      // 6.保存数据
      lyricObj[time] = text
    })
    return lyricObj
  }
  
  //深拷贝
  function depCopy(target, source) {
    // 1.通过遍历拿到source中所有的属性
    for(let key in source){
        // console.log(key);
        // 2.取出当前遍历到的属性对应的取值
        let sourceValue = source[key];
        // console.log(sourceValue);
        // 3.判断当前的取值是否是引用数据类型
        if(sourceValue instanceof Object){
            // console.log(sourceValue.constructor);
            // console.log(new sourceValue.constructor);
            let subTarget = new sourceValue.constructor;
            target[key] = subTarget;
            depCopy(subTarget, sourceValue);
        }else{
            target[key] = sourceValue;
        }
    }
}

    window.getScreen = getScreen;
    window.getPageScroll = getPageScroll;
    window.addEvent = addEvent;
    window.getStyleAttr = getStyleAttr;
    window.debounce = debounce;
    window.throttle = throttle;
    window.xhxAjax = xhxAjax;
    window.getDifferentTime = getDifferentTime;
    window.toFullVideo = toFullVideo;
    window.parseLyric = parseLyric;
    window.depCopy = depCopy;
    window.dateFormart = dateFormart;
})();