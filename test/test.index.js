/**
 * 测试 文件
 * @author ydr.me
 * @create 2016-05-17 12:13
 */


'use strict';

var loader = require('../src/index.js');

describe('index.js', function () {
    it('.js', function (done) {
        loader.js({
            url: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.1/jquery.min.js',
            timeout: 5000
        }, function (err) {
            if (!err) {
                expect(window.jQuery).not.toBe(undefined);
            }

            done();
        });
    });


    it('.css', function (done) {
        loader.css({
            url: 'http://s.dangkr.com/@/dangkr-web/static/css/25503eeb6cf139399747b458dc5076b7.css',
            timeout: 5000,
            destroy: false
        }, function (err) {
            if (!err) {
                expect(this.href).not.toBe(undefined);
            }

            done();
        });
    });


    it('.img', function (done) {
        var url = 'http://www.dangkr.com/static/img/5-s.jpg';
        loader.img({
            url: url,
            timeout: 5000,
            destroy: false
        }, function (err) {
            if (!err) {
                expect(this.src).not.toBe(undefined);
                expect(this.width).not.toBe(undefined);
                expect(this.height).not.toBe(undefined);
            }

            console.log(this, 'this.complete', this.complete);

            var time1 = new Date().getTime();
            loader.img({
                url: url,
                timeout: 5000,
                destroy: false
            }, function (err) {
                if (!err) {
                    expect(this.src).not.toBe(undefined);
                    expect(this.width).not.toBe(undefined);
                    expect(this.height).not.toBe(undefined);
                }

                var time2 = new Date().getTime();

                expect(time2 - time1).toBeLessThan(1000);

                done();
            });
        });
    });

    it('.img', function (done) {
        loader.img({
            url: 'http://www.dangkr.com/ddd',
            timeout: 5000,
            destroy: false
        }, function (err) {
            expect(err).not.toBe(null);

            done();
        });
    });

    it('.img abort', function (done) {
        var ld = loader.img({
            url: 'https://abs.twimg.com/b/front_page/v1/JP_ASIA_2.jpg?' + Math.random(),
            timeout: 5000,
            destroy: false
        }, function (err) {
            expect(err).not.toBe(null);

            done();
        });

        ld.abort();
    });

    it('.img timeout', function (done) {
        loader.img({
            url: 'https://abs.twimg.com/b/front_page/v1/JP_ASIA_2.jpg?' + Math.random(),
            timeout: 1,
            destroy: false
        }, function (err) {
            expect(err).not.toBe(null);

            done();
        });
    });

    it('.img string', function (done) {
        var ld = loader.img('https://abs.twimg.com/b/front_page/v1/JP_ASIA_2.jpg?' + Math.random(), function (err) {
            expect(err).not.toBe(null);

            done();
        });

        ld.abort();
    });
});
