/**
 * @author ihuguowei@gmail.com
 * @version 1.0
 * @copyright GPL
 */

/** 
 * getElementsByClassName：返回相对应className的一组元素的集合
 * @access public
 * @param {string} className 
 * @param {HTMLElement|ArrayLike[NodeList]} [parentNodes = document] - HTMLHtmlElement Collection 
 * @returns {Array} 返回相对应className的一组元素的集合
 */
function getElementsByClassName(className, parentNodes) {
	parentNodes = parentNodes || document;
	parentNodes = toArray(parentNodes);
	var result = [], 
		tempSet = [];

	for ( var i = 0, length = parentNodes.length; i < length; i++) {
        
		if ( parentNodes[i].getElementsByClassName) {

			tempSet = parentNodes[i].getElementsByClassName(className);

			for ( var j = 0, tempSetLength = tempSet.length; j < tempSetLength; j++) {
				result.push(tempSet[j]);
			}
		} else {
			tempSet = parentNodes[i].getElementsByTagName("*");

			for ( var j = 0, tempSetLength = tempSet.length; j < tempSetLength; j++) {

				if (hasClassName(tempSet[j], className)) {
					result.push(tempSet[j]);
				}
			}
		}
	}

	return result;
}

/**
 * removeClassName 删除元素中相对应的className
 * @access public
 * @param {string} className
 * @param {ArrayLike[NodeList]} elements
 * @returns {NULL}
 */
function removeClassName(elements, className) {
	elements = toArray(elements);

	for ( var i = 0, length = elements.length; i < length; i++) {
		if (hasClassName(elements[i], className)) {
			if (elements[i].classList && elements[i].classList.remove) {
				elements[i].classList.remove(className);
			}  else {
				elements[i].className = (' ' + elements[i].className + ' ').replace(' ' + className + ' ', "");
				// 格式化className 
				elements[i].className = formatClassName(elements[i].className);
			}
		}
	}
}

/**
 * 向DOM元素或者一组DOM添加所给的函数名
 * @param {ArrayLike[NodeList]|Node} elements
 * @param {string} className
 * @returns {NULL}
 */
function addClassName(elements, className) {

	elements = toArray(elements);

	for ( var i = 0, length = elements.length; i < length; i++) {

		if (hasClassName(elements[i], className)) {
			return;
		} else {
			if (elements[i].classList && elements.classList.add) {
				elements[i].classList.add(className);
			} else {
				elements[i].className += (" " + className);
				// 格式化className
				elements[i].className = formatClassName(elements[i].className);
			}
		}
	}
}

/**
 * 切换类名
 * @param  {[type]} elements  [description]
 * @param  {[type]} className [description]
 * @return {[type]}           [description]
 */
function toogleClassName(elements, className) {
	elements = toArray(elements);

	for (var i = elements,length = elements.length; i < length ;i++) {
		if (elements[i].classList && elements[i].classList.toogle) {
			elements[i].classList.toogle(className);
		} else {
			if (hasClassName(elements[i], className)) {
				removeClassName(elements[i], className); 
			} else {
				addClassName(elements[i], className);
			}
		}
	}
}

/**
 * 判断元素是否存在给定的函数名
 * @access public
 * @param {Node} obj - 单个HTMLHtmlElement
 * @param {string} className
 * @returns {boolean} 
 */
function hasClassName(obj, className) {
	
	if (obj.className) {
		if (obj.classList && obj.classList.contains) {
			return obj.classList.contains(className);
		} else {
			return (' ' + obj.className + ' ').indexOf(' ' + className + ' ') != -1;
		}
	}
	return false;
}

/**
 * 格式化DOM元素的className，主要会去除首位多余的空格以及将字符串中多个空格合并成一个
 * @access private 这个函数并不公开
 * @param {string} str
 * @example 
 * 	aString = " class1 class2     class3 ";
 * 	return "class1 class2 class3";
 * @returns {string} 返回格式化后的字符串
 */
function formatClassName(str) {
	// 去除首位空格
	var tempStr = str;
	tempStr = tempStr.replace(/\s+/g, " ");
	// 将多个空格合并成一个空格
	tempStr = tempStr.replace(/(^\s*)|(\s*$)/g, "");
	return tempStr;
}


