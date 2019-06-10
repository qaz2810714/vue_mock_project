/*
 消息推送Engine
  @author hua.huang   [2017-07-25]
  特性介绍：
      1、通过实现方案自动切换，支持目前所有浏览器
      2、独立小巧，不依赖于第三方包
      2、支持通道特性，默认channel=Biz，channel=Monitor为监控通道
      2、支持消息按类型监听，供不同业务类别使用
      2、消息缓存机制，确保长轮询工作模式下不丢失消息
      2、客户端或服务端一方断线、异常，另一方能立即感知
      2、基于纯异步事件模型提供编程，支持onOpen、onClose、onError、onMessage事件
      3、允许客户端主动断开链接
      4、当采用websocket或者XMLHttpRequest 2时才支持流传输，XMLHttpRequest 1不支持流
         另外，当采用XMLHttpRequest（1或2）时，因HTTP 1.1协议限制客户端同时持有的长链接数，导致会有一定使用限制
      5、浏览器支持情况以及使用的实现方案如下：
        Websocket: 基于HTML5之后出现的新协议 websocket
        Stream：基于HTML5之后出现的XMLHTTPRequest 2 才支持流传输
        lpool：基于XMLHTTPRequest（1）支持的异步文本传输请求
         |—————————|——————|—————|————|——————|
         |      浏览器      |  Websocket |  Stream  |  Lpool |   默认方案 |
         |—————————|——————|—————|————|——————|
         | IE 6\7\8\9       |     ×     |    ×    |   √   |    lpool   |
         |—————————|——————|—————|————|——————|
         | IE 10+           |     √     |    √    |   √   |  Websocket |
         |—————————|——————|—————|————|——————|
         | Chrome 4.0+      |     √     |    √    |   √   |  Websocket |
         |—————————|——————|—————|————|——————|
         | Opera 11.10+     |     ×     |    ×    |   √   |    lpool   | 
         |—————————|——————|—————|————|——————|
         | Safari 5+        |     √     |    √    |   √   |  Websocket |
         |—————————|——————|—————|————|——————|
         | Firefox 3.0+     | √ 需设置  |    √    |   √   |  Websocket |
         |—————————|——————|—————|————|——————|
 */
var JS = {
    version: '0.0.2'
};

// 要写兼容性代码时：优先使用浏览器功能检测，次之浏览器癖好检测，最后考虑userAgent检测
JS.Runtime = (function() {
    var ua = navigator.userAgent.toLowerCase(),
    check = function(r) {
        return r.test(ua);
    },
    // 浏览器识别
    isOpera = check(/opera/),
    isFirefox = check(/firefox/),
    isChrome = check(/chrome/),
    isWebKit = check(/webkit/),
    isSafari = !isChrome && check(/safari/),
    isSafari2 = isSafari && check(/applewebkit\/4/),
    isSafari3 = isSafari && check(/version\/3/),
    isSafari4 = isSafari && check(/version\/4/),
    isIE = !isOpera && check(/msie/),
    isIE7 = isIE && check(/msie 7/),
    isIE8 = isIE && check(/msie 8/),
    isIE6 = isIE && !isIE7 && !isIE8,
    isGecko = !isWebKit && check(/gecko/),
    isGecko2 = isGecko && check(/rv:1\.8/),
    isGecko3 = isGecko && check(/rv:1\.9/),
    // 操作系统识别
    isWindows = check(/windows|win32/),
    isMac = check(/macintosh|mac os x/),
    isAir = check(/adobeair/),
    isLinux = check(/linux/),
    // 是否支持websocket
    isWebsocketSupported = 'WebSocket' in window || 'MozWebSocket' in window;
    return {
        isOpera: isOpera,
        isFirefox: isFirefox,
        isChrome: isChrome,
        isWebKit: isWebKit,
        isSafari: isSafari,
        isSafari2: isSafari2,
        isSafari3: isSafari3,
        isSafari4: isSafari4,
        isIE: isIE,
        isIE7: isIE7,
        isIE8: isIE8,
        isIE6: isIE6,
        isGecko: isGecko,
        isGecko2: isGecko2,
        isGecko3: isGecko3,
        isWindows: isWindows,
        isMac: isMac,
        isAir: isAir,
        isLinux: isLinux,
        isWebsocketSupported : isWebsocketSupported
    };
} ());
JS.isOpera = JS.Runtime.isOpera;
JS.isFirefox = JS.Runtime.isFirefox;
JS.isChrome = JS.Runtime.isChrome;
JS.isWebKit = JS.Runtime.isWebKit;
JS.isSafari = JS.Runtime.isSafari;
JS.isSafari2 = JS.Runtime.isSafari2;
JS.isSafari3 = JS.Runtime.isSafari3;
JS.isSafari4 = JS.Runtime.isSafari4;
JS.isIE = JS.Runtime.isIE;
JS.isIE7 = JS.Runtime.isIE7;
JS.isIE8 = JS.Runtime.isIE8;
JS.isIE6 = JS.Runtime.isIE6;
JS.isGecko = JS.Runtime.isGecko;
JS.isGecko2 = JS.Runtime.isGecko2;
JS.isGecko3 = JS.Runtime.isGecko3;
JS.isWindows = JS.Runtime.isWindows;
JS.isMac = JS.Runtime.isMac;
JS.isAir = JS.Runtime.isAir;
JS.isLinux = JS.Runtime.isLinux;
JS.isWebsocketSupported = JS.Runtime.isWebsocketSupported;

