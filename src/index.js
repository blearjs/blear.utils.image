'use strict';

var fun =    require('blear.utils.function');
var array =  require('blear.utils.array');
var loader = require('blear.utils.loader');


/**
 * 判断是否支持 webp
 * @returns {Function}
 */
exports.supportWebp = (function () {
    var callbackList = [];
    var done = false;
    var supportsWebP = false;

    //Sample 2x2 black and white WebP image.
    var webpBase64 = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    loader.img(webpBase64, function (err) {
        done = true;
        var img = this;

        if (err) {
            supportsWebP = false;
        } else {
            if (img.width === 2 && img.height === 2) {
                supportsWebP = true;
            } else {
                supportsWebP = false;
            }
        }

        array.each(callbackList, function (index, callback) {
            callback(supportsWebP);
        });

        callbackList = null;
    });

    return function (callback) {
        callback = fun.noop(callback);

        if (done) {
            return callback(supportsWebP);
        }

        callbackList.push(callback);
    };
}());


var reImageView2 = /[?&]imageView2\/[^&]*/;
var reQuestion = /\?/;


/**
 * 七牛地址进行 webp 转换
 * @param url {String} url地址
 * @returns {String}
 *
 * @example
 * ```
 * image.qiniuWebp('a.png');
 * // => 'a.png?imageView2/2/format/webp'
 * ```
 */
exports.qiniuWebp = function (url) {
    var oldImageView2;

    url = url.replace(reImageView2, function (source) {
        oldImageView2 = source;
        return '';
    });
    var oldImageView2List = [];

    if (oldImageView2) {
        oldImageView2List = oldImageView2.slice(1).split('/');
    } else {
        oldImageView2List = ['imageView2', '2'];
    }

    var newImageView2List = [];
    var lastkey = '';

    array.each(oldImageView2List, function (index, key) {
        if (lastkey === 'format') {
            newImageView2List.pop();
            return;
        }

        if (!key) {
            return;
        }

        newImageView2List.push(key);
        lastkey = key;
    });

    newImageView2List.push('format');
    newImageView2List.push('webp');

    var connect = reQuestion.test(url) ? '&' : '?';

    return url + connect + newImageView2List.join('/');
};