//# sourceURL=polyfill.ie.8.js

if (!window.addEventListener) {
    var Event = function() { };
    Event.prototype.preventDefault = function () {
        this.nativeEvent.returnValue = false;
    };
    Event.prototype.stopPropagation = function () {
        this.nativeEvent.cancelBubble = true;
    };
    window.constructor.prototype.addEventListener = document.constructor.prototype.addEventListener = Element.prototype.addEventListener = function(type, listener, useCapture) {
        useCapture = !!useCapture;
        var cite = this;
        cite.__eventListener = cite.__eventListener || {};
        cite.__eventListener[type] = cite.__eventListener[type] || [[],[]];
        if (!cite.__eventListener[type][0].length && !cite.__eventListener[type][1].length) {
            cite.__eventListener['on' + type] = function (nativeEvent) {
                var newEvent = new Event, newNodeList = [], node = nativeEvent.srcElement || cite, property;
                for (property in nativeEvent) {
                    newEvent[property] = nativeEvent[property];
                }
                newEvent.currentTarget =  cite;
                newEvent.pageX = nativeEvent.clientX + document.documentElement.scrollLeft;
                newEvent.pageY = nativeEvent.clientY + document.documentElement.scrollTop;
                newEvent.target = node;
                newEvent.timeStamp = +new Date;
                newEvent.nativeEvent = nativeEvent;
                while (node) {
                    newNodeList.unshift(node);

                    node = node.parentNode;
                }
                for (var a, i = 0; (a = newNodeList[i]); ++i) {
                    if (a.__eventListener && a.__eventListener[type]) {
                        for (var aa, ii = 0; (aa = a.__eventListener[type][0][ii]); ++ii) {
                            aa.call(cite, newEvent);
                        }
                    }
                }
                newNodeList.reverse();
                for (var a, i = 0; (a = newNodeList[i]) && !nativeEvent.cancelBubble; ++i) {
                    if (a.__eventListener && a.__eventListener[type]) {
                        for (var aa, ii = 0; (aa = a.__eventListener[type][1][ii]) && !nativeEvent.cancelBubble; ++ii) {
                            aa.call(cite, newEvent);
                        }
                    }
                }
                nativeEvent.cancelBubble = true;
            };
            cite.attachEvent('on' + type, cite.__eventListener['on' + type]);
        }
        cite.__eventListener[type][useCapture ? 0 : 1].push(listener);
    }

    window.constructor.prototype.removeEventListener = document.constructor.prototype.removeEventListener = Element.prototype.removeEventListener = function(type, listener, useCapture) {
        useCapture = !!useCapture;
        var cite = this, a;
        cite.__eventListener = cite.__eventListener || {};
        cite.__eventListener[type] = cite.__eventListener[type] || [[],[]];
        a = cite.__eventListener[type][useCapture ? 0 : 1];
        for (eventIndex = a.length - 1, eventLength = -1; eventIndex > eventLength; --eventIndex) {
            if (a[eventIndex] == listener) {
                a.splice(eventIndex, 1)[0][1];
            }
        }
        if (!cite.__eventListener[type][0].length && !cite.__eventListener[type][1].length) {
            cite.detachEvent('on' + type, cite.__eventListener['on' + type]);
        }
    }
};

if ( !Date.prototype.toISOString ) {
    var pad = function(number) {
      if ( number < 10 ) {
        return '0' + number;
      }
      return number;
    }
    Date.prototype.toISOString = function() {
      return this.getUTCFullYear() +
        '-' + pad( this.getUTCMonth() + 1 ) +
        '-' + pad( this.getUTCDate() ) +
        'T' + pad( this.getUTCHours() ) +
        ':' + pad( this.getUTCMinutes() ) +
        ':' + pad( this.getUTCSeconds() ) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };
}

// getComputedStyle
!('getComputedStyle' in this) && (this.getComputedStyle = (function () {
    function getPixelSize(element, style, property, fontSize) {
        var
        sizeWithSuffix = style[property],
        size = parseFloat(sizeWithSuffix),
        suffix = sizeWithSuffix.split(/\d/)[0],
        rootSize;

        fontSize = fontSize != null ? fontSize : /%|em/.test(suffix) && element.parentElement ? getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) : 16;
        rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

        return (suffix == 'em') ? size * fontSize : (suffix == 'in') ? size * 96 : (suffix == 'pt') ? size * 96 / 72 : (suffix == '%') ? size / 100 * rootSize : size;
    }

    function setShortStyleProperty(style, property) {
        var
        borderSuffix = property == 'border' ? 'Width' : '',
        t = property + 'Top' + borderSuffix,
        r = property + 'Right' + borderSuffix,
        b = property + 'Bottom' + borderSuffix,
        l = property + 'Left' + borderSuffix;

        style[property] = (style[t] == style[r] == style[b] == style[l] ? [style[t]]
        : style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]]
        : style[l] == style[r] ? [style[t], style[r], style[b]]
        : [style[t], style[r], style[b], style[l]]).join(' ');
    }

    function CSSStyleDeclaration(element) {
        var
        currentStyle = element.currentStyle,
        style = this,
        fontSize = getPixelSize(element, currentStyle, 'fontSize', null);

        for (property in currentStyle) {
            if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
                style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px';
            } else if (property === 'styleFloat') {
                style['float'] = currentStyle[property];
            } else {
                style[property] = currentStyle[property];
            }
        }

        setShortStyleProperty(style, 'margin');
        setShortStyleProperty(style, 'padding');
        setShortStyleProperty(style, 'border');

        style.fontSize = fontSize + 'px';

        return style;
    }

    CSSStyleDeclaration.prototype = {
        constructor: CSSStyleDeclaration,
        getPropertyPriority: function () {},
        getPropertyValue: function ( prop ) {
            return this[prop] || '';
        },
        item: function () {},
        removeProperty: function () {},
        setProperty: function () {},
        getPropertyCSSValue: function () {}
    };

    function getComputedStyle(element) {
        return new CSSStyleDeclaration(element);
    }

    return getComputedStyle;
})(this));