JS.Syntax = {
    nameSpace: function() {
        if (arguments.length) {
            var o, d, v;
            for (var i = 0,
            len = arguments.length; i < len; i++) {
                v = arguments[i];
                if (!v) {
                    continue;
                }
                d = v.split(".");
                for (var j = 0, len = d.length; j < len; j++) {
                    if (!d[j]) {
                        continue;
                    }
                    o = window[d[j]] = window[d[j]] || {};
                }
            }
        }
        return o;
    },
    apply: function(o, c, defaults) {
        if (defaults) {
            JS.Syntax.apply(o, defaults);
        }
        if (o && c && typeof c === 'object') {
            for (var p in c) {
                o[p] = c[p];
            }
        }
        return o;
    },
    override: function(origclass, overrides) {
        if (overrides) {
            var p = origclass.prototype;
            JS.Syntax.apply(p, overrides);
            if (JS.Runtime.isIE && overrides.hasOwnProperty('toString')) {
                p.toString = overrides.toString;
            }
        }
    },
    // 封装继承
    extend: function() {
        var io = function(o) {
            for (var m in o) {
                this[m] = o[m];
            }
        };
        // Object原生的未改写的构造方法
        var oc = Object.prototype.constructor;
        // 继承
        return function(baseClass, extClass, overrides) {
            if (JS.Syntax.isObject(extClass)) {
                overrides = extClass;
                extClass = baseClass;
                baseClass = overrides.constructor !== oc ? overrides.constructor: function() {
                    extClass.apply(this, arguments);
                };
            }
            var F = function() {},
            sbp,
            spp = extClass.prototype;
            F.prototype = spp;
            sbp = baseClass.prototype = new F();
            sbp.constructor = baseClass;
            baseClass.superclass = spp;
            if (spp.constructor === oc) {
                spp.constructor = extClass;
            }
            baseClass.override = function(o) {
                JS.Syntax.override(baseClass, o);
            };
            sbp.superclass = sbp.supr = (function() {
                return spp;
            });
            sbp.override = io;
            JS.Syntax.override(baseClass, overrides);
            baseClass.extend = function(o) {
                return JS.Syntax.extend(baseClass, o);
            };
            return baseClass;
        };
    } (),
    callBack: function(fn, scope, arg) {
        if (JS.isFunction(fn)) {
            return fn.apply(scope || window, arg || []);
        }
    },
    isEmpty: function(v, allowBlank) {
        return v === null || v === undefined || ((Ext.isArray(v) && !v.length)) || (!allowBlank ? v === '': false);
    },
    isArray: function(v) {
        return Object.prototype.toString.apply(v) === '[object Array]';
    },
    isDate: function(v) {
        return Object.prototype.toString.apply(v) === '[object Date]';
    },
    isObject: function(v) {
        return !! v && Object.prototype.toString.call(v) === '[object Object]';
    },
    isPrimitive: function(v) {
        return Ext.isString(v) || Ext.isNumber(v) || Ext.isBoolean(v);
    },
    isFunction: function(v) {
        return Object.prototype.toString.apply(v) === '[object Function]';
    },
    isNumber: function(v) {
        return typeof v === 'number' && isFinite(v);
    },
    isString: function(v) {
        return typeof v === 'string';
    },
    isBoolean: function(v) {
        return typeof v === 'boolean';
    },
    isElement: function(v) {
        return !! v && v.tagName;
    },
    isDefined: function(v) {
        return typeof v !== 'undefined';
    },
    toArray: function() {
        return JS.isIE ?
        function(a, i, j, res) {
            res = [];
            for (var x = 0, len = a.length; x < len; x++) {
                res.push(a[x]);
            }
            return res.slice(i || 0, j || res.length);
        }: function(a, i, j) {
            return Array.prototype.slice.call(a, i || 0, j || a.length);
        };
    } ()
};
JS.ns = JS.Syntax.nameSpace;
JS.apply = JS.Syntax.apply;
JS.override = JS.Syntax.override;
JS.extend = JS.Syntax.extend;
JS.callBack = JS.Syntax.callBack;
JS.isEmpty = JS.Syntax.isEmpty;
JS.isArray = JS.Syntax.isArray;
JS.isDate = JS.Syntax.isDate;
JS.isObject = JS.Syntax.isObject;
JS.isPrimitive = JS.Syntax.isPrimitive;
JS.isFunction = JS.Syntax.isFunction;
JS.isNumber = JS.Syntax.isNumber;
JS.isString = JS.Syntax.isString;
JS.isBoolean = JS.Syntax.isBoolean;
JS.isElement = JS.Syntax.isElement;
JS.isDefined = JS.Syntax.isDefined;
JS.toArray = JS.Syntax.toArray;

