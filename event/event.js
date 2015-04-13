(function (window, undefined){

	/**
	 * 索引号
	 * @type {Number}
	 */
	var __guid = 0;


	var Event = {};

	/**
	 * [on description]
	 * @param  {[type]} element [description]
	 * @param  {[type]} type    [description]
	 * @param  {[type]} handler [description]
	 * @return {[type]}         [description]
	 */
	Event.on = function (element, type, handler) {

		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
			return ;
		}

		if ( !handler.__guid ) {
			handler.__guid = __guid++;
		}

		if ( !element.events ) {
			element.events = {};
		}

		if ( !element.events[type] ) {
			element.events[type] = {};
			// 存储先前的事件
			if (!!element["on" + type]) {
				element.events[type][0] = element["on" + type];
			}
		}

		element.events[type][handler.__guid] = handler;

		element['on' + type] = this.handler;
	};

	Event.off = function (element, type, hadler) {
		if (!element.events) {
			return;
		}


	};

	Event.handler = function (event) {

        var handlers = this.events[event.type];

        for (var __guid in  handlers) {
            if (handlers.hasOwnProperty(__guid)) {
                var _handler = handlers[__guid];
                this.handler = _handler;
                this.handler(event);
            }
        }
    };

    function fixEvent(event) {
    	
    }

	Event.fire = function (type) {

	};

	if ( !window.event ) {
		window.event = {};
	}

	window.myEvent = Event;
})(window);