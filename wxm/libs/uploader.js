/** @format */

'use strict'
function t(t, e, s, r) {
    return new (s || (s = Promise))(function (i, n) {
        function o(t) {
            try {
                h(r.next(t))
            } catch (t) {
                n(t)
            }
        }
        function a(t) {
            try {
                h(r.throw(t))
            } catch (t) {
                n(t)
            }
        }
        function h(t) {
            var e
            t.done
                ? i(t.value)
                : ((e = t.value),
                  e instanceof s
                      ? e
                      : new s(function (t) {
                            t(e)
                        })).then(o, a)
        }
        h((r = r.apply(t, e || [])).next())
    })
}
var e,
    s,
    r = {exports: {}},
    i = (r.exports = (function (t) {
        var e = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
        function s(t, e) {
            var s = t[0],
                r = t[1],
                i = t[2],
                n = t[3]
            ;(r =
                ((((r +=
                    ((((i =
                        ((((i +=
                            ((((n =
                                ((((n +=
                                    ((((s =
                                        ((((s += (((r & i) | (~r & n)) + e[0] - 680876936) | 0) << 7) | (s >>> 25)) +
                                            r) |
                                        0) &
                                        r) |
                                        (~s & i)) +
                                        e[1] -
                                        389564586) |
                                    0) <<
                                    12) |
                                    (n >>> 20)) +
                                    s) |
                                0) &
                                s) |
                                (~n & r)) +
                                e[2] +
                                606105819) |
                            0) <<
                            17) |
                            (i >>> 15)) +
                            n) |
                        0) &
                        n) |
                        (~i & s)) +
                        e[3] -
                        1044525330) |
                    0) <<
                    22) |
                    (r >>> 10)) +
                    i) |
                0),
                (r =
                    ((((r +=
                        ((((i =
                            ((((i +=
                                ((((n =
                                    ((((n +=
                                        ((((s =
                                            ((((s += (((r & i) | (~r & n)) + e[4] - 176418897) | 0) << 7) |
                                                (s >>> 25)) +
                                                r) |
                                            0) &
                                            r) |
                                            (~s & i)) +
                                            e[5] +
                                            1200080426) |
                                        0) <<
                                        12) |
                                        (n >>> 20)) +
                                        s) |
                                    0) &
                                    s) |
                                    (~n & r)) +
                                    e[6] -
                                    1473231341) |
                                0) <<
                                17) |
                                (i >>> 15)) +
                                n) |
                            0) &
                            n) |
                            (~i & s)) +
                            e[7] -
                            45705983) |
                        0) <<
                        22) |
                        (r >>> 10)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        ((((i =
                            ((((i +=
                                ((((n =
                                    ((((n +=
                                        ((((s =
                                            ((((s += (((r & i) | (~r & n)) + e[8] + 1770035416) | 0) << 7) |
                                                (s >>> 25)) +
                                                r) |
                                            0) &
                                            r) |
                                            (~s & i)) +
                                            e[9] -
                                            1958414417) |
                                        0) <<
                                        12) |
                                        (n >>> 20)) +
                                        s) |
                                    0) &
                                    s) |
                                    (~n & r)) +
                                    e[10] -
                                    42063) |
                                0) <<
                                17) |
                                (i >>> 15)) +
                                n) |
                            0) &
                            n) |
                            (~i & s)) +
                            e[11] -
                            1990404162) |
                        0) <<
                        22) |
                        (r >>> 10)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        ((((i =
                            ((((i +=
                                ((((n =
                                    ((((n +=
                                        ((((s =
                                            ((((s += (((r & i) | (~r & n)) + e[12] + 1804603682) | 0) << 7) |
                                                (s >>> 25)) +
                                                r) |
                                            0) &
                                            r) |
                                            (~s & i)) +
                                            e[13] -
                                            40341101) |
                                        0) <<
                                        12) |
                                        (n >>> 20)) +
                                        s) |
                                    0) &
                                    s) |
                                    (~n & r)) +
                                    e[14] -
                                    1502002290) |
                                0) <<
                                17) |
                                (i >>> 15)) +
                                n) |
                            0) &
                            n) |
                            (~i & s)) +
                            e[15] +
                            1236535329) |
                        0) <<
                        22) |
                        (r >>> 10)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        ((((i =
                            ((((i +=
                                ((((n =
                                    ((((n +=
                                        ((((s =
                                            ((((s += (((r & n) | (i & ~n)) + e[1] - 165796510) | 0) << 5) |
                                                (s >>> 27)) +
                                                r) |
                                            0) &
                                            i) |
                                            (r & ~i)) +
                                            e[6] -
                                            1069501632) |
                                        0) <<
                                        9) |
                                        (n >>> 23)) +
                                        s) |
                                    0) &
                                    r) |
                                    (s & ~r)) +
                                    e[11] +
                                    643717713) |
                                0) <<
                                14) |
                                (i >>> 18)) +
                                n) |
                            0) &
                            s) |
                            (n & ~s)) +
                            e[0] -
                            373897302) |
                        0) <<
                        20) |
                        (r >>> 12)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        ((((i =
                            ((((i +=
                                ((((n =
                                    ((((n +=
                                        ((((s =
                                            ((((s += (((r & n) | (i & ~n)) + e[5] - 701558691) | 0) << 5) |
                                                (s >>> 27)) +
                                                r) |
                                            0) &
                                            i) |
                                            (r & ~i)) +
                                            e[10] +
                                            38016083) |
                                        0) <<
                                        9) |
                                        (n >>> 23)) +
                                        s) |
                                    0) &
                                    r) |
                                    (s & ~r)) +
                                    e[15] -
                                    660478335) |
                                0) <<
                                14) |
                                (i >>> 18)) +
                                n) |
                            0) &
                            s) |
                            (n & ~s)) +
                            e[4] -
                            405537848) |
                        0) <<
                        20) |
                        (r >>> 12)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        ((((i =
                            ((((i +=
                                ((((n =
                                    ((((n +=
                                        ((((s =
                                            ((((s += (((r & n) | (i & ~n)) + e[9] + 568446438) | 0) << 5) |
                                                (s >>> 27)) +
                                                r) |
                                            0) &
                                            i) |
                                            (r & ~i)) +
                                            e[14] -
                                            1019803690) |
                                        0) <<
                                        9) |
                                        (n >>> 23)) +
                                        s) |
                                    0) &
                                    r) |
                                    (s & ~r)) +
                                    e[3] -
                                    187363961) |
                                0) <<
                                14) |
                                (i >>> 18)) +
                                n) |
                            0) &
                            s) |
                            (n & ~s)) +
                            e[8] +
                            1163531501) |
                        0) <<
                        20) |
                        (r >>> 12)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        ((((i =
                            ((((i +=
                                ((((n =
                                    ((((n +=
                                        ((((s =
                                            ((((s += (((r & n) | (i & ~n)) + e[13] - 1444681467) | 0) << 5) |
                                                (s >>> 27)) +
                                                r) |
                                            0) &
                                            i) |
                                            (r & ~i)) +
                                            e[2] -
                                            51403784) |
                                        0) <<
                                        9) |
                                        (n >>> 23)) +
                                        s) |
                                    0) &
                                    r) |
                                    (s & ~r)) +
                                    e[7] +
                                    1735328473) |
                                0) <<
                                14) |
                                (i >>> 18)) +
                                n) |
                            0) &
                            s) |
                            (n & ~s)) +
                            e[12] -
                            1926607734) |
                        0) <<
                        20) |
                        (r >>> 12)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((i =
                            ((((i +=
                                (((n =
                                    ((((n +=
                                        (((s =
                                            ((((s += ((r ^ i ^ n) + e[5] - 378558) | 0) << 4) | (s >>> 28)) + r) | 0) ^
                                            r ^
                                            i) +
                                            e[8] -
                                            2022574463) |
                                        0) <<
                                        11) |
                                        (n >>> 21)) +
                                        s) |
                                    0) ^
                                    s ^
                                    r) +
                                    e[11] +
                                    1839030562) |
                                0) <<
                                16) |
                                (i >>> 16)) +
                                n) |
                            0) ^
                            n ^
                            s) +
                            e[14] -
                            35309556) |
                        0) <<
                        23) |
                        (r >>> 9)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((i =
                            ((((i +=
                                (((n =
                                    ((((n +=
                                        (((s =
                                            ((((s += ((r ^ i ^ n) + e[1] - 1530992060) | 0) << 4) | (s >>> 28)) + r) |
                                            0) ^
                                            r ^
                                            i) +
                                            e[4] +
                                            1272893353) |
                                        0) <<
                                        11) |
                                        (n >>> 21)) +
                                        s) |
                                    0) ^
                                    s ^
                                    r) +
                                    e[7] -
                                    155497632) |
                                0) <<
                                16) |
                                (i >>> 16)) +
                                n) |
                            0) ^
                            n ^
                            s) +
                            e[10] -
                            1094730640) |
                        0) <<
                        23) |
                        (r >>> 9)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((i =
                            ((((i +=
                                (((n =
                                    ((((n +=
                                        (((s =
                                            ((((s += ((r ^ i ^ n) + e[13] + 681279174) | 0) << 4) | (s >>> 28)) + r) |
                                            0) ^
                                            r ^
                                            i) +
                                            e[0] -
                                            358537222) |
                                        0) <<
                                        11) |
                                        (n >>> 21)) +
                                        s) |
                                    0) ^
                                    s ^
                                    r) +
                                    e[3] -
                                    722521979) |
                                0) <<
                                16) |
                                (i >>> 16)) +
                                n) |
                            0) ^
                            n ^
                            s) +
                            e[6] +
                            76029189) |
                        0) <<
                        23) |
                        (r >>> 9)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((i =
                            ((((i +=
                                (((n =
                                    ((((n +=
                                        (((s =
                                            ((((s += ((r ^ i ^ n) + e[9] - 640364487) | 0) << 4) | (s >>> 28)) + r) |
                                            0) ^
                                            r ^
                                            i) +
                                            e[12] -
                                            421815835) |
                                        0) <<
                                        11) |
                                        (n >>> 21)) +
                                        s) |
                                    0) ^
                                    s ^
                                    r) +
                                    e[15] +
                                    530742520) |
                                0) <<
                                16) |
                                (i >>> 16)) +
                                n) |
                            0) ^
                            n ^
                            s) +
                            e[2] -
                            995338651) |
                        0) <<
                        23) |
                        (r >>> 9)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((n =
                            ((((n +=
                                ((r ^
                                    ((s =
                                        ((((s += ((i ^ (r | ~n)) + e[0] - 198630844) | 0) << 6) | (s >>> 26)) + r) |
                                        0) |
                                        ~i)) +
                                    e[7] +
                                    1126891415) |
                                0) <<
                                10) |
                                (n >>> 22)) +
                                s) |
                            0) ^
                            ((i = ((((i += ((s ^ (n | ~r)) + e[14] - 1416354905) | 0) << 15) | (i >>> 17)) + n) | 0) |
                                ~s)) +
                            e[5] -
                            57434055) |
                        0) <<
                        21) |
                        (r >>> 11)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((n =
                            ((((n +=
                                ((r ^
                                    ((s =
                                        ((((s += ((i ^ (r | ~n)) + e[12] + 1700485571) | 0) << 6) | (s >>> 26)) + r) |
                                        0) |
                                        ~i)) +
                                    e[3] -
                                    1894986606) |
                                0) <<
                                10) |
                                (n >>> 22)) +
                                s) |
                            0) ^
                            ((i = ((((i += ((s ^ (n | ~r)) + e[10] - 1051523) | 0) << 15) | (i >>> 17)) + n) | 0) |
                                ~s)) +
                            e[1] -
                            2054922799) |
                        0) <<
                        21) |
                        (r >>> 11)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((n =
                            ((((n +=
                                ((r ^
                                    ((s =
                                        ((((s += ((i ^ (r | ~n)) + e[8] + 1873313359) | 0) << 6) | (s >>> 26)) + r) |
                                        0) |
                                        ~i)) +
                                    e[15] -
                                    30611744) |
                                0) <<
                                10) |
                                (n >>> 22)) +
                                s) |
                            0) ^
                            ((i = ((((i += ((s ^ (n | ~r)) + e[6] - 1560198380) | 0) << 15) | (i >>> 17)) + n) | 0) |
                                ~s)) +
                            e[13] +
                            1309151649) |
                        0) <<
                        21) |
                        (r >>> 11)) +
                        i) |
                    0),
                (r =
                    ((((r +=
                        (((n =
                            ((((n +=
                                ((r ^
                                    ((s =
                                        ((((s += ((i ^ (r | ~n)) + e[4] - 145523070) | 0) << 6) | (s >>> 26)) + r) |
                                        0) |
                                        ~i)) +
                                    e[11] -
                                    1120210379) |
                                0) <<
                                10) |
                                (n >>> 22)) +
                                s) |
                            0) ^
                            ((i = ((((i += ((s ^ (n | ~r)) + e[2] + 718787259) | 0) << 15) | (i >>> 17)) + n) | 0) |
                                ~s)) +
                            e[9] -
                            343485551) |
                        0) <<
                        21) |
                        (r >>> 11)) +
                        i) |
                    0),
                (t[0] = (s + t[0]) | 0),
                (t[1] = (r + t[1]) | 0),
                (t[2] = (i + t[2]) | 0),
                (t[3] = (n + t[3]) | 0)
        }
        function r(t) {
            var e,
                s = []
            for (e = 0; e < 64; e += 4)
                s[e >> 2] =
                    t.charCodeAt(e) +
                    (t.charCodeAt(e + 1) << 8) +
                    (t.charCodeAt(e + 2) << 16) +
                    (t.charCodeAt(e + 3) << 24)
            return s
        }
        function i(t) {
            var e,
                s = []
            for (e = 0; e < 64; e += 4) s[e >> 2] = t[e] + (t[e + 1] << 8) + (t[e + 2] << 16) + (t[e + 3] << 24)
            return s
        }
        function n(t) {
            var e,
                i,
                n,
                o,
                a,
                h,
                u = t.length,
                c = [1732584193, -271733879, -1732584194, 271733878]
            for (e = 64; e <= u; e += 64) s(c, r(t.substring(e - 64, e)))
            for (
                i = (t = t.substring(e - 64)).length, n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], e = 0;
                e < i;
                e += 1
            )
                n[e >> 2] |= t.charCodeAt(e) << (e % 4 << 3)
            if (((n[e >> 2] |= 128 << (e % 4 << 3)), e > 55)) for (s(c, n), e = 0; e < 16; e += 1) n[e] = 0
            return (
                (o = (o = 8 * u).toString(16).match(/(.*?)(.{0,8})$/)),
                (a = parseInt(o[2], 16)),
                (h = parseInt(o[1], 16) || 0),
                (n[14] = a),
                (n[15] = h),
                s(c, n),
                c
            )
        }
        function o(t) {
            var e,
                r,
                n,
                o,
                a,
                h,
                u = t.length,
                c = [1732584193, -271733879, -1732584194, 271733878]
            for (e = 64; e <= u; e += 64) s(c, i(t.subarray(e - 64, e)))
            for (
                r = (t = e - 64 < u ? t.subarray(e - 64) : new Uint8Array(0)).length,
                    n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    e = 0;
                e < r;
                e += 1
            )
                n[e >> 2] |= t[e] << (e % 4 << 3)
            if (((n[e >> 2] |= 128 << (e % 4 << 3)), e > 55)) for (s(c, n), e = 0; e < 16; e += 1) n[e] = 0
            return (
                (o = (o = 8 * u).toString(16).match(/(.*?)(.{0,8})$/)),
                (a = parseInt(o[2], 16)),
                (h = parseInt(o[1], 16) || 0),
                (n[14] = a),
                (n[15] = h),
                s(c, n),
                c
            )
        }
        function a(t) {
            var s,
                r = ''
            for (s = 0; s < 4; s += 1) r += e[(t >> (8 * s + 4)) & 15] + e[(t >> (8 * s)) & 15]
            return r
        }
        function h(t) {
            var e
            for (e = 0; e < t.length; e += 1) t[e] = a(t[e])
            return t.join('')
        }
        function u(t) {
            return /[\u0080-\uFFFF]/.test(t) && (t = unescape(encodeURIComponent(t))), t
        }
        function c(t, e) {
            var s,
                r = t.length,
                i = new ArrayBuffer(r),
                n = new Uint8Array(i)
            for (s = 0; s < r; s += 1) n[s] = t.charCodeAt(s)
            return e ? n : i
        }
        function f(t) {
            return String.fromCharCode.apply(null, new Uint8Array(t))
        }
        function l(t, e, s) {
            var r = new Uint8Array(t.byteLength + e.byteLength)
            return r.set(new Uint8Array(t)), r.set(new Uint8Array(e), t.byteLength), s ? r : r.buffer
        }
        function d(t) {
            var e,
                s = [],
                r = t.length
            for (e = 0; e < r - 1; e += 2) s.push(parseInt(t.substr(e, 2), 16))
            return String.fromCharCode.apply(String, s)
        }
        function p() {
            this.reset()
        }
        return (
            h(n('hello')),
            'undefined' == typeof ArrayBuffer ||
                ArrayBuffer.prototype.slice ||
                (function () {
                    function e(t, e) {
                        return (t = 0 | t || 0) < 0 ? Math.max(t + e, 0) : Math.min(t, e)
                    }
                    ArrayBuffer.prototype.slice = function (s, r) {
                        var i,
                            n,
                            o,
                            a,
                            h = this.byteLength,
                            u = e(s, h),
                            c = h
                        return (
                            r !== t && (c = e(r, h)),
                            u > c
                                ? new ArrayBuffer(0)
                                : ((i = c - u),
                                  (n = new ArrayBuffer(i)),
                                  (o = new Uint8Array(n)),
                                  (a = new Uint8Array(this, u, i)),
                                  o.set(a),
                                  n)
                        )
                    }
                })(),
            (p.prototype.append = function (t) {
                return this.appendBinary(u(t)), this
            }),
            (p.prototype.appendBinary = function (t) {
                ;(this._buff += t), (this._length += t.length)
                var e,
                    i = this._buff.length
                for (e = 64; e <= i; e += 64) s(this._hash, r(this._buff.substring(e - 64, e)))
                return (this._buff = this._buff.substring(e - 64)), this
            }),
            (p.prototype.end = function (t) {
                var e,
                    s,
                    r = this._buff,
                    i = r.length,
                    n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                for (e = 0; e < i; e += 1) n[e >> 2] |= r.charCodeAt(e) << (e % 4 << 3)
                return this._finish(n, i), (s = h(this._hash)), t && (s = d(s)), this.reset(), s
            }),
            (p.prototype.reset = function () {
                return (
                    (this._buff = ''),
                    (this._length = 0),
                    (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
                    this
                )
            }),
            (p.prototype.getState = function () {
                return {buff: this._buff, length: this._length, hash: this._hash.slice()}
            }),
            (p.prototype.setState = function (t) {
                return (this._buff = t.buff), (this._length = t.length), (this._hash = t.hash), this
            }),
            (p.prototype.destroy = function () {
                delete this._hash, delete this._buff, delete this._length
            }),
            (p.prototype._finish = function (t, e) {
                var r,
                    i,
                    n,
                    o = e
                if (((t[o >> 2] |= 128 << (o % 4 << 3)), o > 55)) for (s(this._hash, t), o = 0; o < 16; o += 1) t[o] = 0
                ;(r = (r = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/)),
                    (i = parseInt(r[2], 16)),
                    (n = parseInt(r[1], 16) || 0),
                    (t[14] = i),
                    (t[15] = n),
                    s(this._hash, t)
            }),
            (p.hash = function (t, e) {
                return p.hashBinary(u(t), e)
            }),
            (p.hashBinary = function (t, e) {
                var s = h(n(t))
                return e ? d(s) : s
            }),
            (p.ArrayBuffer = function () {
                this.reset()
            }),
            (p.ArrayBuffer.prototype.append = function (t) {
                var e,
                    r = l(this._buff.buffer, t, !0),
                    n = r.length
                for (this._length += t.byteLength, e = 64; e <= n; e += 64) s(this._hash, i(r.subarray(e - 64, e)))
                return (this._buff = e - 64 < n ? new Uint8Array(r.buffer.slice(e - 64)) : new Uint8Array(0)), this
            }),
            (p.ArrayBuffer.prototype.end = function (t) {
                var e,
                    s,
                    r = this._buff,
                    i = r.length,
                    n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                for (e = 0; e < i; e += 1) n[e >> 2] |= r[e] << (e % 4 << 3)
                return this._finish(n, i), (s = h(this._hash)), t && (s = d(s)), this.reset(), s
            }),
            (p.ArrayBuffer.prototype.reset = function () {
                return (
                    (this._buff = new Uint8Array(0)),
                    (this._length = 0),
                    (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
                    this
                )
            }),
            (p.ArrayBuffer.prototype.getState = function () {
                var t = p.prototype.getState.call(this)
                return (t.buff = f(t.buff)), t
            }),
            (p.ArrayBuffer.prototype.setState = function (t) {
                return (t.buff = c(t.buff, !0)), p.prototype.setState.call(this, t)
            }),
            (p.ArrayBuffer.prototype.destroy = p.prototype.destroy),
            (p.ArrayBuffer.prototype._finish = p.prototype._finish),
            (p.ArrayBuffer.hash = function (t, e) {
                var s = h(o(new Uint8Array(t)))
                return e ? d(s) : s
            }),
            p
        )
    })())