/**
 * 返回该元素的所有父元素（不包含body）的集合
 * @param {ArrayLike[NodeList]|Node} elements 
 * @return {ArrayLike[NodeList]|NULL}
 */
function getParentNodes(elements) {
	var parentNode;
	var result = [];

	elements = toArray(elements);

	for ( var i = 0, length = elements.length; i < length; i++) {
		parentNode = elements[i].parentNode;

		while (parentNode != undefined && parentNode != document.body && parentNode != document.documentElement) {

			result.push(parentNode);
			parentNode = parentNode.parentNode;
		}
	}
	
	if (result.length >= 1) {
		return result;
	} else {
		return null;
	}
}

/**
 * 返回该元素同级的所有元素的余下元素
 * @param  {ArrayLike[Nodelist]|node} elements 单个HTMLHtmlElement或者HTMLHtmlElement Collection 
 * @return {Array}          HTMLHtmlElement Collection
 */
function getNextSiblings(elements) {
	var tempSet = [], result = [], nextSibling;

	elements = toArray(elements);

	for ( var i = 0, length = elements.length; i < length; i++) {

		nextSibling = elements[i].nextSibling;

		// 先获得该元素所有相邻nextSibling元素集合。
		while (nextSibling) {
			tempSet.push(nextSibling);
			nextSibling = nextSibling.nextSibling;
		}

		// 然后进行过滤
		if (tempSet.length > 0) {
			for ( var j = 0, tempSetLength = tempSet.length; j < tempSetLength; j++) {
				if (tempSet[j].nodeType === 1) {
					result.push(tempSet[j]);
				}
			}
		}
	}
	return result;
}

/**
 * W3C DOM只有insertBefore方法，所以这里扩充insertAfter方法
 * @param  {ArrayLike[Nodelist]|node} newElements 单个HTMLHtmlElement或者HTMLHtmlElement Collection 
 * @param  {ArrayLike[Nodelist]|node} targetElements 单个HTMLHtmlElement或者HTMLHtmlElement Collection
 * @return {null}                
 */
function insertAfter(newElements, targetElements) {
	var nextSibling, parentNode;

	newElements = toArray(newElements);
	targetElements = toArray(targetElements);

	for ( var i = 0, targetLength = targetElements.length; i < targetLength; i++) {

		nextSibling = targetElements[i].nextSibling;
		parentNode = targetElements[i].parentNode;

		if (nextSibling) {

			for ( var j = 0, newLength = newElements.length; j < newLength; j++) {
				console.log(newElements[j])
				// 如果存在nextSibling，即使是TextElement也会成立
				parentNode.insertBefore(newElements[j], nextSibling);
			}
		} else {

			// 如果nextSibling不存在（情况是不存在TextElement）
			if (parentNode) {
				for ( var j = 0, newLength = newElements.length; j < newLength; j++) {

					parentNode.appendChild(newElements[i]);
				}
			}
		}
	}
}

/**
 * 在元素的字元素最前面开始插入子元素
 * @param  {ArrayLike[Nodelist]|Node} newElements 单个HTMLHtmlElement或者HTMLHtmlElement Collection
 * @param  {ArrayLike[Nodelist]|Node} targetElements 单个HTMLHtmlElement或者HTMLHtmlElement Collection
 * @return {null}           
 */
function preAppendChild(newElements, targetElements) {

	var firstChild;

	newElements = toArray(newElements);
	targetElements = toArray(targetElements);

	for ( var i = 0, targetLength = targetElements.length; i < targetLength; i++) {

		firstChild = targetElements[i].firstChild;
		if (firstChild) {

			for ( var j = 0, newLength = newElements.length; j < newLength; j++) {

				targetElements[i].insertBefore(newElements[j], firstChild);
			}
		} else {

			for ( var j = 0, newLength = newElements.length; j < newLength; j++) {

				targetElements[i].appendChild(newElements[j]);
			}
		}
	}
}

/**
 * 移除父元素的所有子元素
 * @param  {ArrayLike[Nodelist]|Node} elements 单个HTMLHtmlElement或者HTMLHtmlElement Collection
 * @return {null}          [description]
 */