JS.DomEvent = {
    on: function(el, name, fun, scope) {
        if (el.addEventListener) {
            el.addEventListener(name,
            function() {
                JS.callBack(fun, scope, arguments);
            },
            false);
        } else {
            el.attachEvent('on' + name,
            function() {
                JS.callBack(fun, scope, arguments);
            });
        }
    },
    un: function(el, name, fun, scope) {
        if (el.removeEventListener) {
            el.removeEventListener(name, fun, false);
        } else {
            el.detachEvent('on' + name, fun);
        }
    },
    stop: function(e) {
        e.returnValue = false;
        if (e.preventDefault) {
            e.preventDefault();
        }
        JS.DomEvent.stopPropagation(e);
    },
    stopPropagation: function(e) {
        e.cancelBubble = true;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
    }
};
JS.on = JS.DomEvent.on;
JS.un = JS.DomEvent.un;

JS.DelayedTask = function(fn, scope, args) {
    var me = this,
    id, call = function() {
        clearInterval(id);
        id = null;
        fn.apply(scope, args || []);
    };
    me.delay = function(delay, newFn, newScope, newArgs) {
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };
    me.cancel = function() {
        if (id) {
            clearInterval(id);
            id = null;
        }
    };
};

JS.ns("JS.Observable");
JS.Observable = function(o) {
    JS.apply(this, o || JS.toArray(arguments)[0]);
    if (this.events) {
        this.addEvents(this.events);
    }
    if (this.listeners) {
        this.on(this.listeners);
        delete this.listeners;
    }
};
JS.Observable.prototype = {
    on: function(eventName, fn, scope, o) {
        if (JS.isString(eventName)) {
            this.addListener(eventName, fn, scope, o);
        } else if (JS.isObject(eventName)) {
            this.addListeners(eventName, scope, o);
        }
    },
    fireEvent: function() {
        var arg = JS.toArray(arguments),
        eventName = arg[0].toLowerCase(),
        e = this.events[eventName];
        if (e && !JS.isBoolean(e)) {
            return e.fire.apply(e, arg.slice(1));
        }
    },
    addEvent: function(eventName) {
        if (!JS.isObject(this.events)) {
            this.events = {};
        }
        if (this.events[eventName]) {
            return;
        }
        if (JS.isString(eventName)) {
            this.events[eventName.toLowerCase()] = true;
        } else if (eventName instanceof JS.Event) {
            this.events[eventName.name.toLowerCase()] = eventName;
        }
    },
    addEvents: function(arr) {
        if (JS.isArray(arr)) {
            for (var i = 0,
            len = arr.length; i < len; i++) {
                this.addEvent(arr[i]);
            }
        }
    },
    addListener: function(eventName, fn, scope, o) {
        eventName = eventName.toLowerCase();
        var e = this.events[eventName];
        if (e) {
            if (JS.isBoolean(e)) {
                e = this.events[eventName] = new JS.Event(eventName, this);
            }
            e.addListener(fn, scope, o);
        }
    },
    addListeners: function(obj, scope, o) {
        if (JS.isObject(obj)) {
            for (var p in obj) {
                this.addListener(p, obj[p], scope, o);
            }
        }
    },
    removeListener: function(eventName, fn, scope) {
        eventName = eventName.toLowerCase();
        var e = this.events[eventName];
        if (e && !JS.isBoolean(e)) {
            e.removeListener(fn, scope);
        }
    },
    clearListeners: function() {
        var events = this.events,
        e;
        for (var p in events) {
            e = events[p];
            if (!JS.isBoolean(e)) {
                e.clearListeners();
            }
        }
    },
    clearEvents: function() {
        var events = this.events;
        this.clearListeners();
        for (var p in events) {
            this.removeEvent(p);
        }
    },
    removeEvent: function(eventName) {
        var events = this.events,
        e;
        if (events[eventName]) {
            e = events[eventName];
            if (!JS.isBoolean(e)) {
                e.clearListeners();
            }
            delete events[eventName];
        }
    },
    removeEvents: function(eventName) {
        if (JS.isString(eventName)) {
            this.removeEvent(eventName);
        } else if (JS.isArray(eventName) && eventName.length > 0) {
            for (var i = 0,
            len = eventName.length; i < len; i++) {
                this.removeEvent(eventName[i]);
            }
        }
    },
    hasEvent: function(eventName) {
        return this.events[eventName] ? true: false;
    },
    hasListener: function(eventName, fn, scope) {
        var events = this.events,
        e = events[eventName];
        if (!JS.isBoolean(e)) {
            return e.hasListener(fn, scope);
        }
        return false;
    },
    suspendEvents: function() {},
    resumeEvents: function() {}
};
JS.Event = function(name, caller) {
    this.name = name.toLowerCase();
    this.caller = caller;
    this.listeners = [];
};
JS.Event.prototype = {
    fire: function() {
        var listeners = this.listeners,
        i = listeners.length - 1;
        for (; i > -1; i--) {
            if (listeners[i].execute.apply(listeners[i], arguments) === false) {
                return false;
            }
        }
        return true;
    },
    addListener: function(fn, scope, o) {
        scope = scope || this.caller;
        if (this.hasListener(fn, scope) === -1) {
            this.listeners.push(new JS.Listener(fn, scope, o));
        }
    },
    removeListener: function(fn, scope) {
        var index = this.hasListener(fn, scope);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    },
    hasListener: function(fn, scope) {
        var i = 0,
        listeners = this.listeners,
        len = listeners.length;
        for (; i < len; i++) {
            if (listeners[i].equal(fn, scope)) {
                return i;
            }
        }
        return - 1;
    },
    clearListeners: function() {
        var i = 0,
        listeners = this.listeners,
        len = listeners.length;
        for (; i < len; i++) {
            listeners[i].clear();
        }
        this.listeners.splice(0);
    }
};
JS.Listener = function(fn, scope, o) {
    this.handler = fn;
    this.scope = scope;
    this.o = o;
};
JS.Listener.prototype = {
    execute: function() {
        return JS.callBack(this.handler, this.scope, arguments);
    },
    equal: function(fn, scope) {
        return this.handler === fn ? true: false;
    },
    clear: function() {
        delete this.handler;
        delete this.scope;
        delete this.o;
    }
};

