;(function (win, $, undefined) {
    /**
     * 下拉菜单
     * html 结构
     *
     <div class="drop-down drop-down-select">
        <div class="select-wrap">
            <input type="text" class="input-box" name="" value=""  readonly="readonly" placeholder="选择.."/>
            <input type="hidden" class="input-hidden" name="" value="" >
            <a class="btn drop-down-btn" href="#">
                <span class="drop-down-arrow"></span>
            </a>
        </div>
        <ul class="menu-list option-wrap">
            <li class="menu-item">
                <a class="option" href="" data-val="">请先选择...</a>
            </li>
        </ul>
     </div>
     *
     * 该下拉菜单分为两种值：
     * 一种是 显示值 用户所能看到的值
     * 一种是 真实值 后台需要的值
     * 真实值可以省略 可用用显示值替代
     * 最终表单值是存储在隐藏输入框中
     *
     * @param $Dropdown {Object | String} 下拉菜单的类名
     * @param config {Object} 配置文件
     * @constructor
     */
    var Dropdown = function ($Dropdown, config) {
        /**
         * 主要配置文件 均为可选
         * @type {Object} 
         */
        var defaultConfig = {
            // 输入框中的默认值 可选
            defaultData : null,
            // 输入框默认值是否为显示值 默认是显示值 可选
            defaultDataIsShowValue: true,
            // 回调函数 可选
            callBack : null,
            // 下拉菜单填充值 为数组类型 可选
            initData : null,
            // 下拉菜单填充值是否为显示值 默认为真 可选
            initDataIsShowValue: true,
            /*
            * 显示值转化为真实值 或者 真实值转化为显示值的函数
            * 会传入一个值为 boolean 的形参 isShowValueConvertToTrueValue 默认为真
            * 如果为 true 那是 显示值 转化为 真实值
            * 如果为 false 那是 真实值 转为为 显示值
            * 如果该函数未定义 默认 显示值与真实值 相等
            */
            convertFn: function (value) {
                return value;
            }
        };

        // 下拉菜单的包裹层
        this.$Dropdown = $Dropdown instanceof $ ? $Dropdown : $($Dropdown);
        // 显示的框
        this.$ShowResultInput = this.$Dropdown.find(".input-box");
        // 下拉点击按钮
        this.$DropdownBtn = this.$Dropdown.find(".drop-down-btn");
        // 下拉点击的按钮
        //this.$DropdownArrow = this.$Dropdown.find(".drop-down-arrow");
        // 下拉列表
        this.$MenuList = this.$Dropdown.find(".menu-list");
        // 用于存储向服务器发送信息的隐藏域
        this.$HiddenInput = this.$Dropdown.find(".input-hidden");

        // 是否已经下拉的标志位
        this.isMenuDown = false;
        // 选中的值
        this.selectShowValue = this.$ShowResultInput.val() || null;
        // 选中的dataValue的值
        this.selectTrueValue = this.$HiddenInput.val() || this.$ShowResultInput.data("val") || null;

        // 回调函数 处理事件 传入所下拉选择到 显示值 以及真实值 作为形参
        this.callBack = (config && config.callBack) || defaultConfig.callBack;
        // 初始化填充下拉菜单数据 数组格式
        this.initData = (config && config.initData) || defaultConfig.initData;
        // 初始化用于填充下拉菜单的数据值是否为 显示值
        this.initDataIsShowValue = config && (config.initDataIsShowValue !== undefined) ? config.initDataIsShowValue : defaultConfig.initDataIsShowValue;
        // 初始化值输入框的值 字符串格式
        this.defaultData = (config && config.defaultData) || defaultConfig.defaultData;
        // 初始化值输入框的值 是否为显示值
        this.defaultDataIsShowValue = config && (config.defaultDataIsShowValue !== undefined) ? config.defaultDataIsShowValue : defaultConfig.defaultDataIsShowValue;
        // 转换函数 用于 处理 显示值 与 实际的 data-val 中的值
        this.convertFn = (config && config.convertFn) || defaultConfig.convertFn;

        // 初始化 函数
        this.init();
    };

    /**
     * 初始化操作
     */
    Dropdown.prototype.init = function () {
        // 如果有初始化数据，那么初始化下拉菜单
        if (this.initData && jQuery.type(this.initData) === "array") {
            // 填充下拉框
            this.fillMenu(this.initData, this.initDataIsShowValue, this.convertFn);
        }

        // 初始值
        if (this.defaultData !== undefined) {
            this.setValue(this.defaultData, this.defaultDataIsShowValue, this.convertFn);
        }

        // 绑定事件
        this.bindEvent();
    };

    /**
     * 设置下拉菜单的选中值
     *
     * @param data {String} 选中值
     * @param isShowValue {Boolean}[isShowValue=true] 是否是真实值还是选中值
     * @param convertFn {Function} 转换函数 默认是配置中的转换函数 如果都未定义直接返回显示值
     */
    Dropdown.prototype.setValue = function (data, isShowValue, convertFn) {

        var values = this.getConvertValue(data, isShowValue, convertFn);

        this.selectShowValue = values.showValue;
        this.selectTrueValue = values.trueValue;

        // 将显示值 真实值写入可见输入框
        this.$ShowResultInput.val(this.selectShowValue)
            .attr("value", this.selectShowValue)
                .data("value", this.selectTrueValue);

        // 向隐藏域写入真实值
        this.$HiddenInput.val(this.selectTrueValue)
                .attr("value", this.selectTrueValue);
    };


    /**
     * 
     * @param showValue {String}
     * @param trueValue {String}
     */
    Dropdown.prototype.setAllValue = function (showValue, trueValue) {
        this.selectShowValue = showValue;
        this.selectTrueValue = trueValue;

        // 将显示值 真实值写入可见输入框
        this.$ShowResultInput.val(this.selectShowValue)
                .data("value", this.selectTrueValue)
                    .attr("value", this.selectShowValue);

        // 向隐藏域写入真实值
        this.$HiddenInput.val(this.selectTrueValue)
            .attr("value", this.selectTrueValue);
    };


  /**
   * 填充下拉菜单
   * 
   * @param  {Array}  data                  填充下拉菜单数据
   * @param  {Boolean}[isShowValue=false]   isShowValue 是否是显示值 默认是真实值
   * @param  {Function}  convertFn          转换函数
   */
    Dropdown.prototype.fillMenu = function (data, isShowValue, convertFn) {

        // 清空下拉菜单
        var html = "";

        if (getType(data) === "Array") { // Array
            for (var i = 0, length = data.length; i < length; i++) {
                var values = this.getConvertValue(data[i], isShowValue, convertFn);

                html += '<li class="menu-item">' +
                            '<a class="option" href="#"  data-value="' + values.trueValue  +'">' + values.showValue + '</a>' +
                        '</li>';
            }
        }
        // 清空下拉菜单
        this.cleanMenu();
        // 插入
        this.$MenuList.append($(html));
    };

    /**
     * 默认的转函数
     * @param {String} value 需要转换的数值
     * @param {Boolean} isShowValue 是否是显示值 默认为真的
     * @param {Function} convertFn 显示值与真实值 转换函数
     */
    Dropdown.prototype.getConvertValue = function (value, isShowValue, convertFn) {
        // 如果没有定义是真
        isShowValue = isShowValue === undefined ? true : !!isShowValue;
        convertFn = convertFn === undefined ? this.convertFn : convertFn;

        var showVal = null;
        var trueVal = null;

        if ( isShowValue ) {
            showVal = value;
            trueVal = convertFn(value, isShowValue);
        } else {
            trueVal = value;
            showVal = convertFn(value, isShowValue);
        }

        return {
            showValue : showVal,
            trueValue : trueVal
        };
    };

    /**
     * 清空下拉菜单
     */
    Dropdown.prototype.cleanMenu = function () {
        this.$MenuList.html("");
    };

    /**
     * 添加单个数据
     * @param {string} data 字符串
     * @param {Boolean} isShowValue 是否是显示值
     * @param {Function} convertFn 转换函数
     * @param {boolean}[prepend=false]  是否在列表最前面插入
     */
    Dropdown.prototype.add = function (data,isShowValue, convertFn, prepend) {
        prepend = (prepend === undefined) || false;

        var values = this.getConvertValue(data, isShowValue, convertFn);

        var html =  '<li class="menu-item">' +
                        '<a class="option" href="#"  data-value="' + values.trueValue  + '">' + values.showValue + '</a>' +
                    '</li>';

        // 如果是前置插入
        if (prepend) {
            this.$MenuList.prepend($(html));
        } else {
            this.$MenuList.append($(html));
        }
    };

    /**
     * 删除子菜单，根据菜单内容字符串删除
     * @param {String} value
     */
    Dropdown.prototype.removeMenu = function (value) {
        var $lists = this.$MenuList.find(".menu-item");
        var that = this;
        if ( jQuery.type(value) === "array" ) {

            $lists.each(function(index,ele) {
                var $list = $(ele);
                // 遍历
                if ( jQuery.inArray( $list.html(), value) ) {
                    that.$MenuList.remove($list);
                }
            });
        }
    };

    /**
     * 获取值
     * @returns {Object}
     */
    Dropdown.prototype.getVal = function () {
        var self = this;
        return {
            showValue : self.selectShowValue,
            trueValue : self.selectTrueValue
        };
    };

    /**
     * 绑定事件
     */
    Dropdown.prototype.bindEvent = function () {
        var that = this;

        this.$DropdownBtn.on("click", function (event) {
            event.preventDefault();

            handleClick(event);
            return false;
        });

        this.$ShowResultInput.on("click", function (event) {
            event.preventDefault();

            handleClick(event);
            return false;
        }).on("focus", function (event) {
            event.preventDefault();

            handleClick(event);
            return false;
        });


        $("body").on("click", function(event){

            that.$MenuList.slideUp("fast", function() {
                that.isMenuDown = false;
                that.$DropdownBtn.removeClass("active");
            });
        });

        this.$MenuList.on("click", ".option", function (event) {
            // 阻止
            event.preventDefault();
            event.stopPropagation();

            var showValue = $(this).html();
            var trueValue = $(this).attr("data-value") || $(this).html();

            // 设置值
            that.setAllValue(showValue, trueValue);

            that.$DropdownBtn.removeClass("active");
            that.$ShowResultInput.removeClass("active");

            that.$MenuList.slideUp("fast",function () {
                that.$MenuList.removeClass("active");
                that.isMenuDown = false;
            });

            if ( that.callBack  && !! that.callBack) {
                // 回调
                that.callBack(showValue, trueValue);
            }

            return false;
        });

        var handleClick = function (event) {
            event.preventDefault();
            if ( !that.isMenuDown ) {
                that.$ShowResultInput.addClass("active");
                that.$DropdownBtn.addClass("active");
                that.$MenuList.slideDown("fast", function () {
                    that.isMenuDown = true;
                });
            } else {
                that.$DropdownBtn.removeClass("active");
                that.$ShowResultInput.removeClass("active");
                that.$MenuList.slideUp("fast", function () {
                    that.isMenuDown = false;
                });
            }
        };
    };

    if ( !win.Util ) {
        win.Util = {};
    }

    if ( !win.Util.UI ) {
        win.Util.UI = {};
    }

    win.Util.UI.DropDown = Dropdown;
})(window, jQuery);