function removeAllChildren(elements) {

	elements = toArray(elements);
	var firstChild;

	for ( var i = 0, length = elements.length; i < length; i++) {
		firstChild = elements[i].firstChild;

		while (firstChild) {

			elements[i].removeChild(firstChild);
			firstChild = elements[i].firstChild;
		}
	}
}

/**
 * [each description]
 * @param  {[type]} elements [description]
 * @param  {[type]} callBack [description]
 * @return {[type]}          [description]
 */
function each (elements, callBack) {
	elements = toArray(elements);

	for (var i = 0, length = elements.length; i < length; i++) {
		if (callBack && !!callBack) {
			callBack(i, elements[i]);
		}
	}
}

(function(win) {
	function addEvent(element, type, handler) {
		var elements  = toArray(element);

		for (var i = 1,length = elements.length; i < length; i++) {
			var ele = elements[i];

			if (ele.addEventListener) {
				ele.addEventListener(type, handler, false);
			} else if (ele.attchEvent) {
				ele.attachEvent("on" + type, handler);
			} else {
				ele["on" + type] = handler; 
			}
		}
	}
})(window);

/**
 * [isSupportAtteribute description]
 * @param  {[type]}  atteribute
 * @param  {[type]}  tagName
 * @return {Boolean}
 */
function isSupportAtteribute(atteribute, tagName) {
    return atteribute in document.createElement(tagName);
}

/**
 * [hasAtteribute description]
 * @param  {[type]}  node
 * @param  {[type]}  atterbute
 * @return {Boolean}
 */
function hasAtteribute(node, atteribute) {
    if (node.hasAtteribute) {
        return node.hasAtteribute(atteribute);
    } else {
        return node.getAtteribute(atteribute) === null;
    }
}

/**
 * 返回图像对象的原始大小（并非通过css设置后的）
 * @return {object} imageInfo
 */
function getOriginalImgInfo(src) {

	var imageInfo = {
		width : 0,
		height : 0
	};

	var newImage = new Image();
	newImage.src = src;

	imageInfo.height = newImage.height;
	imageInfo.width = newImage.width;

	return imageInfo;
}


/**
 * 事件绑定增强
 * @param {Array|Node}   targetElements 单个HTMLHtmlElement或者HTMLHtmlElement Collection
 * @param {string}   event          事件名（不带"on"）
 * @param {Function} fn             需要绑定的函数
 */
function addEvent(targetElements, event, fn) {
	targetElements = toArray(targetElements);

	for ( var i = 0, length = targetElements.length; i < length; i++) {

		if (targetElements[i].addEventListener) {

			// W3C 标准方法
			targetElements[i].addEventListener(event, fn, false);
		} else if (targetElements[i].attachEvent) {

			// 兼容IE方法
			targetElements[i].attachEvent("on" + event, fn);
		} else {
			targetElements[i]["on" + event] = fn;
		}
	}
}

/**
 * 阻止默认行为，兼容W3C与IE
 * @param  {event} evt 事件对象
 * @return {null|boolean=[false]}     如果W3C与IE方法都不支持，使用返回false
 */
function preDefault(evt) {
	if (evt.cancelable === true && evt.preventDefault != undefined) {
		// W3C的方法
		evt.preventDefault();
	} else {
		// IE的方法
		window.event.returnValue = false;
	}
	// 都不支持就返回False，也能达到阻止默认的效果。
	return false;
}

/**
 * 阻止事件冒泡
 * @param  {event} evt 事件对象
 * @return {null}     无返回值
 */
function stopBubble(evt) {
	if (evt && evt.stopPropagation) {
		// W3C的标准 方法
		evt.stopPropagation();
	} else {
		// 兼容IE
		window.event.cancelBubble = true;
	}
}

/**
 * 返回元素计算后的CSS属性的值
 * @param  {node} obj  单个HTMLHtmlElement
 * @param  {string} attr css属性
 * @return {string}      返回元素计算后的CSS属性的值，如果预期的值是数值，会带单位
 */
