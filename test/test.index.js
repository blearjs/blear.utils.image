/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var image = require('../src/index.js');

describe('index.js', function () {
    it('.supportWebp', function (done) {
        image.supportWebp(function (supported) {
            console.log('supported webp', supported);
            expect(typeof supported).toEqual('boolean');
            done();
        });
    });

    it('.qiniuWebp', function () {
        expect(image.qiniuWebp('png?n=172&imageView2/2/format/webp'))
            .toEqual('png?n=172&imageView2/2/format/webp');
        expect(image.qiniuWebp('png?n=172&imageView2/2/format/jepg'))
            .toEqual('png?n=172&imageView2/2/format/webp');
        expect(image.qiniuWebp('png?n=172&imageView2/2/'))
            .toEqual('png?n=172&imageView2/2/format/webp');
        expect(image.qiniuWebp('png?n=172&imageView2/2/w/100'))
            .toEqual('png?n=172&imageView2/2/w/100/format/webp');
        expect(image.qiniuWebp('png?n=172&imageView2/2/w/100/h/100/q/90/ignore-error/1'))
            .toEqual('png?n=172&imageView2/2/w/100/h/100/q/90/ignore-error/1/format/webp');
        expect(image.qiniuWebp('png'))
            .toEqual('png?imageView2/2/format/webp');
    });
});
