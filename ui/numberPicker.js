
(function (window, $, undefined) {
    var defaultConfig = {
            max : null,
            min : null,
            step : 1,
            float : false,
            default: 1
    };

    var _numberPicker = function (selector, config) {
        this.$Ele = null;

        this.$Input = null;

        this.$AddBtn = null;

        this.$reduceBtn = null;

        this.max = 0;

        this.min = null;

        this.step = null;

        this.value = 0;

        this.default = 0;

        this.init(selector, config);
    };

    _numberPicker.prototype.init = function (selector,config) {
        

        this.$Ele = $(selector);
        this.$Input = this.$Ele.find("input[type='text']");
        this.$AddBtn = this.$Ele.find(".number-add-btn");
        this.$reduceBtn = this.$Ele.find(".number-reduce-btn");

        if ( !config ) {
            config = {};
        }

        this.max = (config.max !== undefined && $.isNumeric(config.max)) ? (1 * config.max) : defaultConfig.max;
        this.min = (config.min !== undefined && $.isNumeric(config.min)) ? (1 * config.min) : defaultConfig.min;
        this.step = (config.step !== undefined && $.isNumeric(config.step)) ? (1 * config.step) : defaultConfig.step;
        // 接受 浮点数字
        this.float = !!config.float;
        this.default = (config.default !== undefined && $.isNumeric(config.default)) ? (1 * config.default) : defaultConfig.default;


        var domDataMin = this.$Input.data("min");
        var domDataMax = this.$Input.data("max");
        var domDataDefault = this.$Input.data("default");

        this.max = (domDataMax !== undefined && $.isNumeric(domDataMax) ? (1 * domDataMax) : this.max);
        this.min = (domDataMin !== undefined && $.isNumeric(domDataMin) ? (1 * domDataMin) : this.min);
        this.default = (domDataDefault !== undefined && $.isNumeric(domDataDefault) ? (1 * domDataDefault) : this.default);

        //  防止出现 最小值 大于 最大值 的二逼状态
        if (this.max !== null && this.min !== null) {
            if (this.max < this.min) {
                var temp = this.max;
                this.min = this.max;
                this.min = temp;
            }
        }

        this.bindAction();
    };

    /**
     * 绑定 事件
     */
    _numberPicker.prototype.bindAction = function() {
        var self = this;
        this.$AddBtn.on("click", function (event) {
            event.preventDefault();

            var value  = self.value;
            value += self.step;

            self.setValue(value);
        });

        this.$reduceBtn.on("click", function (event) {
            event.preventDefault();

            var value = self.value;

            value -= self.step;

            self.setValue(value);
        });

        this.$Input.on("blur", function() {

            var value = self.getValue();

            self.setValue(value);
        });
    };

    _numberPicker.prototype.getValue = function () {
        var self = this;

        var _value = this.$Input.val();

        _value = 1 * _value.match(/^\d+\.\d+|^\d+/g);


        if ( !$.isNumeric(_value) ) {
            _value = self.default;
        }

        if ( ! self.float ) {
            _value = parseInt(_value);
        }

        this.value = _value;

        return this.value;
    };

    /**
     *  
     * @param value {Number} 设置数字
     */
    _numberPicker.prototype.setValue = function (value) {
        if ( !this.float ) {
            value = parseInt(value);
        } else {
            value = parseFloat(value);
        }

        // 如果不是数字 直接放弃
        if (isNaN(value) ) {
            value = this.default;
        }

        if ( this.max !== null && value > this.max ) {
            value = this.max;
        }

        if ( this.min !== null && value < this.min) {
            value = this.min;
        }

        this.value = value;

        this.$Input.val(value);
        this.$Input.attr("value", value);
    };

    if ( !window.Util ) {
        window.Util = {};
    }   

    if ( !window.Util.UI ) {
        window.Util.UI = {};
    }

    window.Util.UI.NumberPicker = _numberPicker;

})(window,jQuery);
