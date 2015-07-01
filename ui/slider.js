/**
 * Created by hubery on 2015/6/18.
 */
(function () {

  var defaultConfig = {
    // 包裹层
    bannerWrap: ".banner-wrap",
    // 每个边栏
    bannerItem: ".banner-item",
    // 每次边栏动画切换时间
    animationDuration: 1000,
    // 自动播放
    autoPlay: true,
    // 自动播放间隔
    autoPlayDuration: 1500,
    /**
     * 滚动方向：
     * --------------------
     * true   是正序
     * false  为倒序
     * --------------------
     */
    autoPlayDirection: true,
    /**
     * 滚动效果：
     * --------------------
     * scroll:  滚动切换
     * fade:    淡入淡出
     * --------------------
     */
    effect: "scroll",
    /**
     * 滚动方向：
     * 可选参数 如果切换效果是滚动的话
     * ----------------------------
     *  horizontal ：水平滚动
     *  Vertical  : 垂直
     * ----------------------------
     */
    scrollDirection: 'horizontal',
    // 无缝滚动
    infinityScroll: true,
    // 是否需要控制按钮
    control: true,
    // 初始化显示第几张边栏
    initIndex: 0,
    // 控制按钮 上一张
    preBtn: ".pre-btn",
    // 控制按钮 下一站
    nextBtn: "next-btn",
    changeEventType:"hover"
  };

  var _slider = (function () {
    return function (selector, config) {
      this.init(selector, config);
    }
  })();

  _slider.defaultConfig = defaultConfig;

  /**
   * 初始化函数
   * @param selector {String}
   * @param config {Object}
   */
  _slider.prototype.init = function (selector, config) {

    if (!config) {
      config = defaultConfig;
    }

    this.$Banner = $(selector);

    // 边栏包裹层
    this.$BannerWrap = config.bannerWrap !== undefined ?
      $(config.bannerWrap) : this.$Banner.find(defaultConfig.bannerWrap);

    this.$BannerItem = config.bannerItem !== undefined ?
      $(config.bannerItem) : this.$Banner.find(defaultConfig.bannerItem);

    // 效果
    this.effect = config.effect !== undefined ? config.effect : defaultConfig.effect;

    if (jQuery.inArray(this.effect, ['fade', 'scroll']) < 0) {
      this.effect = defaultConfig.effect;
    }

    // 滚动
    if (this.effect === "scroll") {
      // 滚动 方向
      this.scrollDirection = (config.scrollDirection !== undefined && jQuery.inArray(this.scrollDirection, ["horizontal", "vertical"]) < 0) ?
        config.scrollDirection : defaultConfig.scrollDirection;

      // 是否无限滚动
      this.infinityScroll = config.infinityScroll !== undefined ? !!config.infinityScroll : defaultConfig.infinityScroll;

      if (this.infinityScroll) { // 如果无限滚动将页面内容复制
        var _html = this.$BannerWrap.html();
        _html += _html;
        this.$BannerWrap.html(_html);
      }

      this.$BannerItem = config.bannerItem !== undefined ?
        $(config.bannerItem) : this.$Banner.find(defaultConfig.bannerItem);


      if (this.scrollDirection === "horizontal") {
        this.$Banner.addClass("horizontal-scroll");

        var totalWidth = 0;

        this.$BannerItem.each(function (index, ele) {
          totalWidth += $(ele).width();
        });

        this.$BannerWrap.css({
          width: totalWidth
        });

      } else {
        this.$Banner.addClass("vertical-scroll");
      }
    } else if (this.effect === "fade") {
      this.$BannerWrap.addClass("fade-in-out");
    }

    this.animationDuration = (config.animationDuration !== undefined && jQuery.isNumeric(config.animationDuration)) ?
      config.animationDuration : defaultConfig.animationDuration;


    this.currentIndex = (config.initIndex !== undefined && jQuery.isNumeric(config.initIndex)) ?
      config.initIndex : defaultConfig.initIndex;

    this.play(this.currentIndex);

    // 自动播放
    this.autoPlay = config.autoPlay !== undefined ? !!config.autoPlay : defaultConfig.autoPlay;

    if (this.autoPlay) {
      // 自动播放 方向
      this.autoPlayDirection = config.autoPlayDirection !== undefined ?
        !!config.autoPlayDirection : defaultConfig.autoPlayDirection;

      this.autoPlayTimer = null;

      // 自动播放 间隔
      this.autoPlayDuration = config.autoPlayDuration !== undefined && jQuery.isNumeric(config.autoPlayDuration) ?
        config.autoPlayDuration : defaultConfig.autoPlayDuration;

      this.startAutoPlay();
    }
  };


  _slider.prototype.bind = function () {
  };

  /**
   * 开始自动播放
   */
  _slider.prototype.startAutoPlay = function () {
    var self = this;

    this.autoPlayTimer = setInterval(function () {
      self.play(self.autoPlayDirection);
    }, this.autoPlayDuration);
  };

  /**
   * 取消自动播放
   */
  _slider.prototype.cancelAutoPlay = function () {
    var self = this;

    clearInterval(self.autoPlayTimer);
  };

  /**
   * 控制 Slider 的显示
   * @param direction {String|Number|Boolean} 切换方向
   *-------------------------------------------------|
   *                String:
   *                  "next": 下一张
   *                  "pre"： 上一张
   *-------------------------------------------------|
   *                Number: slider的索引值
   *-------------------------------------------------|
   *                Boolean:
   *                  true：下一张
   *                  false: 上一张
   *--------------------------------------------------|
   */
  _slider.prototype.play = function (direction) {

    var index = this.currentIndex;

    if (jQuery.isNumeric(direction)) {
      index = direction;
    } else if (typeof direction === "string") {

      if (direction === "next") {
        index++;
      } else if (direction === "pre") {
        index--
      }
    } else if (typeof direction === "boolean") {
      if (direction) {
        index++;
      } else {
        index--;
      }
    }

    /**
     * 如果是淡入淡出效果
     * 直接 调用动画
     **/
    switch (this.effect) {
      case "fade":
        this.fadeTo(index);
        break;
      default :
        this.scrollTo(index);
        break;
    }
  };

  _slider.prototype.fadeTo = function (index) {

    var maxIndex = this.$BannerItem.length;
    var minIndex = 0;

    if (index > maxIndex - 1) {
      index = minIndex;
    }

    if (index < minIndex) {
      index = maxIndex - 1;
    }

    this.$BannerItem.fadeOut(this.animationDuration).eq(index).fadeIn(this.animationDuration);

    this.currentIndex = index;
  };

  _slider.prototype.scrollTo = function (index) {

    this.$BannerWrap.stop(true, true);

    var maxIndex = this.$BannerItem.length;
    var minIndex = 0;

    var moveIndex = null;

    if (index > maxIndex - 1) {
      index = minIndex;

      if (this.infinityScroll) {

        index = maxIndex / 2;

        moveIndex = index - 1;
      }
    }

    if (index < minIndex) {
      index = maxIndex - 1;

      if (this.infinityScroll) {
        index = maxIndex / 2 - 1;
        moveIndex = index + 1;
      }
    }

    if (this.infinityScroll && moveIndex !== null) {
      var cssValue = {};

      if (this.scrollDirection === "horizontal") {
        cssValue.left = -this.$BannerItem.get(moveIndex).offsetLeft;
      } else {
        cssValue.top = -this.$BannerItem.get(moveIndex).offsetTop;
      }

      this.$BannerWrap.css(cssValue);
    }

    var animationValue = {};

    if (this.scrollDirection === "horizontal") {
      animationValue.left = -this.$BannerItem.get(index).offsetLeft;
    } else {
      animationValue.top = -this.$BannerItem.get(index).offsetTop;
    }

    this.$BannerItem.removeClass("current").eq(index).addClass("current");

    this.currentIndex = index;

    this.$BannerWrap.animate(animationValue, this.animationDuration, function () {


    });
  };

  window.slider = new _slider(".banner", {
    effect: "scroll",
    infinityScroll: true,
    autoPlay: true,
    autoPlayDirection: true,
    scrollDirection: "horizontal"
  });
})();

