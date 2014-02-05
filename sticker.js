/**
 * Sticker.js: A Javascript library that allows you to create a Sticker Effect
 *
 * @project-site    http://stickerjs.cmiscm.com/
 * @repository		https://github.com/cmiscm/stickerjs
 * @author		    Jongmin Kim - cmiscm.com
 * @version 	    1.0 (2014/02/05)
 * @license		    MIT License
 */

(function () {

    var _direction, _savePos = null,
        _prefixes = ['webkit', 'Moz', 'ms', 'O'],
        _aniTrans = 'all 0.6s cubic-bezier(.23,1,.32,1)',
        _setTrans = 'all 0s',
        newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
    .shadowL {background: -moz-linear-gradient(right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, right top, left top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowR {background: -moz-linear-gradient(left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left top, right top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(left, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to right, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowB {background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}\
    .shadowT {background: -moz-linear-gradient(bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 1%, rgba(0,0,0,0.7) 100%);background: -webkit-gradient(linear, left bottom, left top, color-stop(0%,rgba(0,0,0,0)), color-stop(1%,rgba(0,0,0,0.01)), color-stop(100%,rgba(0,0,0,0.7)));background: -webkit-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -o-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: -ms-linear-gradient(bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);background: linear-gradient(to top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.01) 1%,rgba(0,0,0,0.7) 100%);}"));
    document.head.appendChild(newStyle);

    function vendor(el, prop) {
        var s = el.style, pp, i;
        prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        for(i=0; i<_prefixes.length; i++) {
            pp = _prefixes[i]+prop;
            if(s[pp] !== undefined) return pp;
        }
        if(s[prop] !== undefined) return prop;
    }

    function css(el, prop) {
        for (var n in prop) el.style[vendor(el, n)||n] = prop[n];
    }

    function createEl(tag, prop) {
        var el = document.createElement(tag || 'div');
        css(el, prop);
        return el;
    }

    function checkDerection(e, pos, sizeQ) {
        var fx = pos.x, fy = pos.y, tx = e.pageX - fx, ty = e.pageY - fy, direction;
        if (tx < sizeQ) direction = 0; // left
        else if (tx > sizeQ * 3) direction = 1; // right
        else if (ty < sizeQ) direction = 2; // top
        else direction = 3; // bottom
        return direction;
    }

    function checkPos(e, pos, size) {
        var fx = pos.x, fy = pos.y, tx = e.pageX - fx, ty = e.pageY - fy, value,
            a = size - tx, b = size - ty, c = tx >> 1, d = ty >> 1, e = a >> 1, f = b >> 1;
        if (_direction == 0) value = {bx:-size, by:0, sx:-1, sy:1, bs:'shadowL', bmx:-size + tx, bmy:0, bsw:tx, bsh:size, bsx:a, bsy:0, cw:size - c, ch:size, cx:c, cy:0, dw:c, dh:size, dx:c - (c >> 1), dy:0}; // left
        else if (_direction == 1) value = {bx:size, by:0, sx:-1, sy:1, bs:'shadowR', bmx:tx, bmy:0, bsw:a, bsh:size, bsx:0, bsy:0, cw:size - e, ch:size, cx:0, cy:0, dw:e, dh:size, dx:size - a + (e >> 1), dy:0}; // right
        else if (_direction == 2) value = {bx:0, by:-size, sx:1, sy:-1, bs:'shadowT', bmx:0, bmy:-size + ty, bsw:size, bsh:ty, bsx:0, bsy:b, cw:size, ch:size - d, cx:0, cy:d, dw:size, dh:d, dx:0, dy:d - (d >> 1)}; // top
        else value = {bx:0, by:size, sx:1, sy:-1, bs:'shadowB', bmx:0, bmy:ty, bsw:size, bsh:b, bsx:0, bsy:0, cw:size, ch:size - f, cx:0, cy:0, dw:size, dh:f, dx:0, dy:size - b + (f >> 1)}; // bottom
        return value;
    }

    function onEnter(e, value) {
        var cpos = value.container.getBoundingClientRect(),
            mpos = {x:cpos.left + window.pageXOffset, y:cpos.top + window.pageYOffset};
        _direction = checkDerection(e, mpos, value.sizeQ);
        _savePos = checkPos(e, mpos, value.size);
        _savePos.pos = mpos;
        var bx = _savePos.bx, by = _savePos.by, sx = _savePos.sx, sy = _savePos.sy, bs = _savePos.bs;
        value.backShadow.className = value.depth.className = 'sticker-shadow ' + bs;
        css(value.mask, {
            transition: _setTrans,
            width: value.size + 'px',
            height: value.size + 'px',
            transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
        });
        css(value.move, {
            transition: _setTrans,
            transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
        });
        css(value.back, {
            transition: _setTrans,
            transform: 'translate(' + bx + 'px, ' + by + 'px)'
        });
        css(value.backImg, {
            transform: 'scaleX(' + sx + ') scaleY(' + sy + ')'
        });
        css(value.depth, {
            transform: 'translate(' + -10000 + 'px, ' + -10000 + 'px)'
        });
    }

    function onLeave(e, value) {
        if (_savePos == null) return;
        var bx = _savePos.bx, by = _savePos.by;
        css(value.mask, {
            transition: _aniTrans,
            width: value.size + 'px',
            height: value.size + 'px',
            transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
        });
        css(value.move, {
            transition: _aniTrans,
            transform: 'translate(' + 0 + 'px, ' + 0 + 'px)'
        });
        css(value.back, {
            transition: _aniTrans,
            transform: 'translate(' + bx + 'px, ' + by + 'px)'
        });
        css(value.depth, {
            transform: 'translate(' + -10000 + 'px, ' + -10000 + 'px)'
        });
        _savePos = null;
    }

    function onMove(e, value) {
        if (_savePos == null) {
            onEnter(e, value);
            window.document.addEventListener('mouseup', function (e) {
                this.removeEventListener('mouseup', arguments.callee, false);
                onLeave(e, value);
            }, false);
        }
        var pos = checkPos(e, _savePos.pos, value.size),
            bmx = pos.bmx, bmy = pos.bmy,
            bsw = pos.bsw, bsh = pos.bsh, bsx = pos.bsx, bsy = pos.bsy,
            cw = pos.cw, ch = pos.ch, cx = pos.cx, cy = pos.cy,
            dw = pos.dw, dh = pos.dh, dx = pos.dx, dy = pos.dy;
        css(value.mask, {
            width: cw + 'px',
            height: ch + 'px',
            transform: 'translate(' + cx + 'px, ' + cy + 'px)'
        });
        css(value.move, {
            transform: 'translate(' + -cx + 'px, ' + -cy + 'px)'
        });
        css(value.back, {
            transform: 'translate(' + bmx + 'px, ' + bmy + 'px)'
        });
        css(value.backShadow, {
            width: bsw + 'px',
            height: bsh + 'px',
            transform: 'translate(' + bsx + 'px, ' + bsy + 'px)'
        });
        css(value.depth, {
            width: dw + 'px',
            height: dh + 'px',
            transform: 'translate(' + dx + 'px, ' + dy + 'px)'
        });
    }

    var sticker = {
        init: function init(dom) {
            if (typeof dom === 'string') {
                var item = document.querySelectorAll(dom), i, total = item.length;
                for (i=0; i<total; i++) init(item[i]);
                return;
            }

            var value,
                pos = dom.getBoundingClientRect(),
                size = pos.width,
                sizeQ = size >> 2,
                container = createEl('div', {
                    position: 'relative',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden'
                }),
                mask = createEl('div', {
                    position: 'relative',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden'
                }),
                move = createEl('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    overflow: 'hidden'
                }),
                front = createEl('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    zIndex: 1
                }),
                back = createEl('div', {
                    position: 'absolute',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    left: '0',
                    top: '0',
                    zIndex: 3,
                    backgroundColor: '#ffffff',
                    transform: 'translate(' + size + 'px, ' + 0 + 'px)',
                    overflow: 'hidden'
                }),
                backImg = createEl('div', {
                    position: 'relative',
                    borderRadius: '50%',
                    width: size + 'px',
                    height: size + 'px',
                    opacity: '0.4'
                }),
                backShadow = createEl('div', {
                    position: 'absolute',
                    width: size + 'px',
                    height: size + 'px',
                    left: '0',
                    top: '0',
                    zIndex: 4
                }),
                depth = createEl('div', {
                    position: 'absolute',
                    width: size + 'px',
                    height: size + 'px',
                    left: '0',
                    top: '0',
                    zIndex: 1
                });

            front.className = 'sticker-img sticker-front';
            backImg.className = 'sticker-img sticker-back';
            backShadow.className = depth.className = 'sticker-shadow';
            dom.appendChild(container);
            container.appendChild(mask);
            mask.appendChild(move);
            move.appendChild(front);
            move.appendChild(depth);
            move.appendChild(back);
            back.appendChild(backImg);
            back.appendChild(backShadow);

            value = {container:container, size:size, sizeQ:sizeQ, mask:mask, move:move, depth:depth, back:back, backImg:backImg, backShadow:backShadow};

            dom.addEventListener('mouseenter', function(e) {
                onEnter(e, value);
            }, false);
            dom.addEventListener('mouseleave', function(e) {
                onLeave(e, value);
            }, false);
            dom.addEventListener('mousemove', function(e) {
                onMove(e, value);
            }, false);

            return this;
        }
    }

    /* CommonJS */
    if (typeof exports == 'object')  module.exports = sticker;
    /* AMD module */
    else if (typeof define == 'function' && define.amd) define(function(){ return sticker });
    /* Browser global */
    else this.Sticker = sticker;
})();