(function (window, $, undefined) {

})(window, jQuery);

(function (win) {
     var getDaysOfMonth = function( year, month) {
        var DayCount;

        year = parseInt(year);
        month = parseInt(month);

        if (year < 1912 || month < 1 || month > 12 ) {
            return null;
        }

        switch ( month ) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                DayCount = 31;
                break;
            case 2:
                DayCount = 28;
                if ( year % 4 === 0 && year % 100 !== 0 || year % 400 === 0 ) {
                    DayCount = 29;
                }
                break;
            default:
                DayCount = 30;
                break;
        }
        return DayCount;
    };

    var _DatePicker =  function (config) {

        var defaultConfig = {};


        this.$Birthday   = $(config.selector);
        this.$Year       = this.$Birthday.find(".year-drop-down");
        this.$Month      = this.$Birthday.find(".month-drop-down");
        this.$Day        = this.$Birthday.find(".day-drop-down");

        this.config = config;

        this.YearPicker     = null;
        this.MonthPicker    = null;
        this.DayPicker      = null;

        this.init();
    };

    _DatePicker.prototype.init = function() {

        var config = this.config;

        var _date = new Date();
        var _years = config.years || null;

        var that = this;

        if ( !_years && !!config.beginYear && !!config.endYear  && (parseInt(config.endYear - config.beginYear) > 0) ) {
            _years = [];
            for (var i = config.endYear; i >= config.beginYear; i-- ) {
                _years.push(i);
            }
        }

        this.YearPicker  = new win.Util.DropDown(this.$Year, function (year) {
        }, _years, config.defaultYear);

        this.DayPicker   = new win.Util.DropDown(this.$Day, function() {
        }, ["请先选择月份"], config.defaultDay || _date.getDate());

        this.MonthPicker = new win.Util.DropDown(this.$Month, function () {
            that.setDays();
        }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], config.defaultMonth || _date.getMonth() + 1 );

        this.setDays();
    };

    _DatePicker.prototype.setDays = function() {
        var day = getDays(this.YearPicker.getVal(), this.MonthPicker.getVal());
        var days = [];

        for ( var i = 1; i <= day; i++ ) {
            days.push(i);
        }

        this.DayPicker.cleanMenu();
        var _day = this.DayPicker.getVal();

        if (_day > day ) {
            this.DayPicker.setValue(1);
        }

        this.DayPicker.fillMenu(days);
    };

    if (! win.Util ) {
        win.Util = {};
    }

    win.Util.BirthDayPicker = _DatePicker;
})(window);


(function (win) {
    /**
     * 切换菜单
     * @param switcher
     */
    function tabSwitcher(switcher) {
        var $Switcher   = switcher instanceof  jQery ? switcher : $(switcher);
        var $TabItems    = $Switcher.find(".tab-item"),
            $TabContentItems = $Switcher.find(".tab-content-wrap");

        var INDEX = 0;

        $TabItems.on("click", function (event) {
            event.preventDefault();

            var that = $(this);

            INDEX = that.index();
            var contentItem = $TabContentItems.eq(INDEX);

            if (that.hasClass("unactive")) {
                return;
            }

            $TabItems.removeClass("active");
            that.addClass("active");

            $TabContentItems.removeClass("active");
            contentItem.addClass("active");

        });
    }

    if ( !win.Util ) {
        win.Util = {};
    }

    win.Util.tabSwitcher = tabSwitcher;
    win.tabSwitcher = tabSwitcher;
})(window);


/**
 * 获取对象的类型
 * @param {Object} object
 * @returns {String} 对象的类型
 */
function getType(object) {
    return Object.prototype.toString.call(object).slice(8, -1);
}