JS.ns("JS.HTTPStatus", "JS.XMLHttpRequest");
JS.HTTPStatus = {
    '100': 'Continue',
    '101': 'Switching Protocols',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Unused',
    '307': 'Temporary Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Request Entity Too Large',
    '414': 'Request-URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Requested Range Not Satisfiable',
    '417': 'Expectation Failed',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported'
};
JS.HTTPStatus.OK = 200;
JS.HTTPStatus.BADREQUEST = 400;
JS.HTTPStatus.FORBIDDEN = 403;
JS.HTTPStatus.NOTFOUND = 404;
JS.HTTPStatus.TIMEOUT = 408;
JS.HTTPStatus.SERVERERROR = 500;

// 可以看看http://www.w3school.com.cn/ajax/ajax_xmlhttprequest_onreadystatechange.asp
// http://blog.csdn.net/liujiahan629629/article/details/17126727
JS.XMLHttpRequest = JS.extend(JS.Observable, {
    enableCache: false,
    timeout: 0,
    isAbort: false,
    specialXHR: '',
    _xhr: null,
    readyState: 0,
    status: 0,
    statusText: '',
    responseText: '',
    responseXML: null,
    constructor: function() {
        var self = this;
        this.addEvents(['readyStateChange', 'timeout', 'abort', 'error', 'load', 'progress']);
        JS.XMLHttpRequest.superclass.constructor.apply(this, arguments);
        this._xhr = this.createXmlHttpRequestObject();
        this._xhr.onreadystatechange = function() {
            // readystate 初始值 0
            // 调用open后，从0变为1：已完成与服务器的链接
            // 调用send后，从1依次变为：
            //              2： 服务器已接受请求
            //              3： 服务器处理中（数据未传输完成之前，一直处于3状态，长链接多次传输数据会多次触发change，但值还是3）
            //              4： 数据接受完毕，服务器已传输了结束标识
            self.doReadyStateChange();
        };
    },
    timeoutTask: null,
    delayTimeout: function() {
        // 如果定义了超时时间，则到达超时时间时，执行指定的timeout函数回调
        if (this.timeout) {
            // 如果超时检测task未创建，则创建task对象
            if (!this.timeoutTask) {
                this.timeoutTask = new JS.DelayedTask(
                    // 超时回调函数
                    function() {
                        if (this._xhr.readyState !== 4) {
                            // 到达超时时间时，如果xhr状态还没有变为4（服务端response就绪）则触发timeout事件
                            this.fireEvent('timeout', this, this._xhr);
                        } else {
                            // 否则取消task调度关闭
                            this.cancelTimeout();
                        }
                    },
                    // scope
                    this
                );
            }
            // 超时task对象启动，并设定延迟执行（即到达超时时间时，执行）
            this.timeoutTask.delay(this.timeout);
        }
    },
    cancelTimeout: function() {
        if (this.timeoutTask) {
            this.timeoutTask.cancel();
        }
    },
    createXmlHttpRequestObject: function() {
        var activeX = [
            'Msxml2.XMLHTTP.6.0', 
            'Msxml2.XMLHTTP.5.0', 
            'Msxml2.XMLHTTP.4.0', 
            'Msxml2.XMLHTTP.3.0', 
            'Msxml2.XMLHTTP', 
            'Microsoft.XMLHTTP'],
        xhr,
        specialXHR = this.specialXHR;
        if (specialXHR) {
            if (JS.isString(specialXHR)) {
                return new ActiveXObject(specialXHR);
            } else {
                return specialXHR;
            }
        }
        try {
            xhr = new XMLHttpRequest();
        } catch(e) {
            for (var i = 0; i < activeX.length; ++i) {
                try {
                    xhr = new ActiveXObject(activeX[i]);
                    break;
                } catch(e) {}
            }
        } finally {
            return xhr;
        }
    },
    doReadyStateChange: function() {
        // 首次ReadyStateChange发生在open调用之后（从0变为1）
        // 然后send后（从1依次变为 -> 2 -> 3 -> 4）
        // 如果是stream长链接，链接期间会一直维持在3状态，每次收到数据会触发ReadyStateChange，但值还是3
        this.delayTimeout();
        var xhr = this._xhr;
        try {
            this.readyState = xhr.readyState;
        } catch(e) {
            this.readyState = 0;
        }
        try {
            this.status = xhr.status;
        } catch(e) {
            this.status = 0;
        }
        try {
            this.statusText = xhr.statusText;
        } catch(e) {
            this.statusText = "";
        }
        try {
            this.responseText = xhr.responseText;
        } catch(e) {
            this.responseText = "";
        }
        try {
            this.responseXML = xhr.responseXML;
        } catch(e) {
            this.responseXML = null;
        }
        this.fireEvent('readyStateChange', this.readyState, this.status, this, xhr);
        if (this.readyState === 3 && (this.status >= 200 && this.status < 300)) {
            this.fireEvent('progress', this, xhr);
        }
        if (this.readyState === 4) {
            this.cancelTimeout();
            var status = this.status;
            if (status === 0) {
                this.fireEvent('error', this, xhr);
            } else if (status >= 200 && status < 300) {
                this.fireEvent('load', this, xhr);
            } else if (status >= 400 && status !== 408) {
                this.fireEvent('error', this, xhr);
            } else if (status === 408) {
                this.fireEvent('timeout', this, xhr);
            }
        }
        this.onreadystatechange();
    },
    onreadystatechange: function() {},
    open: function(method, url, async, username, password) {
        if (!url) {
            return;
        }
        if (!this.enableCache) {
            if (url.indexOf('?') !== -1) {
                url += '&ram=' + Math.random();
            } else {
                url += '?ram=' + Math.random();
            }
        }
        this._xhr.open(method, url, async, username, password);
    },
    send: function(content) {
        this.delayTimeout();
        this.isAbort = false;
        this._xhr.send(content);
    },
    abort: function() {
        this.isAbort = true;
        this.cancelTimeout();
        this._xhr.abort();
        if (JS.isIE) {
            var self = this;
            self._xhr.onreadystatechange = function() {
                self.doReadyStateChange();
            };
        }
        this.fireEvent('abort', this, this._xhr);
    },
    setRequestHeader: function(header, value) {
        this._xhr.setRequestHeader(header, value);
    },
    getResponseHeader: function(header) {
        return this._xhr.getResponseHeader(header);
    },
    getAllResponseHeaders: function() {
        return this._xhr.getAllResponseHeaders();
    },
    setTimeout: function(t) {
        // 由于XMLHTTPRequest level 2才开始支持timeout
        // 因此timeout未直接绑定设置到XMLHTTPRequest对象中，而是重新封装一次，确保所有浏览器都支持timeout
        this.timeout = t;
    }
});