function getStyle(obj, attr) {

	var value = null;

	if (obj.style[attr]) {
		// 如果已经存在则直接返回
		value = obj.style[attr];

	} else if (window.getComputedStyle != undefined) {
		// W3C方法
		value = document.defaultView.getComputedStyle(obj, false).getPropertyValue(attr);
		
	} else {
		// 兼容IE方法
		value =  obj.currentStyle[attr];
		//在IE模式下有兼容问题
	}
	return value;
}

/**
 * 获取元素计算后的（实际的CSS值）；也可批量设置CSS的值，支持json
 * @param  {array|node} elements 单个HTMLHtmlElement或者HTMLHtmlElement Collection
 * @param  {json|string} json    用来设置CSS的属性与值（JSON）或者CSS属性（string）
 * @return {null|string}         如果传入是JSON则用于设置CSS，否则返回实际CSS的值，其他参数传入则返回空
 */
function css(elements, json) {
	// 如果传入格式为json则开始赋值
	if (typeof json === "object") {

		elements = toArray(elements);
		for ( var i = 0, length = elements.length; i < length; i++) {

			for ( var attr in json) {

				elements[i].style[attr] = json[attr];
			}
		}
	} else if (typeof json === "string" && elements.length === 1) {

		// 否则返回该css属性值
		return getStyle(elements, json);

	} else {

		return;
	}
}

/**
 * 返回元素的innerHTML内容或者设置元素innerHTML
 * @param  {array|node} elements 单个HTMLHtmlElement或者HTMLHtmlElement Collection
 * @param  {string|null} content  
 * @return {null}          
 */
function html(elements, content) {
	elements = toArray(elements);

	if (content) {

		for ( var i = 0, length = elements.length; i < length; i++) {
			elements[i].innerHTML = content;
		}
	} else {

		if (elements.length === 1) {
			return elements.innerHTML;
		} else {
			return ;
		}
	}
}

/**
 * 返回scroll信息
 * @return {object} 
 */
function getScrollInfo() {
	var info = {
		scrollTop : 0,
		scrollLeft : 0
	};

	addEvent(window, "scroll", setInfo);

	function setInfo() {
		// 兼容Chrome浏览器
		info.scrollLeft = document.body.scrollLeft
				+ document.documentElement.scrollLeft;
		info.scrollTop = document.body.scrollTop
				+ document.documentElement.scrollTop;
	}

	return info;
}

/**
 * 数组批量复制功能（这是一个无聊的鸡肋功能）
 * @param  {array} oldArray   目标数组
 * @param  {number} stopLength 新数组的最大下标
 * @return {array}            新数组
 */
function arrayCopy(oldArray, stopLength) {
	// 检查复制次数是否合法
	if (stopLength < 1 || typeof stopLength != "number") {
		
		return;

	} else {

		var oldArrayLength = oldArray.length,
            newArray = [];

		for ( var i = 0; i < stopLength; i++) {
			newArray[i] = oldArray[i % oldArrayLength];
		}

		return newArray;
	}
}

/**
 * jQuery源码偷来的
 * @param  {[type]} elements   [description]
 * @param  {[type]} callBackFn [description]
 * @param  {Boolean} []inv        [description]
 * @return {[type]}            [description]
 */
function grep(elements, callBackFn, inv) {

	var result = [], resultVal;
	inv = !!inv;

	for ( var i = 0, length = elements.length; i < length; i++) {

		resultVal = !!callBackFn(elements[i], i);

		if (resultVal != inv) {
			result.push(elements[i]);
		}
	}

	return result;
}


