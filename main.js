/*
    鼠标滑入滑出控制元素高度效果 -> 不能这么处理！
    why? 操作translate的同时需要控制z-index -> 元素展示有冲突
    解决： JS封装一个运动框架
*/
// 兼容IE
// function getStyle(ele){
// //     return ele.currentStyle || getComputedStyle(ele)
// // }
// // window.requestAnimationFrame = window.requestAnimationFrame || function (fn){
// //     return setTimeout(fn, 1000/60)
// // }
// // window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout
// //
// // let oDownLoad = document.querySelector(".download");
// // let odlPannel = document.querySelector(".download_pannel");
// // let oShopCart = document.querySelector(".nr_shopcart");
// // let oCartBottom = document.querySelector(".cart_bottom");
// //
// // function changeHeight(eleF, eleS, attr, target, speed){
// //     eleF.onmouseover = function(){
// //         eleS.classList.add("on")
// //     }
// //     eleF.onmouseout = function(){
// //         eleS.classList.remove("on")
// //     }
// // }
// // changeHeight(oShopCart, oCartBottom, "height", "800px", 5)

/*
    头部产品区域 鼠标滑入滑出控制元素高度效果
        关键问题: 
            1. 文字与图片效果 -> 从上往下展示
            2. CSS无法控制文字/图片的变化
        遗留问题:
            字体变形了!
*/ 

let aLi = document.querySelectorAll(".header_content ul li"),
    aLink = document.querySelectorAll(".header_nav_tit"),
    aTit = ["小米CC9", "Redmi Note8", "小米壁画电视 65英寸", "小米游戏本", "米家扫地机器人", "小米路由器 Mesh", "小米小爱触屏音响"],
    aPrice = ["1799元起", "999元起", "6999元起", "7499元起", "1499元起", "999元起", "249元起"];
aLink.forEach(function(ele, idx){
    ele.onmouseover = function(){
        // console.log(idx)
        aLi.forEach(function(val, index){
            let navStr = `
                <a href="">
                    <img src="./images/h_content${idx+1}.png" alt="">
                    <p class="prod">${aTit[idx]}</p>
                    <p class="price">${aPrice[idx]}</p>
                </a>
            `
            aLi[index].innerHTML = navStr
        })
    }
    ele.onmouseout = function(){
        // console.log('移除:' + idx)
        aLi.forEach(function(val, index){
            aLi[index].innerHTML = ''
        })
    }
})

/*
    JSONP 模拟百度联想词搜寻
        1. 模拟百度搜索接口
            https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1464,21103,29911,29567,29220,26350&wd=大宝&req=2&bs=大宝&csor=2&cb=jQuery11020254710473686516_1572225393797&_=1572225393802
            function jQuery11020254710473686516_1572225393797&_=1572225393802(){

            }
            https://www.baidu.com/sugrec?ie=utf-8&prod=pc&wd=大宝&cb=fn
            function fn(obj){
                obj
            }
        2. 遇到的问题:
            1) 输入结果为空时,不做处理  -> 代码没生效 
                why? 空字符也被计算了,生成script节点前并没有过滤掉空字符串
            2) 数组项过多,过滤掉第10条之外的的搜索项  ->  通过索引排除
            3) 联想词为空时,展示默认词
                attention! 
                    是根据val来判断联想词是否为空
                    而不是通过script返回的数组  ->  在val(搜索词)为空时会报错
                step1: 过滤掉文本最前面为空的字符串 -> trim()
                step2: 搜索词为空时 -> 展示默认情况下拼接的字符串模板
*/ 
let body = document.querySelector("body"),
    searchBox = document.querySelector(".header_search form"),
    search = document.querySelector(".search_input"),
    searchBtn = document.querySelector(".search_btn"),
    searchLink = document.querySelector(".search_link"),
    searchPannel = document.querySelector(".search_pannel");