JS.ns("JS.AJAX");
JS.AJAX = (function() {
    var xhr = new JS.XMLHttpRequest();
    return {
        dataFormatError: '服务器返回的数据格式有误',
        urlError: '未指定url',
        post: function(url, param, callback, scope, asyn) {
            if (typeof url !== 'string') {
                throw new Error(this.urlError);
            }
            var asynchronous = true;
            if (asyn === false) {
                asynchronous = false;
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && asynchronous) {
                    JS.callBack(callback, scope, [xhr]);
                }
            };
            xhr.open('POST', url, asynchronous);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF8");
            xhr.send(param || null);
            if (!asynchronous) {
                JS.callBack(callback, scope, [xhr]);
            }
        },
        get: function(url, param, callback, scope, asyn) {
            if (typeof url !== 'string') {
                throw new Error(this.urlError);
            }
            var asynchronous = true;
            if (asyn === false) {
                asynchronous = false;
            }
            // 如果是异步，绑定xhr状态变化事件，并执行回调
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && asynchronous) {
                    JS.callBack(callback, scope, [xhr]);
                }
            };
            xhr.open('GET', url, asynchronous);
            xhr.setRequestHeader("Content-Type", "html/text;charset=UTF8");
            xhr.send(param || null);
            // 如果是同步请求，send后，直接执行回调
            if (!asynchronous) {
                JS.callBack(callback, scope, [xhr]);
            }
        },
        getText: function(url, jsonData, callback, scope, asyn) {
            this.get(url, jsonData,
            function(xhr) {
                if (scope) {
                    callback.call(scope, xhr.responseText);
                } else {
                    callback(xhr.responseText);
                }
            },
            this, asyn);
        },
        getJson: function(url, jsonData, callback, scope, asyn) {
            this.get(url, jsonData,
            function(xhr) {
                var json = null;
                try {
                    json = eval("(" + xhr.responseText + ")");
                } catch(e) {
                    throw new Error(this.dataFormatError);
                }
                JS.callBack(callback, scope, [json]);
            },
            this, asyn);
        }
    };
})();