//本函数理想输入参数是浏览器getStyle的返回值
function parseColor(color) {
    var red,
        green,
        blue,
        colorArray;

    if (/rgb/i.test(color)) {
        
        if (/rgba/i.test(color)) { // 如果是rgba()则不解析
            return color;
        } else { // 如果是rgb()模式
            
            if (/%/.test(color)) { // 如果是用百分比来规定数值

                colorArray  = color.match(/\d+/g);

                red         = Math.round(colorArray[0] / 100 * 255);
                green       = Math.round(colorArray[1] / 100 * 255);
                blue        = Math.round(colorArray[2] / 100 * 255)

            } else { //如果是用数值来表示颜色
                var colorArray = color.match(/\d+/g);

                red     = colorArray[0];
                green   = colorArray[1];
                blue    = colorArray[2];
            }
        }
    } else if (/hsl/i.test(color)) { // 如果是hsl()形式

        if(/hsla/i.test(color)) { // 如果是hsla()形式，不进行处理直接返回

            return color;

        } else if(/%/.test(color)) { //如果是hsl()形式
            var colorArray = color.match(/\d+/g);

            /**
            ** H： Hue(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360 
            ** S： Saturation(饱和度)。取值为：0.0% - 100.0% 
            ** L： Lightness(亮度)。取值为：0.0% - 100.0% 
            **/
            var hue         = colorArray[0],
                saturation  = colorArray[1] / 100,
                lightness   = colorArray[2] / 100;

            var temp1,
                temp2,
                Rtemp3,
                Gtemp3,
                Btemp3; 
            
            // HSL => RGB 算法
            if (saturation === 0) {
                red = blue = green = lightness * 255;
            } else {

                if (lightness < 0.5) {
                    temp2 = lightness * (1.0 + saturation);
                } else if (lightness >= 0.5) {
                    temp2 = lightness + saturation - lightness * saturation;
                }
                
                temp1   = 2.0 * lightness - temp2;
                hue     = hue / 360;

                Rtemp3  = hue + 1.0 / 3.0;
                Gtemp3  = hue;
                Btemp3  = hue - 1.0 / 3.0;

                red     = Math.round(getTemp3(temp1, temp2, Rtemp3) * 255);
                green   = Math.round(getTemp3(temp1, temp2, Gtemp3) * 255);
                blue    = Math.round(getTemp3(temp1, temp2, Btemp3) * 255);
            }
        }

    } else if(/#/.test(color)) {  // HEX形式 
        var length = color.length;

        if(length === 7) { // 非简写形式

            red     = parseInt(color.slice(1, 3), 16);
            green   = parseInt(color.slice(3, 5), 16);
            blue    = parseInt(color.slice(5, 7), 16);

        } else if(length === 4) { // 如果是简写形式

            red     = parseInt(color.charAt(1) + color.charAt(1), 16);
            green   = parseInt(color.charAt(2) + color.charAt(2), 16);
            blue    = parseInt(color.charAt(3) + color.charAt(3), 16);
        }

    //如果设置为透明色或者无法解析的情况返回透明
    } else {
        return "transparent";
    }
    /**
    **  奇葩计算公式
    **/
    function getTemp3(temp1,temp2, temp3) {
        var color;

        if(temp3 < 0) {
            temp3 = temp3 + 1.0;
        } else if (temp3 > 1) {
            temp3 = temp3 - 1.0
        }

        if (6.0 * temp3 < 1) {
            color = temp1 + (temp2 - temp1) * 6.0 *temp3;
        } else if (2.0 * temp3 < 1) {
            color = temp2;
        } else if (3.0 * temp3 < 2) {
            color = temp1 +(temp2 - temp1) * (2.0 / 3.0 - temp3) * 6.0;
        } else {
            color = temp1;
        }
        
        return color;
    }
    // 返回计算后的RGB的值
    return {
        "r" : red,
        "g" : green,
        "b" : blue
    };
}

/**
 * [animation description]
 * @param  {[type]} elements   [description]
 * @param  {[type]} json       [description]
 * @param  {[type]} callBackFn [description]
 * @param  {[type]} step       [description]
 * @param  {[type]} dely       [description]
 * @return {[type]}            [description]
 */
