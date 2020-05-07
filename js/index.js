window.onload = function () {
    let oMain = document.querySelector(".main");
    let urls = [];
    for(let i = 1; i <= 40; i++){
        let index = i < 10 ? "0" + i : i;
        urls.push(`images/img${index}.jpg`);
    }
    preloadImages(urls,function (oImages) {
        let oItems = addImages(oMain,oImages);
        let cols = setMain(oItems, oMain);
        waterFall(oItems, cols);

        window.onresize = throttle(function () {
            let oItems = document.querySelectorAll(".tt");
            let cols = setMain(oItems, oMain);
            waterFall(oItems, cols);
        },500);
        loadImg(oItems, oMain, oImages);
    })

};


function addImages(oMain,oImages) {
    for(let i = 0; i < oImages.length; i++){
        let oImg = oImages[i];
        oImg.className = "tt";
        oMain.appendChild(oImg);
    }
    let oItems = document.querySelectorAll(".tt");
    return oItems;
}
//设置主容器
function setMain(oItems, oMain) {
    //屏幕宽度
    let screenWidth = getScreen().width;
    //图片的宽度
    let imgWidth = oItems[0].offsetWidth;
    //计算一行可以放几个
    let cols = Math.floor(screenWidth / imgWidth);
    //计算主容器宽度
    let mainWidth = imgWidth * cols + "px";
    //设置主容器居中
    oMain.style.width = mainWidth;
    oMain.style.margin = "0 auto";
    return cols;
}
//布局
function waterFall(oItems, cols) {
    let rows = [];
    for(let i = 0; i < oItems.length-1; i++){
        let item = oItems[i];
        if(i < cols){
            item.style.position = "";
            rows.push(item.offsetHeight+8);
        }else{
            //取出最小的高度
            let minHeight = Math.min.apply(this, rows);
            //取出最小的索引
            let minOrder = rows.findIndex(function (value) {
                return value === minHeight;
            });
            let oLeft = oItems[minOrder].offsetLeft;
            item.style.position = "absolute";
            item.style.left = oLeft + "px";
            item.style.top = minHeight + "px";
            rows[minOrder] += item.offsetHeight+8;
        }
    }
}

function loadImg(oItems, oMain, oImages) {
    window.onscroll = debounce(function () {
        let x = oItems[oItems.length-1].offsetHeight / 2;
        let y = oItems[oItems.length-1].offsetTop;

        let u = getScreen().height;
        let v = getPageScroll().y;
        if((x+y) < (u+v)){
            addImages(oMain, oImages);
            let oItems = document.querySelectorAll(".tt");
            let cols = setMain(oItems, oMain);
            waterFall(oItems, cols);
        }
    },500);
}
function preloadImage(url, fn) {
    let img = document.createElement("img");
    img.src = url;
    img.onload = function () {
        fn(img);
    }
}
function preloadImages(urls,fn) {
    let oImages = [];
    let count = 0;
    let total = urls.length;
    for(let i = 0; i < urls.length; i++){
        let url = urls[i];
        preloadImage(url,function (img) {
            oImages.push(img);
            count++;
            if(count === total){
                fn(oImages);
            }
        })
    }
}