// 可以看看http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html
JS.ns("JS.Connector");
JS.Connector = JS.extend(JS.Observable, {
    version: '0.0.2',
    SYSCHANNEL: 'c4j',
    LLOOPSTYLE: 'lpool',
    STREAMSTYLE: 'stream',
    CMDTAG: 'cmd',
    url: '',
    param: '',
    revivalDelay: 100,
    cId: '',
    channels: [],
    workStyle: '',
    emptyUrlError: 'URL为空',
    runningError: '连接正在运行',
    dataFormatError: '数据格式有误',
    running: false,
    _xhr: null,
    lastReceiveMessage: '',
    constructor: function() {
        JS.Connector.superclass.constructor.apply(this, arguments);
        this.addEvents(['connect', 'error', 'stop', 'message', 'revival']);
        if (JS.isIE7) {
            this._xhr = new JS.XMLHttpRequest({
                specialXHR: 'Msxml2.XMLHTTP.6.0'
            });
        } else {
            this._xhr = new JS.XMLHttpRequest();
        }
        // stream流方式时，服务端数据传输将触发progress事件
        this._xhr.addListener('progress', this.doOnProgress, this);
        // lpool方式时，服务端数据传输将触发load事件
        this._xhr.addListener('load', this.doOnLoad, this);
        this._xhr.addListener('error', this.doOnError, this);
        // 超时时，复活链接
        this._xhr.addListener('timeout', this.revivalConnect, this);
        this.addListener('beforeStop', this.doDrop, this);
        JS.on(window, 'beforeunload', this.doDrop, this);
    },
    doDrop: function(url, cId, conn, xhr) {
        if (!this.running || !this.cId) {
            return;
        }
        try {
            var xhr = new JS.XMLHttpRequest();
            var url = this.url + '&' + this.CMDTAG + '=drop&cid=' + this.cId;
            xhr.open('GET', url, false);
            xhr.send(null);
            xhr = null;
        } catch(e) {};
    },
    dispatchServerEvent: function(msg) {
        // 如果消息是dying（无论是stream模式还是lpool模式）则发起重连
        if(msg.data === 'dying') {
            return this.revivalConnect();
        }
        this.fireEvent('message', msg.channel, eval('(' + msg.data + ')'), msg.time, this);
    },
    translateStreamData: function(responseText) {
        var str = responseText;
        if (this.lastReceiveMessage && str) {
            str = str.split(this.lastReceiveMessage);
            str = str.length ? str[str.length - 1] : "";
        }
        this.lastReceiveMessage = responseText;
        return str;
    },
    decodeMessage: function(msg) {
        var json = null;
        if (JS.isString(msg) && msg !== "") {
            if (msg.charAt(0) === "<") {
                msg = msg.substring(1, msg.length);
            }
            if (msg.charAt(msg.length - 1) === ">") {
                msg = msg.substring(0, msg.length - 1);
            }
            msg = decodeURIComponent(msg);
            try {
                // 服务端可以传带有js脚本的
                json = eval("(" + msg + ")");
            } catch(e) {
                this.stop('JSON转换异常');
                try {
                    console.log("JSON转换异常:" + msg);
                } catch(e) {};
            }
        }
        return json;
    },
    doOnProgress: function(xhr) {
        if (this.workStyle === this.STREAMSTYLE) {
            var str = this.translateStreamData(xhr.responseText);
            var msglist = str.split(">");
            if (msglist.length > 0) {
                for (var i = 0,
                len = msglist.length; i < len; i++) {
                    var json = this.decodeMessage(msglist[i]);
                    if (json) {
                        this.dispatchServerEvent(json);
                    }
                }
            }
        }
    },
    doOnError: function(xhr) {
        this.fireEvent('error', xhr);
        this.stop('服务器异常');
    },
    doOnLoad: function(xhr) {
        if (this.workStyle === this.LLOOPSTYLE) {
            var json = this.decodeMessage(xhr.responseText);
            if (json) {
                this.dispatchServerEvent(json);
            }
        }
        this.revivalConnect();
    },
    startConnect: function() {
        // 获取comet方式链接的服务端配置参数
        if (this.running) {
            var url = this.url + '?' + this.CMDTAG + '=conn&cv=' + this.version + this.param;
            var self = this;
            JS.AJAX.get(
                url, 
                '',
                function(xhr) {
                    var msg = self.decodeMessage(xhr.responseText);
                    if (!msg) {
                        self.stop('连接失败');
                        return;
                    }
                    var data = msg.data;
                    // 服务端返回的链接唯一标识
                    self.cId = data.cId;
                    // 服务端注册的通道
                    self.channels = data.channels;
                    // 服务端返回的工作模式
                    self.workStyle = data.ws;
                    // 超时时间设置为服务器返回的2倍
                    self._xhr.setTimeout(data.timeout * 2);
                    self.fireEvent('connect', data.cId, data.channels, data.ws, data.timeout, self);
                    self.revivalConnect();
                },
                self
            );
        }
    },
    // 首次获取服务参数后调用，自身超时后调用
    revivalConnect: function() {
        // 建立真正的消息链接，或者恢复该链接
        var self = this;
        if (this.running) {
            setTimeout(revival, this.revivalDelay);
        }
        function revival() {
            var xhr = self._xhr;
            var url = self.url + '?' + self.CMDTAG + '=revival&cid=' + self.cId + self.param;
            xhr.open('GET', url, true);
            xhr.send(null);
//            self.fireEvent('revival', self.url, self.cId, self);  用不上，注销掉
        }
    },
    start: function(url, paramsObject) {
        var self = this;
        setTimeout(function() {
            if (!self.url && !url) {
                throw new Error(self.emptyUrlError);
            }
            if (self.running) {
                return;
            }
            if (url) {
                self.url = url;
            }
            var queryString = '';
            for (var p in paramsObject) {
                queryString += '&';
                queryString += p;
                queryString += '=';
                queryString += paramsObject[p];
            }
            self.param = encodeURI(queryString);
            self.running = true;
            self.startConnect();
        },
        1000);
    },
    stop: function(cause) {
        if (!this.running) {
            return;
        }
        this.running = false;
        var cId = this.cId;
        this.cId = '';
        this.param = '';
        this.adml = [];
        this.workStyle = '';
        try {
            this._xhr.abort();
        } catch(e) {};
        this.fireEvent('stop', cause, cId, this.url, this);
    },
    getId: function() {
        return this.cId;
    }
});