function animation(elements, json, callBackFn, step, dely) {

	step = step || 6;
	dely = dely || 5;

	var element,
		stop,
		speed,
		dis,
		target;


	elements = toArray(elements);

	for ( var i = 0, length = elements.length; i < length; i++) {

		// 消除天杀的未知bug
		element = elements[i];

		// element.style.position = "absolute";

		//清除浮动
		if (element.timer) {
			window.clearInterval(element.timer);
		}

		element.timer = window.setInterval(function() {
			stop = true;

			for ( var attr in json) {

				if (attr == "opacity") {
					// 如果Style属性是透明，那么需要特殊对待
					currentVal = Math.round(parseFloat(getStyle(element, attr)) * 100);
				} else {
					currentVal = parseFloat(getStyle(element, attr));
				}

				target = parseInt(json[attr]);
				dis = json[attr] - currentVal;
				speed = dis / step;

				if (speed <= 1 && speed > 0) {
					speed = 1;
				} else if (speed < 0 && speed >= -1 ) {
					speed = - 1;
				}

				if (parseInt(currentVal) != target) {
					// 如果所有值没达到所设定的值 那么就不可以关闭定时器
					stop = false;
				} else if (currentVal + speed - target > 0 && target > 0 ) {
					stop = true;
				} else if (target < 0 &&  currentVal + speed > target) {
					stop = true;
				}

				if (stop) {
					currentVal = target;
					speed = 0;
				}

				if (attr === "opacity") {
					element.style.filter = "alpha(opacity:" + (currentVal + speed)+ ")";
					element.style.opacity = (currentVal + speed) / 100;
				} else {
					element.style[attr] = (currentVal + speed) + "px";
				}
			}

			// 停止定时器（如果所有值都达到了设定值）
			if (stop) {
				window.clearInterval(element.timer);

				if (callBackFn) {
					// 如果回调函数函数存在，那么运行该回掉函数
					callBackFn();
				}
			}
		}, dely);
	}
}

/**
 * [slideDown description]
 * @param  {[type]} elements [description]
 * @return {[type]}          [description]
 */
function slideDown(elements) {
	elements = toArray(elements);

	for (var i = 0, length = elements.length; i < length ; i++) {
		
		var element = elements[i];
		var height = getFullHeightWidth(element).height;

		setOpacity(element, 0);

		if ( getStyle(element, "display") == "none") {
			element.style.display = "block";
		}

		for (var j = 0; j <= 100; j += 5) {

			(function () {
				var pos = j; 
				setTimeout(function () {

					element.style.height = (pos / 100) * height + "px";

				}, (pos + 1) * 10)
			})();
		}
	}
}

/**
 * [getFullHeightWidth description]
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function getFullHeightWidth(element) {

	var info  = {
		height: null,
		width: null
	};

	var styleHeight = getStyle(element, "height");
	var styleWidth = getStyle(element, "width");

	var resetCss = {
			display: "",
			visibility: "hidden",
			position: "absolute"
		}

	if (getStyle(element,"display") != "none") {

		info.height =  element.offsetHeight || styleHeight;
		info.width = element.offsetWidth || styleWidth;

	} else {
		
		/** 保存旧的	CSS数据 **/
		var oldCss = {
			display: getStyle(element,"display"),
			visibility: getStyle(element, "visibility"),
			position:getStyle(element, "position")
		}
		// hack~~
		css(element, resetCss);

		info.height = element.clientHeight || styleHeight;
		info.width = element.clientWidth || styleWidth;
		// 恢复
		css(element, oldCss);
	}

	return info;
}

/**
 * [faseIn description]
 * @param  {[type]} elements [description]
 * @return {[type]}          [description]
 */
function faseIn(elements) {
	elements = toArray(elements);

	for (var i = 0, length = elements.length; i < length; i++ ) {
		var element = elements[i];

		//先隐藏
		setOpacity(element, 0);

		if (getStyle(element, "display") == "none") {
			element.style.display = "block";
		}

		if(getStyle(element, "visibility") == "hidden") {
			element.style.visibility = "visible";
		}

		for (var j = 0 ; j <= 100; j += 5){
			
			var pos = j;

			(function () {
				setTimeout(function () {

					setOpacity(element, pos);

				}, (pos + 1) * 10); 
			})()
		}
	}
}

// 内置工具函数
/**
 * [setOpacity description]
 * @param {[type]} element [description]
 * @param {[type]} value   [description]
 */
function setOpacity(element, value) {
	if(element.style.filter) {
		element.style.filter = "alpha(opacity=" + value + ")";
	} else {
		element.style.opacity = value / 100;
	}
}

/**
 * 工具函数，把任何单个元素转换成数组  （这里不对输入进行过滤）
 * @param  {[type]} inputArray [description]
 * @return {[type]}            [description]
 */