search.onfocus = function(){
    search.style.border = "1px solid #ff6700";
    searchBtn.style.border = "1px solid #ff6700";
    searchPannel.style.display = "block";
    searchLink.style.display = "none";
}
search.onblur = function(){
    search.style.border = "1px solid #ccc";
    searchBtn.style.border = "1px solid #ccc";
    searchPannel.style.display = "none";
    var val = search.value.trim();
    if(!val){
        searchLink.style.display = "block";
    }else{
        searchLink.style.display = "none";
    }
}
search.oninput = function(){
    console.log("val:" + search.value.trim())
    var val = search.value.trim();  // 获取搜索关键词
    let defStr = `
        <li><a href="">小米 9</a></li>
        <li><a href="">Redmi K20 pro</a></li>
        <li><a href="">Redmi K20</a></li>
        <li><a href="">Redmi Note 7 Pro</a></li>
        <li><a href="">Redmi note 7</a></li>
        <li><a href="">小米电视 4C</a></li>
        <li><a href="">电视32英寸</a></li>
        <li><a href="">笔记本pro</a></li>
        <li><a href="">小爱音箱</a></li>
        <li><a href="">净水器</a></li>
    `
    // if(!val) return
    if(!val){
        // searchPannel.style.display = "none";
        searchPannel.innerHTML = defStr;
        return
    }else{
        var script = document.createElement('script');
        // script.setAttribute("src", `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&wd=${search.value}&cb=fn`);
        script.src = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&wd=${search.value}&cb=fn`;
        body.appendChild(script);
        // 加载完成后清除
        script.onload = function(){
            body.removeChild(script);
        }
        // searchPannel.style.display = "block";
    }
} 
function fn(obj){
    // console.log(obj.g);
    // var val = search.value;
    // console.log("val:" + search.value)
    let searchArr = obj.g;
    let str = '';
    // if(!val){
    //     searchPannel.style.display = "none";
    // }else{
        // for(let i = 0; i < searchArr.length; i++){
        //     // console.log(searchArr[i].q);
        //     str += `<li><a href="#">${searchArr[i].q}</a></li>`;
        // }
        // searchPannel.innerHTML = str;
    // }
    
    // var newArr = arr.filter(item => item.indexOf('b')<0)
    // if(searchArr.length == 0){
    //     console.log('kong..')
    // }else{
        searchArr.forEach(function(ele, idx){
            if(idx >= 10) return;
            str += `<li><a href="#">${searchArr[idx].q}</a></li>`;
        })
        searchPannel.innerHTML = str;
    // }
}


/*
    淡入淡出轮播图
        需要获取的元素:
            1. 图片/向左向右的按钮/底部的小圆点/整个容器
        需要自定义的变量
            1. 上一次展示的图片的索引值
            2. 即将展示的图片的索引值(直接取图片索引值即可)
        逻辑:
            1. 点击左右按钮当前图片消失,新图片展示
                1) 向右 -> lastIndex>4?lastIndex=0:lastIndex++
                2) 向左 -> lastIndex<0?lastIndex=4:lastIndex--
            2. 点击下方小圆点按钮,当前图片消失,对应小圆点索引图片展示
            3. 重复两次点击同一个小圆点,图片没有变化
            4. 自动循环播放 -> 鼠标划入暂停,划出消失 
*/
let aImgs = document.querySelectorAll('.ban_imgs li'),
    aTabs = document.querySelectorAll('.ban_tabs li'),
    oPrev = document.querySelector('.arrow_l'),
    oNext = document.querySelector('.arrow_r'),
    oBanner = document.querySelector(".banner_cont"),
    len = aImgs.length,
    curIndex = 0     // 记录当前展示的图片下标
// console.log(oBanner)
// 默认展示第一张图片
animation(aImgs[curIndex], {
    data: {
        opacity: 1,
        zIndex: 1
    }
}, 500)
//  向左  ->  后置++/-- -> 先把值抛出使用,在计算++/--
oPrev.onclick = function(){
    changeImage(curIndex--)  
    /* 
        两个步骤 -> 1) curIndex 2)curIndex--
        等同于
            var index = curIndex;
            curIndex--;
            changeImage(index)
    */
}
// 向右
oNext.onclick = function(){
    changeImage(curIndex++)
}
// 小圆点按钮
// for(let i = 0; i < len; i++){
//     aTabs[i].onclick = function(){  // i -> 提供的是即将要显示的下标
//         var index = curIndex;  // index -> 保存上一次显示图片的下标
//         curIndex = i;   // 更新即将要显示的图片下标
//         // console.log("i:" + i, "curIndex: " + curIndex, "index: " + index)
//         changeImage(index);
//     }
// }
aTabs.forEach(function(ele, idx){  // 不能用箭头函数,this的指向有误
    ele.onclick = function(){
        // console.log(ele, idx)
        var index = curIndex;  
        curIndex = idx;
        changeImage(index);
    }
});
function changeImage(lastIndex){  // 将上一次展示的图片下标传入
    // console.log(lastIndex, curIndex)  // 0, -1
    // 前后两次点击同一个小圆点
    if(lastIndex == curIndex) return
    // 将上一次展示的图片消失 && 移除上一次小圆点按钮的默认样式
    animation(aImgs[lastIndex], {
        data: {
            opacity: 0,
            zIndex: 0
        }
    }, 500);
    aTabs[lastIndex].classList.remove("on");
    /* 
        向左/向右 下标的限制条件
            1) 当即将展示的图片索引小于0时,强制拖到最后一张(索引)len-1
            1) 当即将展示的图片索引大于4时,强制拖到第一张(索引)0
    */
    if(curIndex < 0) curIndex = len - 1;
    if(curIndex > 4) curIndex = 0;
    // 将即将展示的图片展示出来 
    animation(aImgs[curIndex], {
        data: {
            opacity: 1,
            zIndex: 1
        }
    }, 500);
    aTabs[curIndex].classList.add('on');
}
// 定时播放
let bannerTimer = setInterval(() => {
    changeImage(curIndex++); 
    /*
        没反应 why?
            curIndex++ 
            changeImage(curIndex); 
    */
}, 3000);
oBanner.onmouseover = function(){  // 划入
    clearInterval(bannerTimer)
}
oBanner.onmouseleave = function(){  // 划出 onmouseout&&onmouseleave
    bannerTimer = setInterval(() => {
        changeImage(curIndex++);
    }, 3000);
}


/*
    小米闪购左侧倒计时
        需要获取的元素:
            时分秒对应的元素节点
        需要计算的值: 
            1. 目标时间 - 当前时间 = 时间差 
            2. 时间差毫秒值 替换成 时 分 秒 -> 渲染到网页
        要求: 
            日期恒定为当月/当日
*/ 
let aSpan = document.querySelectorAll('.count-down span'),
//  日期恒定为当月/当日
    date = new Date(),   
    targetMonth = date.getMonth(),
    targetDay = date.getDate();
// console.log(aSpan)
console.log(targetMonth, targetDay)
function countTime(){
    //  目标时间
    let targetTime = new Date(2019, targetMonth, targetDay, 23, 59),
    //  当前时间
        curTime = new Date(),
    //  差值  
        sub = targetTime - curTime,
    //  换算
        days = Math.floor(sub / 1000 / 60 / 60 / 24),
        hours = judge(Math.floor((sub / 1000 / 60 / 60) % 24)),
        minutes = judge(Math.floor((sub / 1000 / 60) % 60)),
        seconds = judge(Math.floor((sub / 1000) % 60));
    // console.log(sub, days, hours, minutes, seconds)
    //  渲染
    aSpan[0].innerHTML = `${hours}`;
    aSpan[1].innerHTML = `${minutes}`;
    aSpan[2].innerHTML = `${seconds}`;
}
function judge(val){
    if( val < 10){
        val = "0" + val
    }
    return val   // 不return -> 默认返回undefined
}
setInterval(countTime, 1000);


/*
    小米闪购右侧轮播
        需要获取的元素:
           1. 向左/向右按钮
           2. 可见区域宽度
           3. 轮播内部所有子元素的总宽度
        逻辑: 
            1. 向左 -> 整体往后走(右)   
                第一个元素展示在可见面板最前面 -> 轮播不能往左
            2. 向右 -> 整体往前走(左)
                最后一个元素展示在可见面板最末尾 -> 轮播不能往右
            3. 自动轮播  -> but点击左右按钮后自动轮播停止(没写)
        遗留问题:
            自动轮播 --> 没完成
*/ 
let aBtn = document.querySelectorAll('.timer-tabs span'),
    oWrapper = document.querySelector('.timer-r'),
    oSwipper = document.querySelector('.swiper-wrapper'),
    allWidth = oSwipper.offsetWidth,
    visWidth = oWrapper.offsetWidth,
    maxDis = -(allWidth - visWidth)
    maxIndex = Math.floor(allWidth/visWidth),
    index = 0;
    _dis = 0
// console.log(aBtn)
// console.log(allWidth, visWidth, maxIndex)
aBtn.forEach(function(ele, idx){
    ele.onclick = function(){
        // console.log(idx) // 0->prev 1->next
        idx ? index++ : index--;
        if(index < 0){
            index = 0
        }else{
            _dis = -(index * visWidth);
        }
        if(index >= maxIndex){
            index = maxIndex;
            _dis = maxDis;
        }else{
            _dis = -(index * visWidth);
        }
        // console.log(index);
        oSwipper.style.transform = "translate(" + _dis + "px";
    }
})


/*
    主体部分 -> 视频模块
        需要获取的元素:
           1. 存放视频的容器
           2. 视频标题
           3. 视频标签
           4. 关闭视频按钮
        思考方向: 
            1. 创建视频文档节点(大小覆盖整个网页 )
*/ 
let player = document.getElementById("player"),
    videoItem = document.querySelectorAll(".video-item"),
    vTit = document.querySelectorAll(".video-item .v-tit"),
    videoTit = document.querySelector(".player_header .tit"),
    closeVideo = document.querySelector(".player_header .iconfont"),
    videoCon = document.querySelector(".player_content"),
    video = document.querySelector(".player_content video"),
    // videoTitArr = ["小米MIX Alpha开箱视频", "小米5G新品手机发布会", "Redmi Note 8 系列发布会", "小米CC 9"],
    videoArr = ["../XiaoMi/images/video_01.mp4", "../XiaoMi/images/video_02.mp4", "../XiaoMi/images/video_03.mp4", "../XiaoMi/images/video_04.mp4"];
    // console.log(vTit)
/*
videoItem.forEach(function(ele,idx){
    ele.onclick = function(){
        console.log(idx)
        player.style.display = "block";
        // 标题更新
        // videoTit.innerHTML = videoTitArr[idx];
        videoTit.innerHTML = vTit[idx].innerHTML;
        // 视频更新
        video.src = videoArr[idx];
        switch (idx) {
            case 0:
                videoCon.style.marginTop = "-2px"
                break;
            case 1:
                videoCon.style.marginTop = "-36px"
                break;
            case 2:
                videoCon.style.marginTop = "-24px"
                break;
            case 3:
                videoCon.style.marginTop = "-77px"
                break;
            default:
                break;
        }
    }
})
closeVideo.onclick = function(){
    player.style.display = "none";
    video.pause();
}
*/


/*
    侧边栏 -> 回到顶部功能
    遗留问题:
        回到顶部过快 -> 希望效果是缓慢返回顶部
*/ 

let backTop = document.querySelector(".tools-toTop"),
    visbleHeight = document.documentElement.clientHeight;
// console.log("浏览器可视窗口高度: " + visbleHeight)
// 页面滚动时触发
let backSpeed = 0;
window.onscroll = function(e){
    // console.log(e)
    // console.log(window.pageYOffset)
    if(window.pageYOffset >= visbleHeight){
        backTop.classList.add("active")
    }else{
        backTop.classList.remove("active")
    }
    // 点击回到顶部按钮 
    backTop.onclick = function(){  
        console.log('返回顶部...') 
        window.scrollTo(0, 0)
    }
}