// Comet推送方案（定义CometEngine类，不实例化）
JS.ns("JS.CometEngine");
JS.CometEngine = JS.extend(JS.Observable, {
    url: '',
    lStore: [],
    running: false,
    connector: null,
    constructor: function() {
        this.addEvents(['start', 'stop', 'error']);
        JS.CometEngine.superclass.constructor.apply(this, arguments);
        this.connector = new JS.Connector();
        this.initEvent();
    },
    // 重写：当消息通道运行时，注册监听，否则临时存储起来供后续恢复用
    addListener: function(eventName, fn, scope, o) {
        if (this.running) {
            JS.CometEngine.superclass.addListener.apply(this, arguments);
        } else {
            this.lStore.push({
                eventName: eventName,
                fn: fn,
                scope: scope,
                o: o
            });
        }
    },
    initEvent: function() {
        var self = this;
        this.connector.on({
            error: function() {
                self.fireEvent('error', arguments);
            },
            connect: function(cId, aml, conn) {
                self.running = true;
                self.addEvents(aml);
                for (var i = 0, len = self.lStore.length; i < len; i++) {
                    var e = self.lStore[i];
                    self.addListener(e.eventName, e.fn, e.scope);
                }
                self.fireEvent('start', cId, aml, self);
            },
            stop: function(cause, cId, url, conn) {
                self.running = false;
                self.fireEvent('stop', cause, cId, url, self);
                self.clearListeners();
            },
            message: function(amk, message, time) {
                self.fireEvent(amk, message, time, self);
            }
        });
    },
    start: function(contextPath, paramsObject) {
        if (this.running) {
            return;
        }
        this.connector.start( encodeURI("http://" + contextPath + this.url), paramsObject );
    },
    stop: function(cause) {
        if (!this.running) {
            return;
        }
        this.connector.stop(cause);
    },
    getConnector: function() {
        return this.connector;
    },
    getId: function() {
        return this.connector.cId;
    }
});

