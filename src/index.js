'use strict';

var typeis =   require('blear.utils.typeis');
var time =     require('blear.utils.time');
var fun =      require('blear.utils.function');
var object =   require('blear.utils.object');

var win = window;
var doc = document;
var REG_LOAD_COMPLETE = /loaded|complete/;
var defaults = {
    /**
     * 链接地址
     * @type string
     */
    url: '',

    /**
     * 连接超时
     * @type number
     */
    timeout: 10000,

    /**
     * 是否销毁节点
     * @type boolean
     */
    destroy: true
};


/**
 * 资源加载器
 * @param tagName
 * @param options
 * @param callback
 * @returns {{abort: abort}}
 */
var load = function (tagName, options, callback) {
    if (typeis.String(options)) {
        options = {
            url: options
        };
    }

    options = object.assign({}, defaults, options);

    var url = options.url;
    var timeout = options.timeout;
    var isImageNode = tagName === 'img';
    var node = isImageNode ? new Image() : doc.createElement(tagName);

    var timeid = 0;

    if (timeout > 0) {
        timeid = setTimeout(function () {
            var err = new Error('request timeout');
            err.type = 'timeout';
            cleanup();
            onCallback(err);
        }, timeout);
    }

    /**
     * 清除节点等信息
     * @type {Function}
     */
    var cleanup = fun.once(function () {
        node.onload = node.onerror = node.onreadystatechange = null;

        if (!isImageNode && options.destroy) {
            doc.body.removeChild(node);
        }

        clearTimeout(timeid);
        node = null;
    });

    /**
     * ready
     * @type {Function}
     */
    var onCallback = fun.once(function (eve) {
        var err = null;

        if (eve && eve.type === 'error') {
            err = new Error('response error');
            err.type = 'response';
        } else if (eve instanceof Error) {
            err = eve;
        }

        if (typeis.Function(callback)) {
            callback.call(node, err, node);
        }

        cleanup();
    });

    switch (tagName) {
        case 'script':
            node.async = true;
            node.src = url;
            break;

        case 'link':
            node.rel = 'stylesheet';
            node.href = url;
            break;

        case 'img':
            node.src = url;
            break;
    }


    if ('onload' in node) {
        node.onload = node.onerror = onCallback;
    } else {
        /* istanbul ignore next */
        node.onreadystatechange = function (eve) {
            if (REG_LOAD_COMPLETE.test(node.readyState + '')) {
                eve = eve || win.event;
                onCallback(eve);
            }
        };
    }

    if (!isImageNode) {
        doc.body.appendChild(node);
    }

    if (isImageNode && node.complete) {
        time.nextTick(onCallback);
    }

    return {
        abort: function abort() {
            var err = new Error('request aborted');
            err.type = 'aborted';
            onCallback(err);
        }
    };
};

/**
 * 加载脚本文件
 * @param options {String|object} 配置
 * @param [callback] {Function} 完毕回调
 */
exports.js = function (options, callback) {
    return load('script', options, callback);
};


/**
 * 加载样式文件
 * @param options {String|object} 配置
 * @param [callback] {Function} 完毕回调
 */
exports.css = function (options, callback) {
    return load('link', options, callback);
};


/**
 * 加载图片文件
 * @param options {String|object} 配置
 * @param [callback] {Function} 完毕回调
 */
exports.img = function (options, callback) {
    return load('img', options, callback);
};


exports.defaults = defaults;