function toArray(input) {

	var result = [];

	if ( isArray(input) ) {  // 如果是数组直接返回
		result = input;
	} else if (!input.length) {
		result.push(input);
	} else { // 这里默认是HTMLCollection
		result = input;
	}
	return result;
}

/**
 * 判断是不是Array类型
 * @param  {[type]}  input [description]
 * @return {Boolean}       [description]
 */
function isArray(input) {
	if (Array.isArray()) {
		return Array.isArray(input);
	} else {
		return Object.prototype.toString.call(input) === "[object Array]";
	}
}

/**
 * [is description]
 * @param  {[type]}  obj  [description]
 * @param  {[type]}  type [description]
 * @return {Boolean}      [description]
 */
function is(obj, type)  {
  return Object.prototype.toString.call(obj).slice(8, -1) === type;
}

/**
 * [ajax description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function ajax(config, callBack) {
    var url,
        method,
        async;
    
    if (config) {
        url     = config.url;
        method  = config.method || "GET";
        async   = config.async || true; 
    }

	var xhr = null;

	if (window.XMLHttpRequest) {
	    xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
    	try {
	        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    	} catch (e) {
    		xhr = null;
    	}
    }

    if (xhr) {
        xhr.open(method, url + "?" + Math.random(), async);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) { 

            	var response;
    			var contentType = xhr.getResponseHeader("Content-Type");
    			
    			if (callBack) {
    				if (contentType === "application/json") {
    					
    					response = xhr.responseText;
    				
    					if (JSON && JSON.parse) {
    						callBack.call(xhr, JSON.parse(response));
    					} else {
    						callBack.call(xhr, eval("(" + response + ")"));
    					}

    				} else if (contentType == "text/xml" || contentType == "application/xml") {
    					response = xhr.responseXML;
    					callBack.call(xhr, response);
    				} else {

    					response = xhr.responseText;
    					callBack.call(xhr, response);
    				}
    			}
            }
        }
    }

    xhr.send(null);
}

/**
 * [inArray description]
 * @param  {[type]} inputArray [description]
 * @param  {[type]} iteam      [description]
 * @return {[type]}            [description]
 */
function inArray(inputArray, iteam) {

	for (var i in inputArray) {
		if (iteam === inputArray[i]) {
			return true;
		}
	}
	return false;
}

/**
 * [getOffsetToRoot description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function getOffsetToRoot(obj) {
	var info = {
		offsetTop : 0,
		offsetLeft : 0,
		offsetRight : 0,
		offsetBottom : 0
	}

	var offsetParent = obj.offsetParent;

	while(offsetParent && offsetParent != document.documentElement){

		info.offsetTop += obj.offsetTop;
		info.offsetleft += obj.offsetleft;
		info.offsetRightt += obj.offsetRight;
		info.offsetBottom += obj.offsetBottom;

		obj = obj.offsetParent;
		offsetParent = obj.offsetParent;
	}

	return info;
}


/**
 * [data description]
 * @param  {[type]} element [description]
 * @param  {[type]} attr    [description]
 * @param  {[type]} data    [description]
 * @return {[type]}         [description]
 */
function data(element, attr, data) {
	var elements = toArray(elemente);

	for (var i = 0, length = elements.length)


}

/**
 * [setData description]
 */
function setData(elements, attr, data) {
	elements = toArray(elements);

	if (arguement.length === 3) {
		for ( var i = 0, length = elements.length; i < length; i++ ) {
			elements[i].setAttribute("data-" + attr, data);
		}
	} else if (arguement.length === 2) {
		var json = attr;
		for (var i = 0 ,length = elements.length; i < length; i++) {
			for (var j in json) {
				elements[i].setAttribute("data" + j, json.j);
			}
		}
	}
}

/**
 * [getData description]
 * @return {[type]}
 */
function getData(elements, attr) {
	
}

/**
 * [random description]
 * @param  {[type]} max [description]
 * @param  {[type]} min [description]
 * @return {[number]}     [description]
 */
function random(max, min) {

	if (max < 0 || min < 0) {
		return ;
	}

	min = min || 0;

	if (max != undefined) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	} else {
		return Math.random();
	}
}