JS.ns("JS.Websocket");
JS.Websocket = JS.extend(JS.Observable, {
    url: '',
    socket: null,
    constructor: function() {
        JS.Websocket.superclass.constructor.apply(this, arguments);
        this.addEvents(['onOpen', 'onClose', 'onError', 'onMessage']);
    },
    start: function(contextPath, paramsObject) {
        var queryString = '';
        for (var p in paramsObject) {
            queryString += '&';
            queryString += p;
            queryString += '=';
            queryString += paramsObject[p];
        }
        queryString = queryString.substr(1);
        var self = this;        
        var protocol=window.location.protocol;
        console.log("protocol:"+protocol);
        let urlBegin="ws://";
        if("https:"==protocol){
            urlBegin="wss://";
        }

        if ('WebSocket' in window) {
            self.socket = new WebSocket( encodeURI(urlBegin + contextPath + this.url + '?' + queryString) );
        } else if ('MozWebSocket' in window) {
            self.socket = new MozWebSocket( encodeURI(urlBegin + contextPath + this.url + '?' + queryString) );
        }
        console.log(urlBegin + contextPath + this.url + '?' + queryString);
        self.socket.onopen = function(event) {
            self.fireEvent('onOpen', event, self);
        };
        self.socket.onclose = function(colseEvent) {
            self.fireEvent('onClose', colseEvent, self);
            self.running = false;
        };
        self.socket.onmessage = function(messageEvent) {
            self.fireEvent('onMessage', messageEvent, self);
        };
        self.socket.onerror = function(event) {
            self.fireEvent('onError', event, self);
        };
        
        self.running = true;
    },
    stop: function() {
        if(this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.running = false;
    }
});

var ZGMessage = {
    version : '1.0.1',
    serverURL : {
        // comet主通道（依赖于web容器实现的servlet3.0的异步特性）
        PATH_COMET_SERVLET3ASYNC : '/MessagePush/Comet/Servlet3Async',
        // websocket主通道
        PATH_WEBSOCKET_ANNOTATION : "/MessagePush/Websocket/EndpointAnnotation",
        // websocket备用通道
        PATH_WEBSOCKET_ENDPOINT : "/MessagePush/Websocket/EndpointExtend"
    } 
};
JS.ns("ZGMessage.Engine");
ZGMessage.Engine = (function() {
    var Engine = JS.extend(JS.Observable, {
        engineInstance : null,
        constructor: function() {
            // 【Step-1】----定义统一标准的Engine事件
            this.addEvents(['onOpen', 'onClose', 'onError', 'onMessage']);
            this.superclass.constructor.apply(this, arguments);
            // 【Step-2】----根据浏览器检测，选用对应的Engine
            if(JS.isWebsocketSupported) {
                this.engineInstance = new JS.Websocket({url: ZGMessage.serverURL.PATH_WEBSOCKET_ANNOTATION});
            } else {
                this.engineInstance = new JS.CometEngine({url: ZGMessage.serverURL.PATH_COMET_SERVLET3ASYNC});
                this.engineInstance.addEvent('onMessage');
                var self = this;
                this.engineInstance.on({
                    // Comet消息事件转换
                    ZGMessage_CHANNEL: function(message) {
                        self.engineInstance.fireEvent('onMessage', message, this.engineInstance);
                    }
                });
            }
            this.initEvent();
        },
        initEvent: function() {
            var self = this;
            if(JS.isWebsocketSupported) {
                this.engineInstance.addListener('onOpen', function(event) {
                    self.fireEvent('onOpen', event, self);
                });
                this.engineInstance.addListener('onClose', function(event) {
                    self.fireEvent('onClose', event, self);
                });
                this.engineInstance.addListener('onError', function(closeEvent) {
                    self.fireEvent('onError', closeEvent, self);
                });
                this.engineInstance.addListener('onMessage', function(messageEvent) {
                    var message = eval('(' + messageEvent.data + ')');
                    // 所有类型的消息都会触发onMessage事件
                    if(message.targetChannel !== "CHANNEL_ALL_HEARTBEAT") {
                        self.fireEvent('onMessage', message, self);
                    }
                });
            } else {
                this.engineInstance.addListener('start', function(event) {
                    self.fireEvent('onOpen', event, self);});
                this.engineInstance.addListener('stop', function(event) {
                    self.fireEvent('onClose', event, self);});
                this.engineInstance.addListener('error', function(event) {
                    self.fireEvent('onError', event, self);});
                this.engineInstance.addListener('onMessage', function(event) {
                    if(event.targetChannel !== "CHANNEL_ALL_HEARTBEAT") {
                        self.fireEvent('onMessage', event, self);
                    }});
            }
        },
        start: function(url, paramsObject) {
            // 默认Biz通道(监控为Monitor通道)，默认传输userAgent
            paramsObject = paramsObject || {};
            paramsObject.channel = paramsObject.channel || 'Biz';
            paramsObject.userAgent = paramsObject.userAgent || navigator.userAgent;
            paramsObject.securityKey = paramsObject.securityKey || 'NoAuth---//JS TODO';
            this.engineInstance.start(url, paramsObject);
        },
        stop: function() {
            this.engineInstance.stop();
        }
    });
    return new Engine();
}());

export default{
    Engine : ZGMessage.Engine
}
