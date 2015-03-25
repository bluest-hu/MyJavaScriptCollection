(function (win) {
    var _Cookie =  function () {

    };

    _Cookie.prototype.get = function (name) {

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

    _Cookie.prototype.set = function (name, value, days) {
        var expires = new Date();

        expires.setTime(expires.getTime() + days * 24 * 3600 * 1000);

        win.document.cookie = encodeURIComponent(name) +"="+ encodeURIComponent(value) +";expires=" + expires.toGMTString();
    };


    _Cookie.prototype.del = function (name) {
        var expires = new Date();
        expires.setTime(expires.getTime() - 1);

        win.document.cookie = name + "=" + ";expires=" + expires.toGMTString();
    };

    var myCookie = null;

    function getMyCookie() {
        return (myCookie ===  null) ? myCookie = new _Cookie() : myCookie;
    }

    var Cookie = getMyCookie();

    if (win.Util === undefined) {
        win.Util =  {};
    }

    win.Util.Cookie = Cookie;

})(window);