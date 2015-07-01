(function (win) {
    var _Cookie =  {};
    
    /**
     * 获取cookie的key所对应的value
     * @param  {String} name cookies的key
     * @return {String}      返回指定cookie的key所对应的value
     */
    _Cookie.get = function (name) {

        var cookie = win.document.cookie;

        if (cookie.length <= 0) {
            return null;
        }

        var start = cookie.indexOf(name + "=");

        if (start === -1) {
            return null;
        }

        start += name.length + 1;

        var end = cookie.indexOf(";", start);

        if (end === -1) {
            end = cookie.length;
        }

        return decodeURIComponent(cookie.substring(start, end));
    };

    /**
     * 设置cookies
     * @param {[type]}  name  cookies的key
     * @param {[type]}  value cookies的value
     * @param {Number}  days  过期时间（单位为天）
     * @param {String}  path
     * @param {Boolean} secure
     */
    // todo 完善时间（除天以为的其他单位），以及其他选项
    _Cookie.set = function (name, value, days, domain, path, secure) {
        var expires = new Date();

        expires.setTime(expires.getTime() + days * 24 * 3600 * 1000);

        win.document.cookie = encodeURIComponent(name) +"="+ encodeURIComponent(value) +";expires=" + expires.toGMTString();
    };

    /**
     * 删除相对应cookies下key的value值
     * @param  {String} name 说要删除cokies的值得项
     */
    _Cookie.del = function (name) {
        var expires = new Date();
        expires.setTime(expires.getTime() - 1);

        win.document.cookie = name + "=" + ";expires=" + expires.toGMTString();
    };

    var Cookie = _Cookie;

    if (win.Util === undefined) {
        win.Util =  {};
    }

    win.Util.Cookie = Cookie;

})(window);