!(function (t) {
    ;(t.Progress = 'progress'),
        (t.Retry = 'retry'),
        (t.Success = 'success'),
        (t.Fail = 'fail'),
        (t.Complete = 'complete')
})(e || (e = {})),
    (function (t) {
        ;(t[(t.InitializeStatus = 0)] = 'InitializeStatus'),
            (t[(t.PendingStatus = 1)] = 'PendingStatus'),
            (t[(t.FulfilledStatus = 2)] = 'FulfilledStatus'),
            (t[(t.RejectStatus = 3)] = 'RejectStatus')
    })(s || (s = {}))
class n {
    constructor(t, e, s, r) {
        ;(this.testType = r),
            (this.chunks = []),
            (this.uploadedSize = 0),
            (this.digest = ''),
            (this.init = t => {
                this.f.digest(
                    e => {
                        console.log(e),
                            (this.digest = e),
                            this.f.read(
                                0,
                                200,
                                s => {
                                    const r = this.getNew()
                                    r.set('size', this.f.size().toString()),
                                        r.set('digest', e),
                                        r.set('chunk_size', this.chunksize.toString()),
                                        r.set('ts', Date.now().toString()),
                                        this.r.initRequest(this.ctx, r, s, t, this.fail)
                                },
                                t => {
                                    console.log(t)
                                },
                            )
                    },
                    t => {
                        console.log(t)
                    },
                )
            }),
            (this.uploadChunk = (t, e, s, r, n) => {
                const o = this,
                    a = this.getNew()
                a.set('upload_id', t), a.set('index', s.toString())
                const h = new TextDecoder('utf-8').decode(r)
                a.set('digest', i.hash(h)),
                    this.r.chunkRequest(
                        this.ctx,
                        a,
                        r,
                        t => {
                            console.log(t),
                                o.chunks.push({index: s, etag: t.etag}),
                                s < o.totalChunks - 1
                                    ? (o.uploadedSize += o.chunksize)
                                    : (o.uploadedSize += o.totalSize - o.chunksize * (o.totalChunks - 1)),
                                o.progress({uploadedSize: o.uploadedSize, totalSize: o.totalSize}),
                                n()
                        },
                        this.fail,
                    )
            }),
            (this.ctx = t),
            (this.f = e),
            (this.r = s),
            (this.totalSize = this.f.size()),
            (this.chunksize = this.ctx.chunkSize || 2097152),
            (this.totalChunks = Math.ceil(this.totalSize / this.chunksize)),
            (this.maxConcurrency = Math.min(this.totalChunks, this.ctx.maxConcurrency || 5)),
            (this.tasks = Array.from({length: this.totalChunks}, (t, e) => e))
    }
    getNew() {
        return new this.testType()
    }
    upload(t) {
        const e = this
        for (let t = 0; t < this.chunks.length; t++) {
            this.chunks[t].index < this.totalChunks - 1
                ? (this.uploadedSize += this.chunksize)
                : (this.uploadedSize += this.totalSize - this.chunksize * (this.totalChunks - 1)),
                this.progress({uploadedSize: this.uploadedSize, totalSize: this.totalSize})
        }
        Promise.all(
            Array.from(
                {length: this.maxConcurrency},
                (s, r) =>
                    new Promise(s => {
                        const i = () => {
                            const n = this.tasks.shift()
                            if (void 0 === n) return void s(r)
                            const o = n * this.chunksize,
                                a = o + this.chunksize >= this.totalSize ? this.totalSize : o + this.chunksize
                            e.f.read(
                                o,
                                a - o,
                                s => {
                                    e.uploadChunk(t.upload_id, r, n, s, i)
                                },
                                t => {
                                    console.log(t)
                                },
                            )
                        }
                        i()
                    }),
            ),
        ).then(e => {
            console.log(e), this.merge(t.upload_id)
        })
    }
    success(t) {
        console.log('success', t), this.complete(t)
    }
    fail(t) {
        console.log(t)
    }
    progress(t) {
        console.log('progress', t)
    }
    complete(t) {
        console.log(t)
    }
    merge(t) {
        const e = this.getNew()
        e.set('upload_id', t), e.set('digest', this.digest)
        const s = JSON.stringify(this.chunks),
            r = this
        this.r.mergeRequest(
            this.ctx,
            e,
            s,
            t => {
                r.success(t)
            },
            this.fail,
        )
    }
    on(t, e) {
        switch (t) {
            case 'progress':
                this.progress = e
                break
            case 'retry':
                break
            case 'success':
                this.success = e
                break
            case 'fail':
                this.fail = e
                break
            case 'complete':
                this.complete = e
        }
    }
    run() {
        this.init(t => {
            switch (t.status) {
                case 0:
                    this.upload(t)
                case 1:
                    ;(this.chunks = t.chunks), this.upload(t)
                    break
                case 2:
                    this.success(t)
            }
            console.log(t.upload_id)
        })
    }
}
class o {
    constructor() {
        this.data = {}
    }
    set(t, e) {
        this.data[t] = e
    }
    toString() {
        const t = []
        for (const e in this.data) t.push(`${e}=${this.data[e]}`)
        return t.join('&')
    }
}
class a {
    constructor(t, e, s) {
        ;(this.fsm = t), (this.filePath = e), (this._size = s)
    }
    size() {
        return this._size
    }
    read(t, e, s, r) {
        const {filePath: i, fsm: n} = this
        n.readFile({
            filePath: i,
            position: t,
            length: e,
            success(t) {
                s(t.data)
            },
            fail(t) {
                r(Error(t.errMsg))
            },
        })
    }
    _digest(t, e) {
        const {filePath: s, _size: r, fsm: n} = this,
            o = 2062336,
            a = Math.ceil(r / o),
            h = new i.ArrayBuffer(),
            u = i => {
                if ((console.log(o, a, i), i === a)) {
                    const e = h.end()
                    return h.destroy(), void t(e)
                }
                const c = i * o,
                    f = Math.min(r - c, o)
                n.readFile({
                    filePath: s,
                    position: c,
                    length: f,
                    success(t) {
                        console.log(t.data), h.append(t.data), u(++i)
                    },
                    fail(t) {
                        e(Error(t.errMsg))
                    },
                })
            }
        u(0)
    }
    digest(t, e) {
        this._digest(t, e)
    }
}
class h {
    initRequest(t, e, s, r, i) {
        const {touchUrl: n} = t
        wx.request({
            url: n + '?' + e.toString(),
            data: s,
            dataType: 'json',
            method: 'POST',
            header: {'content-type': 'application/octet-stream'},
            success(t) {
                console.log(t.data)
                const {data: e} = t.data
                r(e)
            },
            fail(t) {
                i(Error(t.errMsg))
            },
        })
    }
    chunkRequest(t, e, s, r, i) {
        const {uploadUrl: n} = t
        wx.request({
            url: n + '?' + e.toString(),
            data: s,
            dataType: 'json',
            method: 'POST',
            header: {'content-type': 'application/octet-stream'},
            success(t) {
                console.log(t.data)
                const {data: e} = t.data
                r(e)
            },
            fail(t) {
                i(Error(t.errMsg))
            },
        })
    }
    mergeRequest(t, e, s, r, i) {
        const {mergeUrl: n} = t
        wx.request({
            url: n + '?' + e.toString(),
            data: s,
            dataType: 'json',
            method: 'POST',
            header: {'content-type': 'application/octet-stream'},
            success(t) {
                console.log(t.data)
                const {data: e} = t.data
                r(e)
            },
            fail(t) {
                i(Error(t.errMsg))
            },
        })
    }
}
const u = wx.getFileSystemManager()
module.exports = (e, s) =>
    t(void 0, void 0, void 0, function* () {
        return (t =>
            new Promise(e => {
                u.getFileInfo({
                    filePath: t,
                    success(t) {
                        e(t.size)
                    },
                    fail(t) {
                        throw Error(t.errMsg)
                    },
                })
            }))(s).then(t => new n(e, new a(u, s, t), new h(), o))
    })
