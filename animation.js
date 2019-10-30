/*
            参数： * 必填   []选填

                *obj        需要运动的对象（原生DOM节点）
                *json       变化的属性（必须是json对象，）  低版本IE要在css给初始值，不然时是auto
                *time       动画持续时间

                [easing]    运动函数（默认匀速运动）
                            1.Linear 匀速，  此时speed可以不填。
                            2.Quad 二次方缓动效果
                            3.Cubic 三次方缓动效果
                            4.Quart 四次方缓动效果
                            5.Quint 五次方缓动效果

                            6.Sine  正弦缓动效果
                            7.Expo  指数缓动效果
                            8.Circ  圆形缓动函数

                            9.Elastic 指数衰减正弦曲线缓动函数
                            10.Back  超过范围的三次方的缓动函数
                            11.Bounce 指数衰减的反弹曲线缓动函数
                
                [speed]     运动方式（值为Number）
                            0   代表加速运动
                            1   代表减速运动
                            2   先加速后减速

                [callback]  回调函数，this指向obj。
        */
        /*
            * t: current time（当前时间）；
            * b: beginning value（初始值）；
            * c: change in value（变化量）；
            * d: duration（持续时间）。    

        */
        /*
            时间版运动框架 带速度 很刺激
        */
        //兼容写前边
        function getStyle(ele) {
            return ele.currentStyle || getComputedStyle(ele)
        }
        window.requestAnimationFrame = window.requestAnimationFrame || function (fn) {
            return setTimeout(fn, 1000 / 60)
        }
        window.cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout

        // 接收四个参数  ele obj time fn  
        /*
            ele 是控制的对象  obj 是 改变的属性 及 速度  time的运行时间  fn的回调函数
        */
        /*animation(wrap,{
            data:{
                width:200,
                height:200,
                opacity:0.5,
                top:200,
                left:200
            },
            speedOpt:{
                speed:1, //选值范围 0 1 2 选speedArr 内的选项
                easing:"Back" 
            }
        },1000)*/

        function animation(ele,obj,time,fn){
            var Tween = {
                Linear: {
                  easeIn: function (t, b, c, d) {
                    return c * t / d + b;
                  }
                },
                Quad: {
                  easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t + b;
                  },
                  easeOut: function (t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b;
                  },
                  easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
                    return -c / 2 * ((--t) * (t - 2) - 1) + b;
                  }
                },
                Cubic: {
                  easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t + b;
                  },
                  easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t + 1) + b;
                  },
                  easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t + 2) + b;
                  }
                },
                Quart: {
                  easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t + b;
                  },
                  easeOut: function (t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                  },
                  easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
                    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
                  }
                },
                Quint: {
                  easeIn: function (t, b, c, d) {
                    return c * (t /= d) * t * t * t * t + b;
                  },
                  easeOut: function (t, b, c, d) {
                    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
                  },
                  easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
                    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
                  }
                },
                Sine: {
                  easeIn: function (t, b, c, d) {
                    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
                  },
                  easeOut: function (t, b, c, d) {
                    return c * Math.sin(t / d * (Math.PI / 2)) + b;
                  },
                  easeInOut: function (t, b, c, d) {
                    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
                  }
                },
                Expo: {
                  easeIn: function (t, b, c, d) {
                    return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
                  },
                  easeOut: function (t, b, c, d) {
                    return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
                  },
                  easeInOut: function (t, b, c, d) {
                    if (t == 0) return b;
                    if (t == d) return b + c;
                    if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
                  }
                },
                Circ: {
                  easeIn: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
                  },
                  easeOut: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
                  },
                  easeInOut: function (t, b, c, d) {
                    if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
                  }
                },
                Elastic: {
                  easeIn: function (t, b, c, d, a, p) {
                    var s;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (typeof p == "undefined") p = d * .3;
                    if (!a || a < Math.abs(c)) {
                      s = p / 4;
                      a = c;
                    } else {
                      s = p / (2 * Math.PI) * Math.asin(c / a);
                    }
                    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                  },
                  easeOut: function (t, b, c, d, a, p) {
                    var s;
                    if (t == 0) return b;
                    if ((t /= d) == 1) return b + c;
                    if (typeof p == "undefined") p = d * .3;
                    if (!a || a < Math.abs(c)) {
                      a = c;
                      s = p / 4;
                    } else {
                      s = p / (2 * Math.PI) * Math.asin(c / a);
                    }
                    return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
                  },
                  easeInOut: function (t, b, c, d, a, p) {
                    var s;
                    if (t == 0) return b;
                    if ((t /= d / 2) == 2) return b + c;
                    if (typeof p == "undefined") p = d * (.3 * 1.5);
                    if (!a || a < Math.abs(c)) {
                      a = c;
                      s = p / 4;
                    } else {
                      s = p / (2 * Math.PI) * Math.asin(c / a);
                    }
                    if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
                  }
                },
                Back: {
                  easeIn: function (t, b, c, d, s) {
                    if (typeof s == "undefined") s = 1.70158;
                    return c * (t /= d) * t * ((s + 1) * t - s) + b;
                  },
                  easeOut: function (t, b, c, d, s) {
                    if (typeof s == "undefined") s = 1.70158;
                    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
                  },
                  easeInOut: function (t, b, c, d, s) {
                    if (typeof s == "undefined") s = 1.70158;
                    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
                  }
                },
                Bounce: {
                  easeIn: function (t, b, c, d) {
                    return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
                  },
                  easeOut: function (t, b, c, d) {
                    if ((t /= d) < (1 / 2.75)) {
                      return c * (7.5625 * t * t) + b;
                    } else if (t < (2 / 2.75)) {
                      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
                    } else if (t < (2.5 / 2.75)) {
                      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
                    } else {
                      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
                    }
                  },
                  easeInOut: function (t, b, c, d) {
                    if (t < d / 2) {
                      return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                    } else {
                      return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                    }
                  }
                }
              }

            //存储运动函数待选项 =>可能为空
            var speedOpt = obj.speedOpt 

            //运动类型项下可选运动方式
            var speedArr = ["easeIn","easeOut","easeInOut"]

            //存储待改变的属性
            var data = obj.data

            //存储起始值  
            var startValue ={}  

            //存储变化量  目标值 - 起始值 = 变化量
            var changeValue = {}

            //存储起始时间 
            var startTime = new Date()

            //获取 ele对象下 所有的样式  待用
            var startAttr = getStyle(ele)

            //开始放起始值和变化量对象中 存值
            for(var key in data){
                var num = parseFloat(startAttr[key])
                //判断初始值 是否为 auto 如果是则转为0
                //存起始值
                startValue[key] = isNaN(num)? 0 : num

                //目标值处理 
                data[key] = parseFloat(data[key])

                //存变化量
                changeValue[key] = data[key] - startValue[key]
            }

            //处理一下 speedOpt 速度类型 的默认选项 
            //如果 speedOpt
            
            //确保不报错  speedOpt如果是 undefined 直接.操作会报错 
            var easing = speedOpt && speedOpt.easing //如果speedOpt存在就取speedOpt.easing
            var speed = speedOpt && speedOpt.speed//如果speedOpt存在就取speedOpt.speed

            if(typeof speedOpt === "object"){
                if("easing" in speedOpt){ //如果用户定义了运动方式
                    speed = speed || 0 
                    if(easing.toLowerCase() === "linear"){
                        //由于linear这种运动方式里,只有一种速度变化 ,因此以防用户乱输入导致 选择不到速度方式
                        speed = 0 // 强制等于 0 
                        easing = "Linear" //强制等于Linear  防止用户大小写混乱
                    }
                }else{ //如果用户的speedOpt没有定义运动方式 那就默认 匀速运动
                    speed = 0
                    easing = "Linear"
                }

            }else{ //如果用户压根没有写 speedOpt  那也是默认 匀速运动
                speed = 0
                easing = "Linear"
            }

            run()
            function run(){ //计算 每个调用时刻的属性值
                //获取变化时间  获取时间差 
                var changeTime = new Date() - startTime

                //判断是否到达目标时间
                var isSuc = time - changeTime

                for(var key in changeValue){
                    var val = Tween[easing][speedArr[speed]](changeTime,startValue[key],changeValue[key],time) //得到function运行结果  运行结果 及 变化值

                    if(isSuc<=0){ // 到达目标时间  强制让属性值 等于目标值   
                        val = Math.min(val,data[key]) 
                        val = Math.max(val,data[key]) 
                    }
                    //赋值 给style  判断 key=>属性名 是否是透明度
                    if(key.toLowerCase() === "opacity"){
                        ele.style[key] = val
                        //兼容ie 不能使用模板字符串
                        ele.style.filter = "alpha(opacity = "+val*100+")" 
                    }else{
                        ele.style[key] = val + "px"
                    }
                }
                //注意 放到for循环外面啊
                if(isSuc <= 0){ 
                        //遇到 true 通过  遇到false停下  如果cb形参接收到的是 undefined  就不会走向cb()  防止报错
                        fn && fn()
                }else{
                    requestAnimationFrame(run)
                }
            }
        }