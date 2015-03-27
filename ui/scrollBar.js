(function () {
    var _Scroll = function ( config ) {
        var DefaultConfig = {
//                    scrollWrap : "scroll-content",
//                    scrollContent : "scroll-content",
//                    scrollUpbtn : "scroll-up-btn",
//                    scrollDownBtn : "scroll-down-btn",
//                    scrollThumb : ""
        };

        // todo 读取相对应的包含快的 overflow  信息是否显示 垂直 水平位置的 滚定条


        // 滚动包含框
        this.$Scroll        = $(config.scroll);
        // 滑动的内容区块
        this.$ScrollContent = this.$Scroll.find(".scroll-content");
        // 滚动条
        this.$ScrollBar     = this.$Scroll.find(".scroll-bar");
        // 向上滚动按钮
        this.$ScrollUpBtn   = this.$ScrollBar.find(".scroll-up-btn");
        // 向下滚动按钮
        this.$ScrollDownBtn = this.$ScrollBar.find(".scroll-down-btn");
        // 滚动条包含滑块的滚动轨迹
        this.$ScrollTrack   = this.$ScrollBar.find(".scroll-track");
        // 滚动条滑块
        this.$ScollThumb    = this.$ScrollBar.find(".scroll-thumb");

        // 记录滚动条滑块信息
        this.scrollThumbInfo = {
            xMax : 0,       // 能够滚动的垂直位置最大值
            xMin : 0,       // 能够滚动的垂直位置最小值
            yMax : 0,       // 能够滚动的水平位置最大值
            yMin : 0,       // 能够滚动的水平位置最小值
            xCurrent : 0,   // 当前滑块的水平位置
            yCurrent : 0,   // 当前滑块的垂直位置
            xPercent : 0,   // 当前滑块位于滑块轨道位置的水平位置百分比
            yPercent : 0    // 当前滑块位于滑块轨道位置的垂直位置百分比
        };

        // 记录内同区块信息
        this.contentInfo = {
            xMin : 0,       // 滚动内容区块水平位置的最小值
            xMax : 0,       // 滚动内容区块水平位置的最大值
            yMin : 0,       // 滚动内容区块垂直位置的最小值
            yMax : 0,       // 滚动内容区块垂直位置的最大值
            xCurrent : 0,   // 滚动区块目前的水平位移
            yCurrent : 0,   // 滚动区块目前的垂直位移
            xPercent : 0,   // 滚动区块目前的水平位移的百分比
            yPercent : 0    // 滚动区块目前的垂直位移的百分比
        };

        // 是否显示滚动条
        this.showScollBar = false;

        // 每次位移偏移量
        this.eachOffset = 20;

        this.init();

    };

    _Scroll.prototype.init = function () {
        this.initStyle();
        this.bingAction();
    };

    _Scroll.prototype.initStyle = function () {
        // 滚动窗口高度
        var scrollWrapHeight = parseInt(this.$Scroll.css("height"));
        // 滚动区域高度
        var scrollCntHeight = parseInt(this.$ScrollContent.css("height"));
        //  可滚动的高度
        var canScrollCntHeight = scrollCntHeight - scrollWrapHeight;

        this.contentInfo.yMax = canScrollCntHeight;

        //判断是否 显示滚动条
        this.showScollBar = canScrollCntHeight > 0;

        // 如果了内容区域小于显示 就不继续渲染了
        if ( !this.showScollBar ) {
            return ;
        }

        // todo 用代码生成滑动区块以及所有的按钮、滑动块

        // 滚动条高度
        var scrollBarHeight = parseInt(this.$ScrollBar.css("height"));

        // 向上按钮高度 包括 外边距、内边距，还有边框
        var upBtnHeight = parseInt(this.$ScrollUpBtn.outerHeight(true)) + parseInt(this.$ScrollUpBtn.css("top"));
        // 向下按钮高度 包括 外边距、内边距，还有边框
        var downBtnHeight = parseInt(this.$ScrollDownBtn.outerHeight(true)) + parseInt(this.$ScrollDownBtn.css("bottom"));
        // 滚动条滑块包含快高度
        var scrollTrackHeight = scrollBarHeight - upBtnHeight - downBtnHeight;

        if (scrollBarHeight <= 0) {
            return null;
        }

        // 把滑块放进滑块轨道中 可以节省计算量
        // todo 滑块不应该设置 样式 只是一个包裹层 暂时需要这样设置
        this.$ScrollTrack.css({
            "height": scrollTrackHeight,
            "position": "relative"
        });

        // 计算滑块的高度
        var scrollThumbHeight = parseInt(scrollWrapHeight / scrollCntHeight * scrollTrackHeight);
        // 设置滑块的高度
        this.$ScollThumb.css({
            'position' : "absolute",
            'height' : scrollThumbHeight,
            'top' : 0
        });
        // 修正后滑块的值 放置滑块有边框
        var scrollThumbFixHeight = this.$ScollThumb.outerHeight();

        // 滑块能够滚动的最高高度
        this.scrollThumbInfo.yMax = scrollTrackHeight - scrollThumbFixHeight;

        // 滑块所能滚动的最低高度
        this.scrollThumbInfo.yMin = 0;
        // 滑块所处的位置
        this.scrollThumbInfo.currentY = 0;
    };

    _Scroll.prototype.bingAction =  function () {
        var self = this;

        var isDragging = false;

        var mouseBeginX = 0;
        var mouseBeginY = 0;

        var mouseX = 0;
        var mouseY = 0;

        var thumbX = 0;
        var thumbY = 0;

        var disX = 0;
        var disY = 0;

        var currentX = 0;
        var currentY = 0;

        var scrollTimer = null;

        // todo 目前只处理垂直滚动
        self.$ScollThumb.on("mousedown", function (event) {
            event.preventDefault();
            isDragging = true;

            mouseBeginY = event.clientY;
            thumbY = parseInt($(self.$ScollThumb).css("top"));
        });

        $(document).on("mousemove", function (event) {

            if ( !isDragging ) {
                return null;
            }

            mouseY = event.clientY;

            // 鼠标拖动距离
            var disY = mouseY - mouseBeginY;

            var top  = disY + thumbY;

            if (top < self.scrollThumbInfo.yMin) {
                top  = self.scrollThumbInfo.yMin;
            } else if ( top > self.scrollThumbInfo.yMax) {
                top = self.scrollThumbInfo.yMax;
            }

            self.$ScollThumb.css({
                "top" : top
            });

            self.scrollThumbInfo.yCurrent = top;

            self.scrollThumbInfo.yPercent = top / (self.scrollThumbInfo.yMax - self.scrollThumbInfo.yMin);

            self.updateContentPosition(self.scrollThumbInfo.yPercent);

        });

        $(document).on("mouseup", function () {
            isDragging = false;
        });

        self.$ScrollUpBtn.on("click", function (event) {
            event.preventDefault();
            self.handleMove(true);
        }).on("dblclick", function (event) {
            event.preventDefault();
            return false;
        });

        self.$ScrollDownBtn.on("click", function (event) {
            event.preventDefault();
            self.handleMove(false);
        }).on("dblclick", function (event) {
            event.preventDefault();
            return false;
        });


        self.$ScrollUpBtn.on("mousedown", function (event) {
            event.preventDefault();
            scrollTimer = window.setInterval(function () {
                self.handleMove(true);
            }, 50);

        }).on("mouseup", function (event) {
            event.preventDefault();
            clearInterval(scrollTimer);
        });


        self.$ScrollDownBtn.on("mousedown", function (event) {
            event.preventDefault();
            scrollTimer = window.setInterval(function () {
                self.handleMove(false);
            }, 50);

        }).on("mouseup", function (event) {
            event.preventDefault();

            clearInterval(scrollTimer);
        });


        self.$Scroll.on("mousewheel", function (event) {
            event = event || window.event;

            event.preventDefault();

            if (event.originalEvent.wheelDelta ) {
                var direction = event.originalEvent.wheelDelta > 0;
                self.handleMove(direction);
            }
        });



        self.$Scroll.on("DOMMouseScroll", function (event) {
            event = event || window.event;

            event.preventDefault();

            if ( event.originalEvent.detail ) {
                var direction = event.originalEvent.detail > 0;
                self.handleMove(direction);
            }
        });
    };


    /**
     *
     * @param direction boolean 滚动方向
     */
    _Scroll.prototype.handleMove = function (direction) {
        var top = this.contentInfo.yCurrent;


        if ( !!direction ) {
            top  = top + this.eachOffset;
        } else {
            top = top - this.eachOffset;
        }


        if ( top > this.contentInfo.yMin ) {
            top = this.contentInfo.yMin;
        } else if ( top < -this.contentInfo.yMax ){
            top = -this.contentInfo.yMax;
        }

        var percent = top / (this.contentInfo.yMax - this.contentInfo.yMin );

        percent = Math.abs(percent);

        // 设置位移
        this.updateContentPosition(percent);
        this.updateScrollPosition(percent);
    };

    /**
     * 滚动内容区块至相对应的百分比
     * @param percent integer 滚动的百分比
     */
    _Scroll.prototype.updateContentPosition = function (percent) {

        if (percent < 0) {
            percent = 0;
        } else if (percent > 1) {
            percent = 1;
        }
        var top = percent *  this.contentInfo.yMax;

        this.contentInfo.yCurrent = - top;

        this.$ScrollContent.css({
            "top" : -top
        });
    };

    _Scroll.prototype.updateScrollPosition = function (percent) {
        if ( percent < 0 ) {
            percent = 0;
        } else if ( percent > 1) {
            percent = 1;
        }

        var top = percent * this.scrollThumbInfo.yMax;

        this.$ScollThumb.css({
            "top" : top
        });
    };


    window.Scroll= _Scroll;
})();