/**
 * [toDegree description]
 * @param  {[number]} num [description]
 * @return {[number]}     [description]
 */
function toDegree(num) {
    num = num * (Math.PI / 180);
	return num;
}

/**
 * 测试浏览器是否支持CSS 属性
 * @param  {[type]} attrbute [description]
 * @return {[type]}          [description]
 */
function checkSupportCSSStlye(attrbute) {

	attrbute = convertCSSAtterbuteNameToCamelStyle(attrbute);

	var div = document.createElement("div");
	var styles  = div.style;

	if (attrbute in styles) {
		return true;
	}
	return false; 
}

/**
 * [checkSupportAtteribute description]
 * @param  {[type]} tagName    [description]
 * @param  {[type]} atteribute [description]
 * @return {[type]}            [description]
 */
function checkSupportAtteribute(tagName, atteribute) {
	return atteribute in document.createElement(tagName);
}

/**
 * [hasAtteribute description]
 * @param  {[type]}  element   [description]
 * @param  {[type]}  attribute [description]
 * @return {Boolean}           [description]
 */
function hasAtteribute (element, attribute) {
	return element.getAtteribute(attribute) === null;
}

/**
 * [convertCSSAtterbuteNameToCamelStyle description]
 * @param  {[type]} attrbuteName [description]
 * @return {[type]}              [description]
 */
function convertCSSAtteributeNameToCamelStyle(attrbuteName) {
	attrbuteName = attrbuteName.toLowerCase();

	if (attrbuteName.indexOf("-") != 0) {

		var attrbutes = attrbuteName.split("-");

		for (var i = 0, length = attrbutes.length; i < length; i++ ) {
			if (i > 0) {
				var temp = "";

				for (var j = 0, length2 = attrbutes[i].length; j < length2; j ++) {

					if (j === 0) {
						temp += attrbutes[i].charAt(j).toUpperCase();				
					} else {
						temp += attrbutes[i].charAt(j).toLowerCase();
					}
				}
				attrbutes[i] = temp;
			}
		}

		return attrbutes.join("");

	} else if (attrbuteName === "float") {
		return "cssFloat";
	} else {
		return attrbuteName;
	}
}

/**
 * 去除空格
 * @param  {[type]} string [description]
 * @return {[type]}        [description]
 */
function trim(string) {
	if (string.trim) {
		return string.trim();
	} else {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
}


;(function (window) {

	var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestionFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame  || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame ||window.mozCancelRequestAnimationFrame;
	var lastTime = 0;

	if (!requestAnimationFrame) {
		requestAnimationFrame = function (callBackFn) {
			var currTime = new Date().getTime();
			// 这一句第一次执行时候timeTocall 为 0
			var timeTocall = Math.max(0, 16.7 - (currTime - lastTime));

			var id = window.setTimeout(function () {
				callBackFn();
			}, timeTocall);

			lastTime = currTime + timeTocall;

			return id;
		}
	}

	if (!cancelAnimationFrame) {
		cancelAnimationFrame = function (id) {
			clearTimeOut(id);
		}
	}

	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
})(window);
/**
firstElementChild
lastElementChild
previousElementSibling
nextElementSibling
children

querySelector
querySelectorAll

classList

classList.add()
classList.toogle();
classList.remove();
classList.contains()



dataSet["*"]

**/



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


/**
 * 一级级找到父级并进行相应的操作
 * @param  {Object} $Target    jQuery对象
 * @param  {function} test     测试条件函数
 * @param  {function} callBack 符合条件的回调（传入测试成功的父类元素）
 * @param  {function} stop     停止条件函数
 * @return null
 */
function walkThroughParents($Target, test, callBack, stop) {

	var $Parent = $Target.parent();

	stop = !!stop ? stop : function (value) {
        return value.attr("tagName") === "html";
    };

    //如果条件成立
    if ( test && !!test($Parent) ) {
		callBack($Parent);
	}

    // 达到终止条件 遍历结束
    if ( stop && !!stop($Parent) ) {
        return ;
    } else {
        $Target = $Parent;

        // 未达到终止条件 遍历继续
        walkThroughParents($Target, test, callBack, stop);
    }
}
