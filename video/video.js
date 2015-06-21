
// todo 重构
function videoPlay() {
	// 整个容器
	var video = document.querySelector(".video")
	//  视频
	var myVideo = document.getElementById('myVideo');
	// 停止/播放 按钮
	var playToggle = video.querySelector(".play-toggle");

	/**
	* @Description : 各种进度条
	* progressContainer : 整个进度条
	* playProgress : 播放进度
	* loadProgress : 加载进度
	**/
	var progressContainer = video.querySelector(".progress-container"),
        playProgress = progressContainer.querySelector(".play-progress"),
        loadProgress = progressContainer.querySelector(".load-progress");
	
	// 播放时间信息
	var now = video.querySelector(".now"),
        total = video.querySelector(".total");

	// 音量调节 胡乱起名字~~
    var volume = video.querySelector(".volume-control"),
        volumeBar = volume.querySelector(".volume-value"),
        volumeBarContainer = volume.querySelector(".volume-value-container"),
        volumeBody = volume.querySelector(".volume"),
        volumeBtn = volume.querySelector(".btn");

    // 状态提示
    var statusLogo = video.querySelector(".status-logo");

    var sumLength = parseInt(
            getComputedStyle(progressContainer, false)["width"]
			);

	var volumeBarContainerHeight = parseInt(
            getComputedStyle(volumeBarContainer, false)["height"]
			);

	// 存储音量状态的图标
	var volumeBgs = {
		MIN : "stock_volume-min.png",
		MAX : "stock_volume-max.png",
		NONE : "stock_volume-mute.png",
		MIDDLE : "stock_volume-med.png"
	}

	var progressToDocOffsetLeft = getOffsetToDoc(progressContainer).left;

	var volumeBarMax = parseInt(
            getComputedStyle(volumeBarContainer, false)["height"]
            ) - 1;

	// 如果不是现代浏览器，返回。你知道我指的是该死的IE6/7/8!
	if (!document.createElement("video").canPlayType) {
		// 就不给你看！
		video.style.display = "none";
		return ;
	}

	// 处理 播放/暂停
	playToggle.addEventListener("click",function (event) {

		if(myVideo.paused){
			myVideo.play();
			this.textContent = "||";
		} else{
			myVideo.pause();
			this.textContent = ">";
		}

		event.preventDefault();
	},false);

	// 更新播放结束后标志
	myVideo.addEventListener("ended", function () {
		playToggle.textContent = "[]";
	})

	// 视频开始播放一次触发一次
	myVideo.addEventListener("play", function () {
		console.log("play");
	}, false);

	// 跟新播放进度 只要视频播放就会触发
	myVideo.addEventListener("timeupdate", function () {
		updatePalyPercent();
		updateLoadProgress();
		UpdateStatusLogo(false);
		updateTime();
	}, false);

	// 开始下载 基本会触发一次（没有意外）
	myVideo.addEventListener("loadstart", function () {
		updateLoadProgress();
		console.log("loadstart");
	}, false);

	// 开始下载时间 基本会触发一次（没有意外）

	myVideo.addEventListener("durationchange", function () {
		console.log("durationchange");
		updateTime();
	}, false);

	myVideo.addEventListener("loadeddata", function () {
		updateLoadProgress();
		UpdateStatusLogo(true);
		console.log("loadeddata")
	}, false);

	// 开始下载元数据 基本会触发一次（没有意外）
	myVideo.addEventListener("loadedmetadata", function (){
		updateTime();
		// 等待文件头数据夹在完全　就初始化音量
		initVolumeBar();
		console.log("loadedmetadata");
	}, false);

	// 只要正在运行就会触发
	myVideo.addEventListener("progress", function () {
		updateLoadProgress();
		updatePlayPosition();

		if (myVideo.readyState < 4) {
			UpdateStatusLogo(true);
		} else {
			UpdateStatusLogo(false);
		}

		console.log("progress");
		
	}, false);

	// 正在播放 每次播放 触发一次 play是调用播放事件
	myVideo.addEventListener("playing", function () {
		console.log("playing");
	}, false);

	myVideo.addEventListener("canplay", function () {
		updatePlayPosition();
		UpdateStatusLogo(false);
		console.log("canplay");
	}, false);

	// 下载被阻塞
	myVideo.addEventListener("stalled", function () {
		UpdateStatusLogo(true);
		console.log("stalled")
	}, false)

	myVideo.addEventListener("canplaythrough", function () {
		updateLoadProgress();
		updatePlayPosition();
		console.log("canplaythrough")
	}, false);

	// 在跳转寻找
	myVideo.addEventListener("seeking", function () {
		UpdateStatusLogo(true);
		console.log("seeking");
	}, false)

	 //已经找到
	myVideo.addEventListener("seeked", function () {
		UpdateStatusLogo(false);
		console.log("seeked");
	}, false);

	// 等待缓冲
	myVideo.addEventListener("waiting", function() {
		UpdateStatusLogo(true);
		console.log("waiting");
	}, false);

	// 处理音量
	myVideo.addEventListener("volumechange", function () {
		updateVolumeIcon();
	}, false);

	volume.addEventListener("click", function (event) {
		if (event.target == this) {
			myVideo.muted = myVideo.muted ? false : true;
		}
	    event.preventDefault();
	    event.stopPropagation();
	}, false);

	function updateLoadProgress() {
		// 能够精确到已经缓冲的N段~~ API 太美妙了
		var beginTime,
			endTime,
			durationTime,
			beginPosition,
			width;

		// 清空，为下次显示做准备，防止冗余		
		removeAllChild(loadProgress);
		getInfo();
		
		function getInfo() {
			
			for (var i = 0; i < myVideo.buffered.length; i++ ) {
				beginTime = myVideo.buffered.start(i);
				endTime = myVideo.buffered.end(i);
				
				duration = endTime - beginTime;
				width = parseInt((duration / myVideo.duration) * sumLength);

				beginPosition = parseInt((beginTime / myVideo.duration) * sumLength);

				setInfo(beginPosition, width); 
			}
		}
		
		// 这边DOM开销会很大，没办法
		function setInfo(beginPosition, width) {

			var span = document.createElement("span");
			
			span.style.left = beginPosition + "px";
			span.style.width = width + "px";

			loadProgress.appendChild(span);
		}
	}

	function updateTime() {
		var nowTime = formateTime(myVideo.currentTime);
		// fix下没有Meta数据的情况（NaN）；
		var totalTime = formateTime(
							isNaN(myVideo.duration) ? 0 : myVideo.duration
							);

		now.textContent = nowTime;
		total.textContent = totalTime;				
	}

	function updatePalyPercent() {
		var timePercent = myVideo.currentTime / myVideo.duration; 
		var width = sumLength * timePercent;

		playProgress.style.width = parseInt(width) + "px";
	}

	function formateTime(time) {
		// 这里就不计算小时了
		var result = "";
		var seconds = Math.round(time % 60);
		var minutes = Math.round(time / 60);

		if(minutes <= 9) {
			result += "0" + minutes.toString();
		} else {
			result += minutes.toString();
		}

		if(seconds <= 9) {
			result += ":0" + seconds.toString();
		} else {
			result += ":" + seconds.toString();
		}

		return result;
	}

	function UpdateStatusLogo(show, statusType) {
		statusLogo.style.display = show ? "block" : "none";
	}

	function updateVolumeIcon() {
		var volumeValue = myVideo.volume;
		var bgImg;

		if (volumeValue == 0 || myVideo.muted) {
			bgImg = volumeBgs.NONE;
		} else if (volumeValue > 0 && volumeValue < 0.35) {
			bgImg = volumeBgs.MIN;
		} else if (volumeValue >= 0.35 && volumeValue <= 0.7) {
			bgImg = volumeBgs.MIDDLE;
		} else {
			bgImg = volumeBgs.MAX;
		}

		volume.style.backgroundImage = "url(img/bgs/" + bgImg + ")";
	}

	function updatePlayPosition() {
		// 点击控制
		progressContainer.addEventListener("click", function (event) {
			
			upDate(event);

			progressContainer.style.zIndex = 999;
            progressContainer.style.cursor = "default";

            event.preventDefault();
            event.stopPropagation();
		} ,false);

		// 模拟拖拽控制
		progressContainer.addEventListener("mousedown", function (event) {
			// 必须绑定document才可以无障碍拖动
			document.addEventListener("mousemove", upDate, false);
			event.preventDefault();

			// 必须绑定document 再去解绑这样才能很耗释放拖动
			// update: 用一个标志位
			document.addEventListener("mouseup",function docMouseUp(event) {
				document.removeEventListener("mousemove",upDate, false);

				progressContainer.style.zIndex = 999;
	            progressContainer.style.cursor = "default";
				
				event.stopPropagation();
				event.preventDefault();
			}, false);
		}, false);

		progressContainer.addEventListener("mouseup",function (event) {
			// 恢复层叠位置
			progressContainer.style.zIndex = 999;
            progressContainer.style.cursor = "default";
            event.preventDefault();
		},false);

		// 处理覆盖Bug
		progressContainer.addEventListener("mouseleave",function (event) {
			// 恢复层叠位置
			progressContainer.style.zIndex = 999;
            progressContainer.style.cursor = "default";
            event.preventDefault();
		},false);

		function upDate(event){
			// 兼容火狐（-- 何时火狐也要兼容了？ 悲伤啊~~）
			var mouseX = 0;

			if ( event.offsetX) {
				mouseX = event.offsetX
			} else if (event.clientX) {
				mouseX = event.clientX - progressToDocOffsetLeft;
			}
			 
			var percent = mouseX / sumLength;

			percent = percent > 1 ? 1 : percent;

			var targetLength = percent * myVideo.duration;

			//增加层叠位置可以无障碍拖动（全部位置拖动）
			progressContainer.style.zIndex = 10000;
            progressContainer.style.cursor = "w-resize";

            // fix Chrome拉过界（导致输入时间大于 duration 时间）视频将无播放问题
            if (targetLength > myVideo.duration - 1) {
            	
            	document.removeEventListener("mousemove",upDate, false);
				progressContainer.style.zIndex = 999;
            	progressContainer.style.cursor = "default";

            } else {
            	myVideo.currentTime = targetLength;
            }
            
			//更新下播放进度 chrome下ontimeupdate时间不能及时更新~~
			updatePalyPercent();
			event.preventDefault();
		}
	}

	volumeControl();

    // 音量控制
	function volumeControl() {
		// 这里要实现一个拖动效果
		var mouseY,
			disY,
			objY,
			top;

		volumeBtn.addEventListener("mousedown", function (event) {
		    var volumeBtnOffsetTop = getOffsetToDoc(volumeBtn).top;
		    var oldTop = parseInt(getComputedStyle(this, false)["top"]);

		    mouseY = event.screenY;
		    objY = volumeBtnOffsetTop;
		    disY = mouseY - objY;

		    document.addEventListener("mousemove", function move(event) {

		        var height,
					value;

		        mouseY = event.screenY;
		        top = oldTop + (mouseY - disY) - volumeBtnOffsetTop;

		        if (top <= 0) {
		            top = 0;
		        }

		        if (top >= volumeBarMax - volumeBtn.offsetHeight) {
		            top = volumeBarMax - volumeBtn.offsetHeight;
		        }

		        volumeBtn.style.top = top + "px";
		        // 显示高度
		        height = volumeBarMax - top;

		        volumeBar.style.height = height - volumeBtn.offsetHeight / 2 + "px";
		        // 修正的高度
		        height = parseInt(getComputedStyle(volumeBar, false)["height"]) + 1;
		        value = height / (volumeBarMax);
                
		        // 修正精度 其实是丢失~~哈哈
		        if (value < 0.1) {
		            value = 0;
		        } else if (value > 1) {
		            value = 1;
		        }

		        // 设置音量
		        myVideo.volume = value;

		        document.addEventListener("mouseup", function mouseUp(event) {

		            this.removeEventListener("mousemove", move, false);
		            this.removeEventListener("mouseup", mouseUp);

		            event.preventDefault();
		        }, false);

		        event.preventDefault();
		    }, false);
		}, false);

		volumeBtn.addEventListener("click", function (event) {
			event.stopPropagation();
		}, false);		
	}

	initVolumeBar();
    // 初始化音量
	function initVolumeBar() {
		var volumeValue = myVideo.volume;

		var volumeBarHeight = parseInt((volumeValue / 1) * volumeBarContainerHeight);

		 volumeBar.style.height = volumeBarHeight - 3 + "px";
		 volumeBtn.style.top = volumeBarMax - (volumeBarHeight)+"px";
	}
}


/**
总结：
更新播放进度：
	timeupdate 

更新缓冲状态：
	loadstart 			开始下载
	durationchange		时长信息加载（NaN => number）
	loadedmetadata		下载视频源数据（视屏信息）
	loadeddata 			当前帧的数据已加载，但没有足够的数据来播放指定音频/视频的下一帧时
	progress 			浏览器正在下载指定的音频/视频时
	canplay 			浏览器能够开始播放指定的音频/视频时
	canplaythrough 		浏览器预计能够在不停下来进行缓冲的情况下持续播放(没个浏览器正确实现)

更新正在下载状态：
	忙碌指示：
		progress 			浏览器正在下载指定的音频/视频时
	不显示
		canplay 			浏览器能够开始播放指定的音频/视频时
		canplaythrough
		
跟新忙碌等待指示
    显示：
        seeking             正在寻找（快进）
    不显示
        seeked              查找到

更新音量信息 
    volumeChange       => volume{get,set}
**/


(function () {
	var Video = (function () {
		return function () {
			this.video = null;
		};
	})();

	video.prototype = {
		play: function () {

		},
		stop: function () {

		}
	}
})();
