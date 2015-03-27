(function (win) {
    /**
     * 下拉菜单
     * @param {object} dropDown jQuery对象
     * @param {array} initData  初始化数据
     * @constructor
     */
    var DropDown = function ($dropDown, callBack, initData, defaultData) {
        this.$dropDown      = $dropDown;
        this.$result        = $dropDown.find(".input-box");
        this.$dropDownBtn   = $dropDown.find(".drop-down-btn");
        this.$dropDownArrow = $dropDown.find(".drop-down-arrow");
        this.$menuList      = $dropDown.find(".menu-list");

        // 下拉标志位
        this.isMenuDown     = false;
        // 回调函数 放处理事件 传入所下拉选择到的数据作为形参
        this.callBack       = callBack;
        // 初始化数据 数组格式
        this.initData       = initData || false;

        this.defaultData    = defaultData || null;

        this.selectValue    = this.$result.val() || null;

        this.init();
    };

    /**
     * 初始化操作
     */
    DropDown.prototype.init = function () {
        // 如果有初始化数据，那么初始化下拉菜单

        if ( this.initData && jQuery.type(this.initData) === "array" ) {
            this.fillMenu(this.initData);
        }

        if ( !!this.defaultData ) {
            this.setValue(this.defaultData);
        }

        // 绑定事件
        this.bindEvent();
    };

    /**
     *
     * @param data
     */
    DropDown.prototype.setValue = function (data) {
        this.selectValue = data;
        this.$result.val(data);
        this.$result.data("value", data);
    };


    /**
     * 输入数组将数组内的内容填充到下拉菜单中
     * @param {Array} data
     */
    DropDown.prototype.fillMenu = function (data) {
        // 清空下拉菜单
        var html = "";
        if (getType(data) === "Array") { // Array
            for (var i = 0, length = data.length; i < length; i++) {
                var tempHtml ='<li class="menu-item">'+
                                    '<a class="option" href="">' + data[i] + '</a>' +
                                '</li>';

                html += tempHtml;
            }
        }
        // 插入
        this.cleanMenu();
        this.$menuList.append($(html));
    };

    /**
     * 清空下拉菜单
     */
    DropDown.prototype.cleanMenu = function () {
        this.$menuList.html("");
    };

    /**
     * 添加单个数据
     * @param {string} data 字符串
     * @param {boolean}[prepend=false]  是否在列表最前面插入
     */
    DropDown.prototype.add = function (data, prepend) {
        prepend = prepend || false;

        var html = '<li class="menu-item">'+
            '<a class="option" href="">' + data + '</a>' +
            '</li>';

        // 如果是前置插入
        if (prepend) {
            this.$menuList.prepend($(html));
        } else {
            this.$menuList.append($(html));
        }
    };

    /**
     * 删除子菜单，根据菜单内容字符串删除
     * @param {String} value
     */
    DropDown.prototype.removeMenu = function (value) {
        var $lists = this.$menuList.find(".menu-item");
        var _this = this;
        if ( jQuery.type(value) === "array" ) {
            $lists.each(function(index,ele) {
                var $list = $(ele);
                // 遍历
                if ( jQuery.inArray( $list.html(), value) ) {
                    _this.$menuList.remove($list);
                }
            });
        }
    };

    /**
     *
     * @returns {*}
     */
    DropDown.prototype.getVal = function () {
        return this.selectValue;
    };

    /**
     * 绑定事件
     */
    DropDown.prototype.bindEvent = function () {
        var that = this;

        this.$dropDownBtn.on("click", function (event) {
            handleClick(event);
            return false;
        });

        this.$result.on("click", function (event) {
            handleClick(event);
            return false;
        });


        $("body").on("click", function(event){
            //event.preventDefault();
            // 阻止
            //event.stopPropagation();

            that.$menuList.slideUp("fast",function() {
                that.isMenuDown = false;
                that.$dropDownBtn.removeClass("active");
            });
            //return false;
        });

        this.$menuList.on("click", ".option", function (event) {
            // 阻止
            event.stopPropagation();
            var showValue = $(this).html();
            var selectValue = $(this).attr("data-value") || $(this).html();
            that.selectValue = selectValue;

            that.$result.val(showValue);
            that.$result.attr("data-value", selectValue);
            that.$dropDownBtn.removeClass("active");
            that.$result.removeClass("active");

            that.$menuList.slideUp("fast",function () {
                that.$menuList.removeClass("active");
                that.isMenuDown = false;
            });

            if ( that.callBack ) {
                // 回调
                that.callBack(showValue);
            }
            event.preventDefault();
            event.stopPropagation();
            return false;
        });

        var handleClick = function (event) {
            if ( !that.isMenuDown ) {
                that.$result.addClass("active");
                that.$dropDownBtn.addClass("active");
                that.$menuList.slideDown("fast", function () {
                    that.isMenuDown = true;
                });
            } else {
                that.$dropDownBtn.removeClass("active");
                that.$result.removeClass("active");
                that.$menuList.slideUp("fast", function () {
                    that.isMenuDown = false;
                });
            }

            event.preventDefault();
        };
    };

    if (!win.Util) {
        win.Util = {};
    }

    win.Util.DropDown = DropDown;
})(window);