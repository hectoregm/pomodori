(function(win,jQuery,undefined){

    // if no query selector or soon has already been loaded / when using a module loader the test is irrelevant
    if (!document.querySelectorAll || win.Soon) {return;}

    var exports = {};
    var utils = {};
    var view = {};
    var transform = {};

    // setup resizer
    var resizer = {
        timer:0,
        cbs:[],
        register:function(cb) {
            resizer.cbs.push(cb);
        },
        deregister:function(cb){
            var i=resizer.cbs.length-1;
            for(;i>=0;i--) {
                if (resizer.cbs[i]===cb) {
                    resizer.cbs.splice(i,1);
                }
            }
        },
        onresize:function(){
            clearTimeout(resizer.timer);
            resizer.timer = setTimeout(function(){
                resizer.resize();
            },100);
        },
        resize:function(){
            var i= 0,l=resizer.cbs.length;
            for(;i<l;i++) {
                resizer.cbs[i]();
            }
        },
        init:function(){
            if (!win.addEventListener){return;}
            win.addEventListener('resize',resizer.onresize,false);
        }
    };


// bind polyfill
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}


// indexof polyfill
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            var kValue;
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

// classlist polyfill
(function () {

    if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

    var prototype = Array.prototype,
        push = prototype.push,
        splice = prototype.splice,
        join = prototype.join;

    function DOMTokenList(el) {
        this.el = el;
        // The className needs to be trimmed and split on whitespace
        // to retrieve a list of classes.
        var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
            push.call(this, classes[i]);
        }
    }

    DOMTokenList.prototype = {
        add: function(token) {
            if(this.contains(token)) return;
            push.call(this, token);
            this.el.className = this.toString();
        },
        contains: function(token) {
            return this.el.className.indexOf(token) != -1;
        },
        item: function(index) {
            return this[index] || null;
        },
        remove: function(token) {
            if (!this.contains(token)) return;
            for (var i = 0; i < this.length; i++) {
                if (this[i] == token) break;
            }
            splice.call(this, i, 1);
            this.el.className = this.toString();
        },
        toString: function() {
            return join.call(this, ' ');
        },
        toggle: function(token) {
            if (!this.contains(token)) {
                this.add(token);
            } else {
                this.remove(token);
            }

            return this.contains(token);
        }
    };

    window.DOMTokenList = DOMTokenList;

    function defineElementGetter (obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop,{
                get : getter
            });
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }

    defineElementGetter(Element.prototype, 'classList', function () {
        return new DOMTokenList(this);
    });

})();

// request animation frame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
utils = (function(){

    // iso to date
    // http://stackoverflow.com/questions/11020658/javascript-json-date-parse-in-ie7-ie8-returns-nan
    var dateFromISO = function(s){
        var day, tz,
            rx=/^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
            p= rx.exec(s) || [];
        if(p[1]){
            day= p[1].split(/\D/);
            for(var i= 0, L= day.length; i<L; i++){
                day[i]= parseInt(day[i], 10) || 0;
            }
            day[1]-= 1;
            day= new Date(Date.UTC.apply(Date, day));
            if(!day.getDate()) return Number.NaN;
            if(p[5]){
                tz= (parseInt(p[5], 10)*60);
                if(p[6]) tz+= parseInt(p[6], 10);
                if(p[4]== '+') tz*= -1;
                if(tz) day.setUTCMinutes(day.getUTCMinutes()+ tz);
            }
            return day;
        }
        return Number.NaN;
    };

    var _dt = new Date('2015-01-01T12:00:00.123+01:00');
    var getDate = isNaN(_dt) ? function(iso) {return dateFromISO(iso);} : function(iso){return new Date(iso);};

    // test if this browser supports 3d transforms
    function hasTransformSupport() {
        if (!window.getComputedStyle) {
            return false;
        }

        var el = document.createElement('div'),
            has3d,
            transforms = {
                'webkitTransform':'-webkit-transform',
                'OTransform':'-o-transform',
                'msTransform':'-ms-transform',
                'MozTransform':'-moz-transform',
                'transform':'transform'
            };

        // Add it to the body to get the computed style.
        document.body.insertBefore(el, null);

        for (var t in transforms) {
            if (el.style[t] !== undefined) {
                el.style[t] = 'translate3d(1px,1px,1px)';
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }

        document.body.removeChild(el);

        return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }

    // test for animation support
    function hasAnimationSupport(){

        var animation = false,
            animationString = 'animation',
            keyframePrefix = '',
            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
            pfx  = '',
            i= 0,
            elm = document.body,
            l=domPrefixes.length;

        if (elm.style.animationName !== undefined ) { animation = true; }

        if (animation === false) {
            for(; i < l; i++ ) {
                if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                    pfx = domPrefixes[ i ];
                    animationString = pfx + 'Animation';
                    keyframePrefix = '-' + pfx.toLowerCase() + '-';
                    animation = true;
                    break;
                }
            }
        }
        return animation;

    }

    var documentVisibilityEvent;
    var documentHiddenAttribute;
    if (typeof document.hidden !== 'undefined') {
        documentHiddenAttribute = 'hidden';
        documentVisibilityEvent = 'visibilitychange';
    } else if (typeof document.mozHidden !== 'undefined') {
        documentHiddenAttribute = 'mozHidden';
        documentVisibilityEvent = 'mozvisibilitychange';
    } else if (typeof document.msHidden !== 'undefined') {
        documentHiddenAttribute = 'msHidden';
        documentVisibilityEvent = 'msvisibilitychange';
    } else if (typeof document.webkitHidden !== 'undefined') {
        documentHiddenAttribute = 'webkitHidden';
        documentVisibilityEvent = 'webkitvisibilitychange';
    }


    var animationsSupported = false;
    var textContentSupported = false;

    var millisecond = 1,
        second = 1000 * millisecond,
        minute = 60 * second,
        hour = 60 * minute,
        day = 24 * hour,
        week = (365 / 52) * day,
        month = (365 / 12) * day,
        year = 365 * day;

    var exports = {

        MAX:{
            y:100,
            M:12,
            w:52,
            d:365,
            h:24,
            m:60,
            s:60,
            ms:1000
        },

        AMOUNT:{
            y:year,
            M:month,
            w:week,
            d:day,
            h:hour,
            m:minute,
            s:second,
            ms:millisecond
        },

        CIRC:Math.PI * 2,
        QUART:Math.PI * .5,

        DAYS:['su','mo','tu','we','th','fr','sa'],

        setText:null,

        documentVisibilityEvent:documentVisibilityEvent,

        pad:function(value){return ('00' + value).slice(-2)},

        getDayIndex:function(day) {
            return this.DAYS.indexOf(day.substr(0,2));
        },

        isSlow:function() {
            return !('textContent' in document.body);
        },

        supportsAnimation:function() {

            // for animations we need both the animation and the transform API
            animationsSupported = hasAnimationSupport() && hasTransformSupport();

            exports.supportsAnimation = function(){return animationsSupported;};

            return animationsSupported;

        },

        toArray:function(args) {
            return Array.prototype.slice.call(args);
        },

        toBoolean:function(value) {
            if (typeof value === 'string') {
                return value === 'true';
            }
            return value;
        },

        isoToDate:function(iso) {

            // contains timezone?
            if (iso.match(/(Z)|([+\-][0-9]{2}:?[0-9]*$)/g)) {
                return getDate(iso);
            }

            // no timezone and contains time, make local
            iso += iso.indexOf('T') !==-1 ? 'Z' : '';
            var date = getDate(iso);
            return this.dateToLocal(date);
        },

        dateToLocal:function(date) {
            return new Date(
                date.getTime() + (date.getTimezoneOffset() * 60000)
            );
        },

        prefix:(function(){
            var vendors = ['webkit', 'Moz', 'ms', 'O'],i = 0,l = vendors.length,transform,elementStyle = document.createElement('div').style;
            for (;i<l;i++) {
                transform = vendors[i] + 'Transform';
                if (transform in elementStyle ) { return vendors[i]; }
            }
            return null;
        })(),

        setTransform:function(element,value) {
            element.style[this.prefix + 'Transform'] = value;
            element.style['transform'] = value;
        },

        setTransitionDelay:function(element,value) {
            element.style[this.prefix + 'TransitionDelay'] = value + ',' + value + ',' + value;
            element.style['TransitionDelay'] = value + ',' + value + ',' + value;
        },

        getShadowProperties:function(value) {
            value = value ? value.match(/(-?\d+px)|(rgba\(.+\))|(rgb\(.+\))|(#[abcdef\d]+)/g) : null;
            if (!value) {return null;}
            var i=0,l=value.length,c,r=[];
            for(;i<l;i++) {
                if(value[i].indexOf('px')!==-1) {
                    r.push(parseInt(value[i],10));
                }
                else {
                    c = value[i];
                }
            }
            r.push(c);

            if (r.length === 5) {
                r.splice(3,1);
            }

            return r;
        },

        getDevicePixelRatio:function() {
            return window.devicePixelRatio || 1;
        },

        isDocumentHidden:function() {
            return documentHiddenAttribute ? document[documentHiddenAttribute] : false;
        },

        triggerAnimation:function(element,animationClass) {

            element.classList.remove(animationClass);

            window.requestAnimationFrame(function(){

                element.offsetLeft;
                element.classList.add(animationClass);

            });

        },

        getBackingStoreRatio:function(ctx) {
            return ctx.webkitBackingStorePixelRatio ||
                   ctx.mozBackingStorePixelRatio ||
                   ctx.msBackingStorePixelRatio ||
                   ctx.oBackingStorePixelRatio ||
                   ctx.backingStorePixelRatio || 1;
        },

        setShadow:function(ctx,x,y,blur,color) {
            ctx.shadowOffsetX = x;
            ctx.shadowOffsetY = y;
            ctx.shadowBlur = blur;
            ctx.shadowColor = color;
        },

        getColorBetween:function(from,to,percent) {

            function makeChannel(a, b) {
                return(a + Math.round((b-a)*percent));
            }

            function makeColorPiece(num) {
                num = Math.min(num, 255);   // not more than 255
                num = Math.max(num, 0);     // not less than 0
                var str = num.toString(16);
                if (str.length < 2) {
                    str = '0' + str;
                }
                return(str);
            }

            return('#' +
                makeColorPiece(makeChannel(from.r, to.r)) +
                makeColorPiece(makeChannel(from.g, to.g)) +
                makeColorPiece(makeChannel(from.b, to.b))
            );

        },

        getGradientColors:function(from,to,detail) {

            // calculate in betweens
            var colors = [];
            var i=0,l=detail,s=1/(l-1),p=0;
            for(;i<l;i++) {
                colors[i] = this.getColorBetween(from,to,p);
                p += s;
            }

            return colors;
        },

        hexToRgb:function(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        drawGradientArc:function(ctx,x,y,radius,offset,length,from,to,width,colorFrom,colorTo,shadow,cap) {

            if (to < from) {return;}

            // add shadow
            if (shadow) {

                this.drawArc(
                    ctx,
                    x,
                    y,
                    radius,

                    offset,
                    length,
                    from,
                    to,

                    width,
                    'transparent',
                    shadow,

                    cap
                );

            }

            var fromRGB = this.hexToRgb(colorFrom);
            var toRGB = this.hexToRgb(colorTo);

            // get relative to and from color
            var fromRGBRelative = this.hexToRgb(this.getColorBetween(fromRGB,toRGB,(from - offset) / length));
            var toRGBRelative = this.hexToRgb(this.getColorBetween(fromRGB,toRGB,(to - offset) / length));

            // get all colors
            var range = to - from;
            var segmentCount = Math.ceil(range * 30);
            var colors = this.getGradientColors(fromRGBRelative,toRGBRelative,segmentCount);

            // let's do this
            var start = -this.QUART + (this.CIRC * from);
            var gradient;
            var startColor,endColor,xStart,yStart,xEnd,yEnd;
            var l = colors.length;
            var i = 0;
            var segment = (this.CIRC * range) / l;

            for (; i < l; i++) {

                startColor = colors[i];
                endColor = colors[i+1] || startColor;

                // x start / end of the next arc to draw
                xStart = x + Math.cos(start) * radius;
                xEnd = x + Math.cos(start + segment) * radius;

                // y start / end of the next arc to draw
                yStart = y + Math.sin(start) * radius;
                yEnd = y + Math.sin(start + segment) * radius;

                ctx.beginPath();

                gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
                gradient.addColorStop(0, startColor);
                gradient.addColorStop(1.0, endColor);

                ctx.lineCap = cap;
                ctx.strokeStyle = gradient;
                ctx.arc(x, y, radius, start -.005, start + segment + 0.005);
                ctx.lineWidth = width;
                ctx.stroke();
                ctx.closePath();

                start += segment;
            }

        },

        drawArc:function(ctx,x,y,radius,offset,length,from,to,width,color,shadow,cap) {

            if (to < from) {return;}

            if (color.gradient.colors !== null && color.gradient.type === 'follow') {

                this.drawGradientArc(
                    ctx,
                    x,
                    y,
                    radius,

                    offset,
                    length,
                    from,
                    to,

                    width,
                    color.gradient.colors[0],
                    color.gradient.colors[1],
                    shadow,

                    cap
                );

                return;
            }

            if (shadow) {

                var translation = color.fill === 'transparent' ? 9999 : 0;

                ctx.save();

                ctx.translate(translation,0);

                this.setShadow(
                    ctx,
                    shadow[0] - translation,
                    shadow[1],
                    shadow[2],
                    shadow[3]
                );

            }

            ctx.beginPath();
            ctx.lineWidth = width;

            ctx.arc(
            x, y, radius,
            -this.QUART + (this.CIRC * from),
            -this.QUART + (this.CIRC * to)
            , false);


            if (color.gradient.colors) {
                var grad = color.gradient.type === 'horizontal' ?
                    ctx.createLinearGradient(0, radius, radius * 2, radius) :
                    ctx.createLinearGradient(radius, 0, radius, radius * 2);
                grad.addColorStop(0, color.gradient.colors[0]);
                grad.addColorStop(1, color.gradient.colors[1]);
                ctx.strokeStyle = grad;
            }
            else {
                ctx.strokeStyle = color.fill === 'transparent' ? '#000' : color.fill;
            }


            ctx.lineCap = cap;

            ctx.stroke();

            if (shadow) {
                ctx.restore();
            }

        },

        drawRing:function(ctx,

                          progress,

                          offset,
                          length,
                          gap,

                          size,

                          radiusRing,
                          widthRing,
                          colorRing,
                          shadowRing,

                          radiusProgress,
                          widthProgress,
                          colorProgress,
                          shadowProgress,

                          cap,

                          invert
            ) {

            if (length + gap > 1) {
                length = length - (-1 + length + gap);
                offset = offset + (gap * .5);
            }

            var aStart = offset;
            var bEnd = offset + length;
            var mid = progress * length;
            var scale = .5 - Math.abs(-.5 + progress);
            var aEnd = offset + (mid - (scale * gap));
            var bStart = offset + (mid + ((1-scale) * gap));

            // if no radius supplied, quit
            if (!radiusRing && !radiusProgress) {return;}

            // let's draw
            if (invert) {

                this.drawArc(
                    ctx,size,size,radiusRing,
                    offset,length,
                    bStart,bEnd,
                    widthRing,colorRing,shadowRing,
                    cap
                );

                this.drawArc(
                    ctx,size,size,radiusProgress,
                    offset,length,
                    aStart,aEnd,
                    widthProgress,colorProgress,shadowProgress,
                    cap
                );

            }
            else {

                this.drawArc(
                    ctx,size,size,radiusRing,
                    offset,length,
                    aStart,aEnd,
                    widthRing,colorRing,shadowRing,
                    cap
                );

                this.drawArc(
                    ctx,size,size,radiusProgress,
                    offset,length,
                    bStart,bEnd,
                    widthProgress,colorProgress,shadowProgress,
                    cap
                );

            }
        },

        setTextContent:function(node,text) {
            if ('textContent' in document.body) {
                node.textContent = text;
                exports.setTextContent = function(node,text) {
                    node.textContent = text;
                }
            }
            else {
                node.innerText = text;
                exports.setTextContent = function(node,text) {
                    node.innerText = text;
                }
            }
        }

    };

    return exports;

}());
transform.cap = function(min,max) {
    min = min || 0;
    max = max || 1;
    return function (value){
        return Math.min(Math.max(value,min),max);
    }
};
transform.chain = (function(Utils){

    return function() {

        var transforms = Utils.toArray(arguments);
        var i;
        var l=transforms.length;

        return function(value) {
            for (i=0;i<l;i++) {
                value = transforms[i](value);
            }
            return value;
        }
    };

}(utils));

transform.chars = function(){
    return function(value) {
        return (value + '').split('');
    }
};
transform.diff = function(diff){
    return function(value){
        return diff - value;
    }
};
transform.duplicate = function(count) {
    var arr = new Array(count);
    var i;
    return function (value){
        i = count;
        while (i--) {
            arr[i] = value;
        }
        return arr;
    }
};
transform.duration = (function(Utils){

    var formats = ['y','M','w','d','h','m','s','ms'];
    var l = formats.length;

    return function(format,cascade) {

        return function(value){

            var i=0;
            var result = [];
            var remaining = value;
            var used,key,required;

            for(;i<l;i++) {

                key = formats[i];
                required = Utils.AMOUNT[key];

                // how much is used by this format type
                used = Math.floor(remaining / required);

                // is this format type is used in a slot calculate what's left
                if (format.indexOf(key) !== -1) {

                    // subtract
                    remaining = remaining % required;

                    // and add results
                    result.push(Math.max(0,used));

                }
                else if (!cascade) {

                    // if we're not cascading act as if we used up the value
                    remaining = remaining % required;
                }

            }

            return result;

        }

    };

}(utils));

transform.event = function(test,callback) {
    return function(value) {
        if (test(value)) {
            callback();
        }
        return value;
    }
};
transform.modulate = function(char) {
    return function(value) {
        return parseInt(value,10) % 2 === 0 ? char : '';
    }
};
transform.now = function() {

    // fixed date

    return function() {
        return new Date().getTime();
    }
};
transform.offset = function(date){
    return function(value) {
        return date + value;
    }
};
transform.pad = function(padding){
    padding = padding || '';
    return function(value) {
        return (padding + value).slice(-padding.length);
    }
};
transform.plural = function(single,plural) {
    return function(value) {
        return parseInt(value,10) === 1 ? single : plural;
    }
};
transform.progress = function(offset,target){
    return function(value) {
        value = parseInt(value,10);
        if (target > offset) {
            return value / target;
        }
        return (offset - value) / offset;
    }
};
view.Console = (function(){

    var exports = function(options){

        this._transform = options.transform || function(value){return value;};

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function(){
            return null;
        },

        getElement:function(){
            return null;
        },

        setValue:function(value) {
            console.log(this._transform(value));
        }

    };

    return exports;

}());
view.Fill = (function(Utils){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-fill ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};
        this._direction = 'to-top';

        var i=0,l=options.modifiers.length;
        for(;i<l;i++) {
            if (options.modifiers[i].indexOf('to-')===0) {
                this._direction = options.modifiers[i];
                break;
            }
        }

        this._fill = document.createElement('span');
        this._fill.className = 'soon-fill-inner';

        this._progress = document.createElement('span');
        this._progress.className = 'soon-fill-progress';
        this._fill.appendChild(this._progress);

        this._wrapper.appendChild(this._fill);

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        setValue:function(value){

            var t = this._transform(value);
            var tr;

            switch(this._direction) {
                case 'to-top':
                    tr = 'translateY(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-top-right':
                    tr = 'scale(1.45) rotateZ(-45deg) translateX(' + (-100 + (t * 100)) + '%)';
                    break;
                case 'to-top-left':
                    tr = 'scale(1.45) rotateZ(45deg) translateX(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-left':
                    tr = 'translateX(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-right':
                    tr = 'translateX(' + (-100 + (t * 100)) + '%)';
                    break;
                case 'to-bottom-right':
                    tr = 'scale(1.45) rotateZ(45deg) translateX(' + (-100 + (t * 100)) + '%)';
                    break;
                case 'to-bottom-left':
                    tr = 'scale(1.45) rotateZ(-45deg) translateX(' + (100 - (t * 100)) + '%)';
                    break;
                case 'to-bottom':
                    tr = 'translateY(' + (-100 + (t * 100)) + '%)';
                    break;
                default:
                    break;
            }

            Utils.setTransform(this._progress,tr);

        }
    };

    return exports;

}(utils));
view.Flip = (function (Utils) {

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-flip ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};

        this._inner = document.createElement('span');
        this._inner.className = 'soon-flip-inner';

        this._card = document.createElement('span');
        this._card.className = 'soon-flip-card';

        if (Utils.supportsAnimation()) {

            this._front = document.createElement('span');
            this._front.className = 'soon-flip-front soon-flip-face';
            this._back = document.createElement('span');
            this._back.className = 'soon-flip-back soon-flip-face';

            this._card.appendChild(this._front);
            this._card.appendChild(this._back);

            this._top = document.createElement('span');
            this._top.className = 'soon-flip-top soon-flip-face';
            this._card.appendChild(this._top);

            this._bottom = document.createElement('span');
            this._bottom.className = 'soon-flip-bottom soon-flip-face';
            this._card.appendChild(this._bottom);

        }
        else {
            this._fallback = document.createElement('span');
            this._fallback.className = 'soon-flip-fallback';
            this._card.appendChild(this._fallback);
        }

        this._bounding = document.createElement('span');
        this._bounding.className = 'soon-flip-bounding';
        this._card.appendChild(this._bounding);

        this._inner.appendChild(this._card);

        this._wrapper.appendChild(this._inner);

        this._frontValue = null;
        this._backValue = null;
        this._boundingLength = 0;

    };

    exports.prototype = {

        redraw:function(){},

        _setBoundingForValue:function(value) {

            // if value has a different length than before, change bounding box
            var l = (value + '').length;
            if (l === this._boundingLength) {
                return;
            }

            // set new bounding length
            this._boundingLength = l;

            // build character string
            var str = '',i=0;
            for (;i<l;i++) {
                str+='8';
            }

            // setup spacer
            this._bounding.textContent = str;

            // update flipper width, we do this to create a layout boundary so page reflows cost less cpu
            var size = parseInt(getComputedStyle(this._card).fontSize,10);
            var factor = this._bounding.offsetWidth / size;

            // per character we add .1 to fix any font problems, then we apply the width
            this._inner.style.width = (factor + ((l-1) * .1)) + 'em';


        },

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function() {
            return this._wrapper;
        },

        setValue:function(value) {

            value = this._transform(value);

            // if no animation support stop here
            if (!Utils.supportsAnimation()) {
                this._fallback.textContent = value;
                this._setBoundingForValue(value);
                return;
            }

            // check if is currently empty, if so, don't animate but only do setup
            if (!this._frontValue) {
                this._bottom.textContent = value;
                this._front.textContent = value;
                this._frontValue = value;
                this._setBoundingForValue(value);
                return;
            }

            // if is same value as previously stop here
            if (this._backValue && this._backValue === value || this._frontValue === value) {
                return;
            }

            // check if already has value, if so, move value to other panel
            if (this._backValue) {
                this._bottom.textContent = this._backValue;
                this._front.textContent = this._backValue;
                this._frontValue = this._backValue;
            }

            // set values
            this._setBoundingForValue(value);
            this._top.textContent = value;
            this._back.textContent = value;
            this._backValue = value;

            // trigger
            Utils.triggerAnimation(this._inner,'soon-flip-animate');

        }

    };

    return exports;

}(utils));
view.Group = (function(getPresenter){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-group ' + (options.className || '');

        this._inner = document.createElement('span');
        this._inner.className = 'soon-group-inner';
        this._wrapper.appendChild(this._inner);

        this._transform = options.transform || function(value){return value;};

        this._presenters = options.presenters;

        this._presenterStorage = [];

    };

    exports.prototype = {

        redraw:function(){
            var i=this._presenterStorage.length-1;
            for(;i>=0;i--) {
                this._presenterStorage[i].redraw();
            }
        },

        destroy:function() {
            var i=this._presenterStorage.length-1;
            for(;i>=0;i--) {
                this._presenterStorage[i].destroy();
            }
            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        setValue:function(value) {

            // set value, if it's 0 we can hide a group if necessary
            this._wrapper.setAttribute('data-value',value);

            // present value
            value = this._transform(value);
            var i=0;
            var isArray = value instanceof Array;
            var l = isArray ? value.length : this._presenters.length;
            var presenter;

            for (;i<l;i++) {

                presenter = this._presenterStorage[i];

                if (!presenter) {
                    presenter = getPresenter(this._presenters[i]);
                    this._inner.appendChild(presenter.getElement());
                    this._presenterStorage[i] = presenter;
                }

                presenter.setValue(isArray ? value[i] : value);

            }

        }

    };

    return exports;

}(getPresenter));
view.Matrix = (function(){

    var digits = {
        ' ':[
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ],
        '0':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '1':[
            [0,0,1,1,0],
            [0,1,1,1,0],
            [0,0,1,1,0],
            [0,0,1,1,0],
            [0,0,1,1,0],
            [0,0,1,1,0],
            [0,1,1,1,1]
        ],
        '2':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [0,0,0,1,1],
            [0,0,1,1,0],
            [0,1,1,0,0],
            [1,1,0,0,0],
            [1,1,1,1,1]
        ],
        '3':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [0,0,0,1,1],
            [0,0,1,1,0],
            [0,0,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '4':[
            [0,0,1,1,1],
            [0,1,0,1,1],
            [1,1,0,1,1],
            [1,1,1,1,1],
            [0,0,0,1,1],
            [0,0,0,1,1],
            [0,0,0,1,1]
        ],
        '5':[
            [1,1,1,1,1],
            [1,1,0,0,0],
            [1,1,0,0,0],
            [1,1,1,1,0],
            [0,0,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '6':[
            [0,1,1,1,0],
            [1,1,0,0,0],
            [1,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '7':[
            [1,1,1,1,1],
            [0,0,0,1,1],
            [0,0,0,1,1],
            [0,0,1,1,0],
            [0,1,1,0,0],
            [1,1,0,0,0],
            [1,1,0,0,0]
        ],
        '8':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '9':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,1],
            [0,0,0,1,1],
            [0,1,1,1,0]
        ]
    };

    var rows = digits[0].length;
    var cols = digits[0][0].length;
    var i=0, j,html='';
    for(;i<rows;i++) {
        html+='<span class="soon-matrix-row">';
        j=0;
        for(;j<cols;j++) {
            html+='<span class="soon-matrix-dot"></span>';
        }
        html+='</span>';
    }

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-matrix ' + (options.className || '');

        this._inner = document.createElement('span');
        this._inner.className = 'soon-matrix-inner';
        this._wrapper.appendChild(this._inner);

        this._transform = options.transform || function(value) {return value;};
        this._value = [];

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        _addChar:function() {

            var char = document.createElement('span');
            char.className = 'soon-matrix-char';
            char.innerHTML = html;
            return {
                node:char,
                ref:[]
            };

        },

        _updateChar:function(char,value) {

            // get dot layout
            var matrix = digits[value];

            // update character
            var j,i= 0,ref = char.ref;
            if(!ref.length) {
                var dots = char.node.getElementsByClassName('soon-matrix-dot');
                for(;i<rows;i++) {
                    ref[i] = [];
                    j=0;
                    for(;j<cols;j++) {
                        ref[i][j] = dots[(i * cols) + j];
                    }
                }
            }

            for(;i<rows;i++) {
                j=0;
                for(;j<cols;j++) {
                    ref[i][j].setAttribute('data-state',matrix[i][j]===1 ? '1' : '0');
                }
            }

        },


        setValue:function(value) {

            value = this._transform(value);
            value += '';
            value = value.split('');
            var i=0;
            var l=value.length;

            for(;i<l;i++) {
                var char = this._value[i];
                if(!char) {
                    char = this._addChar();
                    this._inner.appendChild(char.node);
                    this._value[i] = char;
                }
                this._updateChar(char,value[i]);
            }

        }
    };

    return exports;

}());
view.Repeater = (function(getPresenterByType){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-repeater ' + (options.className || '');

        this._delay = options.delay || 0;
        this._transform = options.transform || function(value){return value;};
        this._destroyed = false;

        this._presenter = options.presenter;
        this._Presenter = getPresenterByType(this._presenter.type);

        this._prepend = typeof options.prepend === 'undefined' ? true : options.prepend;

        this._presenterStorage = [];

    };

    exports.prototype = {

        redraw:function(){
            var i=this._presenterStorage.length-1;
            for(;i>=0;i--) {
                this._presenterStorage[i].redraw();
            }
        },

        destroy:function() {

            this._destroyed = true;

            var i=this._presenterStorage.length-1;
            for(;i>=0;i--) {
                this._presenterStorage[i].destroy();
            }

            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        setValue:function(value) {

            value = this._transform(value);
            value = value instanceof Array ? value : [value];

            if (this._prepend) {
                value.reverse();
            }

            var i=0;
            var l = value.length;
            var presenter;
            var delay = 0;
            var element;
            var crop;
            var swap = value.length !== this._wrapper.children.length;

            for (;i<l;i++) {

                presenter = this._presenterStorage[i];

                if (!presenter) {

                    presenter = new this._Presenter(this._presenter.options || {});

                    if (this._wrapper.children.length === 0 || !this._prepend) {
                        this._wrapper.appendChild(presenter.getElement());
                    }
                    else {
                        this._wrapper.insertBefore(presenter.getElement(),this._wrapper.firstChild);
                    }

                    this._presenterStorage[i] = presenter;

                    if (this._delay) {
                        delay -= this._delay;
                    }

                }

                if (this._delay && !swap) {
                    this._setValueDelayed(presenter,value[i],delay);
                    delay += this._delay;
                }
                else {
                    this._setValue(presenter,value[i],swap);
                }
            }

            l=this._wrapper.children.length;
            crop = i;

            for (;i<l;i++) {

                presenter = this._presenterStorage[i];

                element = presenter.destroy();
                element.parentNode.removeChild(element);

                this._presenterStorage[i] = null;

            }

            this._presenterStorage.length = crop;

        },

        _setValueDelayed:function(presenter,value,delay,swap) {
            var self = this;
            setTimeout(function(){
                self._setValue(presenter,value,swap);
            },delay);
        },

        _setValue:function(presenter,value,swap) {
            if (swap) {
                presenter.setValue(' ');
            }
            presenter.setValue(value);
        }

    };

    return exports;

}(getPresenterByType));
view.Ring = (function(Utils,Resizer){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-ring ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};

        this._modifiers = options.modifiers;

        this._animate = options.animate;

        this._canvas = document.createElement('canvas');
        this._wrapper.appendChild(this._canvas);

        this._style = document.createElement('span');
        this._style.className = 'soon-ring-progress';
        this._style.style.visibility = 'hidden';
        this._style.style.position = 'absolute';
        this._wrapper.appendChild(this._style);

        this._current = 0;
        this._target = null;
        this._destroyed = false;

        this._lastTick = 0;
        this._styles = null;

        // start ticking
        var self = this;
        if (Utils.supportsAnimation()) {
            window.requestAnimationFrame(function(ts){
                self._tick(ts);
            });
        }
    };

    exports.prototype = {

        destroy:function() {
            this._destroyed = true;
            Resizer.deregister(this._resizeBind);
            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        _getModifier:function(type) {

            var i= 0,l=this._modifiers.length,hit=null;
            for (;i<l;i++){
                if (this._modifiers[i].indexOf(type)!==-1) {
                    hit = this._modifiers[i];
                    break;
                }
            }

            if (!hit) {
                return null;
            }

            if (hit.indexOf('-')===-1) {
                return true;
            }

            var parts = hit.split('-');
            if (parts[1].indexOf('_')!==-1) {
                // color
                var colors = parts[1].split('_');
                colors[0] = '#' + colors[0];
                colors[1] = '#' + colors[1];
                return colors;
            }

            var fl = parseFloat(parts[1]);
            if (isNaN(fl)) {
                return parts[1];
            }

            // percentage
            return fl / 100;

        },

        redraw:function(){

            var styles = window.getComputedStyle(this._style);

            this._styles = {
                offset:this._getModifier('offset') || 0,
                gap:this._getModifier('gap') || 0,
                length:this._getModifier('length') || 1,
                flip:this._getModifier('flip') || false,
                invert:this._getModifier('invert') || null,
                align:'center',
                size:0,
                radius:0,
                padding:parseInt(styles.getPropertyValue('padding-bottom'),10) || 0,
                cap:parseInt(styles.getPropertyValue('border-top-right-radius'),10) === 0 ? 'butt' : 'round',
                progressColor:{
                    fill:styles.getPropertyValue('color') || '#000',
                    gradient:{
                        colors:this._getModifier('progressgradient') || null,
                        type:this._getModifier('progressgradienttype') || 'follow'
                    }
                },
                progressWidth:parseInt(styles.getPropertyValue('border-top-width'),10) || 2,
                progressShadow:Utils.getShadowProperties(styles.getPropertyValue('text-shadow')),
                ringColor:{
                    fill:styles.getPropertyValue('background-color') || '#fff',
                    gradient:{
                        colors:this._getModifier('ringgradient') || null,
                        type:this._getModifier('ringgradienttype') || 'follow'
                    }
                },
                ringWidth:parseInt(styles.getPropertyValue('border-bottom-width'),10) || 2,
                ringShadow:Utils.getShadowProperties(styles.getPropertyValue('box-shadow'))
            };

            var ctx = this._canvas.getContext('2d'),
                size = this._canvas.parentNode.clientWidth,
                devicePixelRatio = Utils.getDevicePixelRatio(),
                backingStoreRatio = Utils.getBackingStoreRatio(ctx),
                ratio = devicePixelRatio / backingStoreRatio,
                maxWidthFactor = size < 125 ? Math.min(1,size * .005) : 1;

            // cap width depending on window size, will always result in a minimum width of 1
            this._styles.ringWidth = Math.ceil(this._styles.ringWidth * maxWidthFactor);
            this._styles.progressWidth = Math.ceil(this._styles.progressWidth * maxWidthFactor);

            // fix 'transparent' color values

            if (this._styles.ringColor.fill === 'transparent') {
                this._styles.ringColor.fill = 'rgba(0,0,0,0)';
            }

            if (this._styles.progressColor.fill === 'transparent') {
                this._styles.progressColor.fill = 'rgba(0,0,0,0)';
            }


            // set gap style
            if (this._styles.cap === 'round' && this._modifiers.join('').indexOf('gap-') === -1) {
                this._styles.gap = ((this._styles.ringWidth + this._styles.progressWidth) * .5) * .005;
            }

            if (!size) {
                return;
            }

            if (devicePixelRatio !== backingStoreRatio) {

                this._canvas.width = size * ratio;
                this._canvas.height = size * ratio;

                this._canvas.style.width = size + 'px';
                this._canvas.style.height = size + 'px';

                ctx.scale(ratio,ratio);

            }
            else {

                this._canvas.width = size;
                this._canvas.height = size;
            }

            this._styles.size = size * .5;

            // background
            var radius = (this._styles.size - this._styles.padding);
            this._styles.ringRadius = radius - (this._styles.ringWidth * .5);
            this._styles.progressRadius = radius - (this._styles.progressWidth * .5);

            if (this._styles.progressWidth === this._styles.ringWidth) {
                this._styles.progressRadius = this._styles.ringRadius;
            }
            else if (this._styles.progressWidth < this._styles.ringWidth) {
                // progress
                if (this._modifiers.indexOf('align-center')!==-1) {
                    this._styles.progressRadius = this._styles.ringRadius;
                }
                else if (this._modifiers.indexOf('align-bottom')!==-1) {
                    this._styles.progressRadius = radius - (this._styles.ringWidth - (this._styles.progressWidth *.5));
                }
                else if (this._modifiers.indexOf('align-inside')!==-1) {
                    this._styles.progressRadius = radius - (this._styles.ringWidth + (this._styles.progressWidth * .5));
                }
            }
            else {
                // ring
                if (this._modifiers.indexOf('align-center')!==-1) {
                    this._styles.ringRadius = this._styles.progressRadius;
                }
                else if (this._modifiers.indexOf('align-bottom')!==-1) {
                    this._styles.ringRadius = radius - (this._styles.progressWidth - (this._styles.ringWidth * .5));
                }
                else if (this._modifiers.indexOf('align-inside')!==-1) {
                    this._styles.ringRadius = radius - (this._styles.progressWidth + (this._styles.ringWidth * .5));
                }
            }

            if (this._modifiers.indexOf('glow-progress')!==-1 && this._styles.progressShadow) {
                this._styles.progressShadow[this._styles.progressShadow.length-1] =
                    this._styles.progressColor.gradient.colors !== null ? this._styles.progressColor.gradient.colors[0] : this._styles.progressColor.fill;
            }

            if (this._modifiers.indexOf('glow-background')!==-1 && this._styles.ringShadow) {
                this._styles.ringShadow[this._styles.ringShadow.length-1] =
                    this._styles.ringColor.gradient.colors !== null ? this._styles.ringColor.gradient.colors[0]:  this._styles.ringColor.fill;
            }

            // reset current
            this._current = null;
        },

        _tick:function(ts) {

            if (this._destroyed) {
                return;
            }

            // needs target to function
            if (this._target !== null) {
                this._draw(ts);
            }

            // to the next frame
            var self = this;
            window.requestAnimationFrame(function(ts){
                self._tick(ts);
            });

        },

        _draw:function(ts){

            if (this._animate) {

                // calculate step
                var diff = ts - this._lastTick;
                var fps = diff < 250 ? 1000/diff : 30;
                this._lastTick = ts;

                // if rendering same value, stop here
                if (this._current === this._target) {
                    return;
                }

                // get distance to animate
                this._current += (this._target - this._current) / (fps / 3);

                // if reached target, cap
                if (Math.abs(this._current - this._target) <= .001) {
                    this._current = this._target;
                }

            }
            else {
                this._current = this._target;
            }

            // clear the current context
            var ctx = this._canvas.getContext('2d');
            ctx.clearRect(0,0,this._canvas.width,this._canvas.height);

            // apply flip
            var p = this._styles.flip ? 1 - this._current : this._current;

            Utils.drawRing(
                ctx,

                p,

                this._styles.offset,
                this._styles.length,
                this._styles.gap,

                this._styles.size,

                this._styles.ringRadius,
                this._styles.ringWidth,
                this._styles.ringColor,
                this._styles.ringShadow,

                this._styles.progressRadius,
                this._styles.progressWidth,
                this._styles.progressColor,
                this._styles.progressShadow,

                this._styles.cap,

                this._styles.invert
            );

        },

        setValue:function(value){

            if (!this._styles) {
                this.redraw();
            }

            value = this._transform(value);
            if (this._target !== value) {
                this._target = value;
            }

            if(!Utils.supportsAnimation()) {
                this._current = this._target;
                this._draw();
            }
        }

    };

    return exports;

}(utils,resizer));
view.Slot = (function(Utils){

    var exports = function(options) {

        this._forceReplace = typeof options.forceReplace === 'undefined' ? false : options.forceReplace;

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-slot ' + (options.className || '');

        this._transform = options.transform || function(value){return value;};

        this._new = document.createElement('span');
        this._new.className = 'soon-slot-new';
        this._old = document.createElement('span');
        this._old.className = 'soon-slot-old';

        this._bounding = document.createElement('span');
        this._bounding.className = 'soon-slot-bounding';

        this._inner = document.createElement('span');
        this._inner.className = 'soon-slot-inner soon-slot-animate';

        this._inner.appendChild(this._old);
        this._inner.appendChild(this._new);
        this._inner.appendChild(this._bounding);

        this._wrapper.appendChild(this._inner);

        this._newValue = '';
        this._oldValue = '';
        this._boundingLength = 0;

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function() {
            return this._wrapper;
        },

        _isEmpty:function() {
            return !this._newValue;
        },

        _isSame:function(value) {
            return this._newValue === value;
        },

        _setBoundingForValue:function(value){

            // if value has a different length than before, change bounding box
            var l = (value + '').length;
            if (l === this._boundingLength) {
                return;
            }

            // set new bounding length
            this._boundingLength = l;

            // build character string
            var str = '',i=0;
            for (;i<l;i++) {
                str+='8';
            }

            // setup spacer
            this._bounding.textContent = str;

            // update slot width, we do this to create a layout boundary so page reflows cost less cpu
            var size = parseInt(getComputedStyle(this._wrapper).fontSize,10);
            var factor = this._bounding.offsetWidth / size;

            // per character we add .1 to fix any font problems, then we apply the width
            this._inner.style.width = (factor + ((l-1) * .1)) + 'em';

        },

        _setNewValue:function(value) {
            this._newValue = value;
            if (value !== ' ') {
                this._new.textContent = value;
            }
        },

        _setOldValue:function(value) {
            this._oldValue = value;
            this._old.textContent = value;
        },

        setValue:function(value) {

            // start with old value

            // new value animates in view

            // old value animates out of view

            // transform
            value = this._transform(value);

            // if is currently empty
            if (this._isEmpty()) {
                this._setNewValue(value);
                this._setBoundingForValue(value);

                // animate first character
                Utils.triggerAnimation(this._inner,'soon-slot-animate');
            }

            // if same value, don't do a thing, unless we're forced to replace
            else if (this._isSame(value) && !this._forceReplace) {
                 // do nothing, literally
            }

            // new value
            else {

                if (this._newValue.length) {
                    this._setOldValue(this._newValue);
                }

                this._setNewValue(value);

                this._setBoundingForValue(value);

                Utils.triggerAnimation(this._inner,'soon-slot-animate');

            }

        }

    };

    return exports;

}(utils));
view.Text = (function(Utils){

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-text ' + (options.className || '');
        this._transform = options.transform || function(value) {return value;};

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        setValue:function(value) {
            Utils.setTextContent(this._wrapper,this._transform(value));
        }

    };

    return exports;

}(utils));
var Ticker = (function(win,Utils,undefined){

    var exports = function(cb,options){

        options = options || {};

        // tick rate
        this._rate = options.rate || 1000;

        // time countdown started
        this._offset = null;

        // time passed
        this._time = 0;

        // has the timer been paused
        this._paused = false;

        // reference to tick timeout
        this._nextTickReference = null;
        this._tickBind = this._tick.bind(this);
        
        // on tick callback
        this._onTick = cb || function(){};

        // listen to visibility changes
        if ('addEventListener' in document) {
            document.addEventListener(Utils.documentVisibilityEvent,this);
        }

    };

    exports.prototype = {

        handleEvent:function(){

            if (Utils.isDocumentHidden()) {
                this._lock();
            }
            else {
                this._unlock();
            }

        },

        isRunning:function() {
            return this._offset !== null;
        },

        isPaused:function() {
            return this.isRunning() && this._paused;
        },

        start:function(){

            // if already running stop here
            if (this.isRunning()) {return;}

            // start time
            this.reset();

        },

        getTime:function(){
            return this._time;
        },

        reset:function() {

            // pause
            this.pause();

            // set new offset and reset time passed
            this._offset = new Date().getTime();
            this._time = 0;

            // resume ticking
            this.resume();

        },

        stop:function(){

            var self = this;
            setTimeout(function(){
                self._clearTimer();
                self._offset = null;
            },0);

        },

        pause:function(){

            this._paused = true;

            this._clearTimer();

        },

        resume:function(){

            // if already ticking
            if (!this.isPaused()) {return;}

            // no longer paused
            this._paused = false;

            // calculate new offset
            var newOffset = new Date().getTime();
            this._time += newOffset - this._offset;
            this._offset = newOffset;

            // resume ticking
            this._tick();

        },

        _clearTimer:function() {

            clearTimeout(this._nextTickReference);
            this._nextTickReference = null;

        },

        _lock:function(){

            this._clearTimer();

        },

        _unlock:function() {

            // if timer was paused, don't start ticking
            if (this.isPaused()) {return;}

            // resume ticking
            this.pause();
            this.resume();

        },

        _tick:function(){

            // tick tack
            this._onTick(this._time);

            // add to offset
            this._offset += this._rate;

            // add to passed time
            this._time += this._rate;

            // remember timeout for later clearing
            //clearTimeout(this._nextTickReference);
            this._nextTickReference = win.setTimeout(
                this._tickBind,
                this._offset - new Date().getTime()
            );

        }

    };

    return exports;

}(this,utils));

// private API
var completeCallbacks = [];

var uid = 0;
var size = 0;
var respondTimer = null;
var scales = ['xxl','xl','l','m','s','xs','xxs'];
var scaleDefault = 3; // m
var scaleCount = scales.length;
var soons = [];
var tickerCallbacks = [];
var defaultKeys = {
    'y':{
        'labels':'Year,Years',
        'option':'Years',
        'padding':''
    },
    'M':{
        'labels':'Month,Months',
        'option':'Months',
        'padding':'00'
    },
    'w':{
        'labels':'Week,Weeks',
        'option':'Weeks',
        'padding':'00'
    },
    'd':{
        'labels':'Day,Days',
        'option':'Days',
        'padding':'000'
    },
    'h':{
        'labels':'Hour,Hours',
        'option':'Hours',
        'padding':'00'
    },
    'm':{
        'labels':'Minute,Minutes',
        'option':'Minutes',
        'padding':'00'
    },
    's':{
        'labels':'Second,Seconds',
        'option':'Seconds',
        'padding':'00'
    },
    'ms':{
        'labels':'Millisecond,Milliseconds',
        'option':'Milliseconds',
        'padding':'000'
    }
};

// register respond methods
resizer.register(respond);

// responsive behaviour
function respond() {

    // don't do anything if width has not changed
    if (size === window.innerWidth) {
        return;
    }

    // store new width
    size = window.innerWidth;

    // resize tickers now
    resizeTickers();

}

function fitTicker(node,inner,presenter,available) {

    var root = parseInt(getComputedStyle(document.documentElement).fontSize,10) / 16;
    var currentSize = parseInt(getComputedStyle(inner).fontSize,10) / 16 / root;
    var factor = available / inner.scrollWidth;
    var size = factor * currentSize;

    if (size < 4) {
        node.style.fontSize = '';
        presenter.redraw();
        return false;
    }

    node.style.fontSize = size + 'rem';
    node.setAttribute('data-scale-rounded',Math.round(size).toString());
    presenter.redraw();

    return true;

}

function resizeTicker(node,presenter) {

    // if is slow browser don't do anything
    if (utils.isSlow()){return;}

    // get available space
    var style = window.getComputedStyle(node.parentNode);
    var padLeft = parseInt(style.getPropertyValue('padding-left'),10);
    var padRight = parseInt(style.getPropertyValue('padding-right'),10);
    var available = node.parentNode.clientWidth - padLeft - padRight;

    // get scale settings for this counter
    var max = node.getAttribute('data-scale-max');
    var hide = node.getAttribute('data-scale-hide');
    var scale = max ? scales.indexOf(max) : scaleDefault;

    // setup parameters for scaling
    var groups = node.querySelectorAll('.soon-group-sub');
    var i=0;
    var l=groups.length;
    var inner = node.querySelector('.soon-group');
    var newScale;
    var didHide;

    // show all groups
    for(;i<l;i++) {
        groups[i].style.display = '';
    }

    // if should attempt to fit
    if (max === 'fit' || max === 'fill') {
        if (fitTicker(node,inner,presenter,available)) {
            return; // it fit's we're done
        }
        else {
            scale = 0; // it does not fit, let's scale down
        }
    }

    // while it does not fit pick a smaller scale
    newScale = scale;
    do {
        node.setAttribute('data-scale',scales[newScale]);
        newScale++;
    }
    while (inner.scrollWidth > available && scales[newScale]);
    if (newScale !== scale) {
        presenter.redraw();
    }

    // if fits or no hiding is allowed stop here, stop here
    if (inner.scrollWidth <= available || hide === 'none') {
        return;
    }

    // get groups containing zero values
    i=0;
    didHide=false;
    do {

        // if not empty, move to hiding groups from the right side
        if (groups[i].getAttribute('data-value') !== '0') {
            break;
        }

        // hide the group and recalculate space
        groups[i].style.display = 'none';
        didHide = true;
        i++

    }
    while(inner.scrollWidth > available && i<l);
    if (didHide) {
        presenter.redraw();
    }

    // if only hiding empty values is allowed, let's stop here
    if (hide === 'empty') {
        return;
    }

    // hide from right side
    i=l-1;
    didHide = false;
    do {

        // hide the group and recalculate space
        groups[i].style.display = 'none';
        didHide = true;
        i--;

    }
    while(inner.scrollWidth > available && i > 0);
    if (didHide) {
        presenter.redraw();
    }

}

function resizeTickers() {
    var i=soons.length- 1;
    for(;i>=0;i--) {
        resizeTicker(soons[i].node,soons[i].presenter);
    }
}

function getSoonIndexByElement(element) {
    var i=0;
    var l=soons.length;
    for(;i<l;i++) {
        if (soons[i].node === element) {
            return i;
        }
    }
    return null;
}

function getTickerCallbackIndexByElement(element){
    var i=0;
    var l=tickerCallbacks.length;
    for(;i<l;i++) {
        if (tickerCallbacks[i].node === element) {
            return i;
        }
    }
    return null;
}

function getSoon(element) {
    var index = getSoonIndexByElement(element);
    if (index===null) {
        return null;
    }
    return soons[index];
}

function setDefaultsForSoonElement(element) {

    // add soon class
    if (element.className.indexOf('soon') === -1) {
        element.className += ' soon';
    }

    // add no animation class
    if (!utils.supportsAnimation()) {
        element.className += ' soon-no-animation';
    }

    // set default attributes
    var attr = element.getAttribute('data-layout');
    if (!attr || attr.indexOf('group') === -1 && attr.indexOf('line') === -1) {
        if (!attr) {attr = '';}
        element.setAttribute('data-layout',attr + ' group');
    }

    // if is a slow browser, revert to text
    if (utils.isSlow()) {
        element.removeAttribute('data-visual');
        element.setAttribute('data-view','text');
        element.className += ' soon-slow-browser';
    }

}

function setDataAttribute(element,options,option) {
    if (options[option] && !element.getAttribute('data-' + option)) {
        element.setAttribute('data-' + option,options[option]);
    }
}

function getDataAttribute(element,option) {
    return element.getAttribute('data-' + option);
}

function createClockTransform(options,onComplete) {

    var isCountdown = options.due !== null || options.since !== null;
    var clockTransform = null;

    if (isCountdown) {

        if (options.since) {

            // when counting up
            clockTransform = transform.chain(

                function(value){return options.now ? -value : value;},

                transform.offset(options.now ? options.now.getTime() : new Date().getTime()),
                transform.diff(options.since.getTime()),

                function(value){return Math.abs(value);},
                function(value){return Math.max(0,value);},

                function(value){options.callback.onTick(value,options.since);return value;},

                transform.event(function(value){return value===0;},onComplete),

                transform.duration(options.format,options.cascade)

            );

        }
        else {

            // when counting down
            clockTransform = transform.chain(
                transform.offset(options.now.getTime()),
                transform.diff(options.due.getTime()),

                function(value){return Math.max(0,value);},

                function(value){options.callback.onTick(value,options.due);return value;},

                transform.event(function(value){return value<=0;},onComplete),

                transform.duration(options.format,options.cascade)
            );

        }

    }
    else {
        clockTransform = function(){
            var d = new Date();
            return [
                d.getHours(),
                d.getMinutes(),
                d.getSeconds()
            ]
        };
        options.format = ['h','m','s'];
        options.separator = ':';
    }

    return clockTransform;

}

function createClockOutline(options,onComplete) {

    var isCountdown = options.due !== null || options.since !== null;

    var clockTransform = createClockTransform(options,onComplete);
    var clock = {
        type:'group',
        options:{
            transform:clockTransform,
            presenters:[]
        }
    };

    var presenters = [];
    var l = options.format.length;
    var i= 0;
    var group;
    var text;
    var view;
    var reflectedView;
    var wrapper;
    var format;
    var index;

    for(;i<l;i++) {

        format = options.format[i];
        index = i;

        group = {
            type:'group',
            options:{
                className:'soon-group-sub',
                presenters:[]
            }
        };

        if (options.visual) {

            group.options.presenters.push(createVisualizer(options,format));

            if (options.reflect) {
                group.options.presenters.push(createVisualizer(options,format,'soon-reflection'));
            }

        }

        text = {
            type:'text',
            options:{
                className:'soon-label'
            }
        };

        if (options.singular) {
            text.options.transform = transform.plural(options.label[format],options.label[format + '_s']);
        }
        else {
            text.options.transform = (function(format){ return function(){return options.label[format + '_s'];}}(format));
        }

        // if format is ms
        view = createView(options,format);
        reflectedView = null;

        if (options.reflect && !options.visual) {
            reflectedView = createView(options,format,'soon-reflection');
        }

        // create view object
        group.options.presenters.push(view);

        // create reflected view
        if (reflectedView) {
            group.options.presenters.push(reflectedView);
        }

        // only set labels if this is a countdown
        if (isCountdown) {
            group.options.presenters.push(text);
        }


        // if separator set
        if (options.separator) {

            wrapper = {
                type:'group',
                options:{
                    className:'soon-group-separator',
                    presenters:[
                        group
                    ]
                }
            };

            if (index !== 0) {

                if (options.reflect) {
                    wrapper.options.presenters.unshift(
                        {
                            type: 'text',
                            options: {
                                className: 'soon-separator soon-reflection',
                                transform: function () {
                                    return options.separator;
                                }
                            }
                        }
                    );
                }

                wrapper.options.presenters.unshift(
                    {
                        type: 'text',
                        options: {
                            className: 'soon-separator',
                            transform: function () {
                                return options.separator;
                            }
                        }
                    }
                );


            }

            group = wrapper;
        }

        presenters.push(group);
    }

    clock.options.presenters = presenters;

    return clock;

}

function createVisualizer(options,format,className) {

    // handle which visual to show
    var config = options.visual.split(' ');
    var visual = config[0];
    config.shift();

    // setup
    return {
        type:visual,
        options:{
            className:'soon-visual ' + (className || ''),
            transform:transform.chain(
                transform.progress(utils.MAX[format]),
                transform.cap()
            ),
            modifiers:config,
            animate:format !== 'ms'
        }
    }
}

function createView(options,format,className) {

    if (options.chars) {
        return {
            type:'repeater',
            options:{
                delay:options.view === 'text' ? 0 : 50,
                className:'soon-value ' + (className || ''),
                transform:transform.chain(
                    transform.pad(options.padding[format]),
                    transform.chars()
                ),
                presenter: {
                    type:options.view
                }
            }
        };
    }

    return {
        type:'group',
        options:{
            className:'soon-group-sub-sub soon-value ' + (className || ''),
            transform:transform.pad(options.padding[format]),
            presenters:[
                {
                    type:options.view
                }
            ]
        }
    };

}

function register(element,ticker,presenter,options) {

    soons.push({
        node:element,
        ticker:ticker,
        presenter:presenter,
        options:options
    });

}

function getPresenter(options) {
    return new (getPresenterByType(options.type))(options.options || {});
}

function getPresenterByType(type) {
    return view[type.charAt(0).toUpperCase() + type.slice(1)];
}

function createPresenter(element,presenter) {

    // check if should create on inner element
    var ph = element.getElementsByClassName ? element.getElementsByClassName('soon-placeholder') : element.querySelectorAll('soon-placeholder');
    if (ph.length) {
        ph[0].innerHTML = '';
        element = ph[0];
    }

    // else turn the entire element into a presenter
    var presenterInstance = getPresenter(presenter);
    element.appendChild(presenterInstance.getElement());
    return presenterInstance;
}

function createTicker(element,presenter,rate,options) {

    // create ticker instance
    var ticker = new Ticker(
        function(runTime) {
            presenter.setValue(runTime);
        },
        {
            rate:rate
        }
    );

    // remember this ticker for reset, resize and destroy
    register(element,ticker,presenter,options);

    // start ticker
    ticker.start();

    // resize element after first tick
    resizeTicker(element,presenter);

    // return
    return ticker;

}

function createByElement(element) {

    // set single options
    var defaults;
    var types = ['labels','padding'];
    var i,l=2; // 2 == types length
    var options = {
        since:getDataAttribute(element,'since'),
        due:getDataAttribute(element,'due'),
        now:getDataAttribute(element,'now'),
        face:getDataAttribute(element,'face'),
        visual:getDataAttribute(element,'visual'),
        format:getDataAttribute(element,'format'),
        singular:getDataAttribute(element,'singular') === 'true',
        reflect:getDataAttribute(element,'reflect') === 'true',
        scaleMax:getDataAttribute(element,'scale-max'),
        scaleHide:getDataAttribute(element,'scale-hide'),
        separateChars:(!(getDataAttribute(element,'separate-chars') === 'false')),
        cascade:(!(getDataAttribute(element,'cascade') === 'false')),
        separator:getDataAttribute(element,'separator'),
        padding:(!(getDataAttribute(element,'padding') === 'false')),
        eventComplete:getDataAttribute(element,'event-complete'),
        eventTick:getDataAttribute(element,'event-tick')
    };

    // get group options for labels
    for (var key in defaultKeys) {
        if (!defaultKeys.hasOwnProperty(key)){continue;}
        defaults = defaultKeys[key];
        for(i=0;i<l;i++) {
            options[types[i] + defaults.option] = getDataAttribute(element,types[i] + '-' + defaults.option.toLowerCase());
        }
    }

    return exports.create(element,options);
}

var inRegExp = /([\d]+)[\s]+([a-z]+)/i;
var atRegExp = /([\d]+)[:]*([\d]{2})*[:]*([\d]{2})*/;

function getDueDate(due) {

    var date;

    if (due.indexOf('in ') === 0) {

        // in 1 hour
        // in 3 hours
        // in 1 minute
        // in 60 minutes
        // in 1 second
        // in 5 seconds

        var duration = due.match(inRegExp);
        var c = parseInt(duration[1],10);
        var q = duration[2];

        // set date
        date = new Date();
        if (q.indexOf('hour')!==-1) {
            date.setHours(date.getHours() + c);
        }
        else if (q.indexOf('minute')!==-1) {
            date.setMinutes(date.getMinutes() + c);
        }
        else if (q.indexOf('second') !== -1) {
            date.setSeconds(date.getSeconds() + c);
        }

        return date;

    }
    else if (due.indexOf('at ')!==-1) {

        // at 12
        // at 9
        // monday at 10:30
        // at 15:10:20
        // sunday at 10 zone +01:00
        // reset at 12:30

        date = new Date();
        var now = date.getTime();
        var reset = due.indexOf('reset')!==-1;
        due = due.replace('reset ','');
        var parts = due.split('at ');
        var dueTime = parts[1].match(atRegExp);
        var h = parseInt(dueTime[1],10);
        var m = dueTime[2] ? parseInt(dueTime[2],10) : 0;
        var s = dueTime[3] ? parseInt(dueTime[3],10) : 0;

        // get zone
        var zone = parts[1].split(' zone ');
        if (zone) {
            zone = zone[1];
        }

        // set day of week
        if (parts[0].length) {
            var dayIndex = utils.getDayIndex(parts[0]);
            var distance = (dayIndex + 7 - date.getDay()) % 7;
            date.setDate(date.getDate() + distance);
        }

        // set time
        date.setHours(h);
        date.setMinutes(m);
        date.setSeconds(s);
        date.setMilliseconds(0);

        // test if date has just passed, if so, jump day or week depending on setting
        if (reset && now >= date.getTime()) {
            date.setHours(h + (parts[0].length ? 7*24 : 24));
        }

        // create iso
        var p = utils.pad;
        var isoDate = date.getFullYear() + '-' + p(date.getMonth()+1) + '-' + p(date.getDate());
        var isoTime = p(date.getHours()) + ':' + p(date.getMinutes()) + ':' + p(date.getSeconds());
        due = isoDate + 'T' + isoTime + (zone || '');
    }

    return utils.isoToDate(due);
}

function getPaddingForFormat(key,format) {

    // if is first, no padding
    if (format.indexOf(key) === 0) {
        return '';
    }

    // if weeks
    if (key === 'w') {

        // when months set, maximum value for weeks is 4
        if (format.indexOf('M')!==-1) {
            return '';
        }

    }

    // if days
    if (key === 'd') {

        // when weeks set, days have no padding
        if (format.indexOf('w')!==-1) {
            return '';
        }

        if (format.indexOf('M')!==-1) {
            return '00';
        }

    }

    return null;

}

function createLoopFunction(element,options,cb) {

    // already created loop function for this counter
    if (cb && completeCallbacks.indexOf(element)!==-1) {
        return cb;
    }

    // generate unique complete callback function
    var loop = (function (complete) {
        return function () {
            complete();

            // recreate counter
            exports.destroy(element);
            exports.create(element, options);

        };

    }(cb));


    // remember
    completeCallbacks.push(element);

    // loop is returned
    return loop;

}

/**
 * Public API
 */
exports.parse = function(element) {
    createByElement(element);
};

exports.redraw = function(element) {
    if (element) {
        resizeTicker(element);
    }
    else {
        resizeTickers();
    }
};

exports.reset = function(element) {
    var soon = getSoon(element);
    if (soon) {
        soon.ticker.reset();
    }
};

exports.freeze = function(element) {

    // hold current time
    var soon = getSoon(element);
    if (soon) {
        soon.ticker.pause();
    }

};

exports.unfreeze = function(element) {

    // continue counter, will make time jump
    var soon = getSoon(element);
    if (soon) {
        soon.ticker.resume();
    }

};

exports.setOption = function(element,property,value) {

    var soon = getSoon(element);
    if (!soon) {
        return;
    }

    var options = soon.options;
    options[property] = value;

    this.destroy(element);

    this.create(element,options);

};

exports.destroy = function(element) {

    var index = getSoonIndexByElement(element);
    if (index === null) {return;}

    var tickerIndex = getTickerCallbackIndexByElement(element);
    if (tickerIndex !== null) {
        tickerCallbacks.splice(tickerIndex,1);
    }

    var soon = soons[index];

    // if a ticker is attached, stop it before killing the presenter
    if (soon.ticker) {
        soon.ticker.stop();
    }

    // remove presenter
    soon.presenter.destroy();

    // remove the node
    soon.node.removeChild(soon.node.querySelector('.soon-group'));

    // set initialized to false
    element.removeAttribute('data-initialized');

    // remove the soon object from the collection
    soons.splice(index,1);
};

exports.create = function(element,options) {

    // if no options call on element
    if (!options) {
        return createByElement(element);
    }

    // test if not already initialized
    if (element.getAttribute('data-initialized')==='true') {
        return null;
    }

    // now initialized
    element.setAttribute('data-initialized','true');

    // get callbacks
    var cbComplete = null;
    var cbTick = null;

    if (options.eventComplete) {
        cbComplete = typeof options.eventComplete === 'string' ? window[options.eventComplete] : options.eventComplete;
    }
    if (options.eventTick) {
        cbTick = typeof options.eventTick === 'string' ? window[options.eventTick] : options.eventTick;
    }

    // test if should loop / can be looped
    if (options.due && options.due.indexOf('reset')!==-1) {

        cbComplete = createLoopFunction(element,options,cbComplete);
        options.eventComplete = cbComplete;

    }

    // apply the layout options to the element
    setDataAttribute(element,options,'layout');
    setDataAttribute(element,options,'face');
    setDataAttribute(element,options,'visual');
    setDataAttribute(element,options,'format');

    // set scale
    if (options.scaleMax) {
        element.setAttribute('data-scale-max',options.scaleMax);
    }

    // set hide option
    if (options.scaleHide) {
        element.setAttribute('data-scale-hide',options.scaleHide);
    }

    // get format
    var format = (options.format || 'd,h,m,s').split(',');

    // define ticker rate
    var rate = format.indexOf('ms') === -1 ? 1000 : 24;

    // get labels
    var key;
    var labels = {};
    var defaults;
    var labelParts;
    for (key in defaultKeys) {
        if (!defaultKeys.hasOwnProperty(key)){continue;}
        defaults = defaultKeys[key];
        labelParts = (options['labels' + defaults.option] || defaults.labels).split(',');
        labels[key] = labelParts[0];
        labels[key + '_s'] = labelParts[1] || labelParts[0];
    }

    // get padding
    var hasPadding = typeof options.padding === 'undefined' ? true : options.padding;
    var padding = {};
    for (key in defaultKeys) {
        if (!defaultKeys.hasOwnProperty(key)){continue;}
        defaults = defaultKeys[key];

        // padding disabled
        if (!hasPadding) {
            padding[key] = '';
            continue;
        }

        // padding enabled, if left most value, remove padding, else, default padding
        padding[key] = getPaddingForFormat(key,format);
        if (padding[key]===null) {
            padding[key] = defaults.padding;
        }

        // override with padding options if set
        if (options['padding' + defaults.option]) {

            padding[key] = options['padding' + defaults.option]
        }

    }

    // get value
    var view = (options.face || 'text ').split(' ')[0];

    // set due date object
    var due = options.due ? getDueDate(options.due) : null;
    var since = options.since ? utils.isoToDate(options.since) : null;
    var now = options.now ? utils.isoToDate(options.now) : since ? null : new Date();

    // create the presenter
    var setup = {
        due:due,
        since:since,
        now:now,
        view:view,
        visual:options.visual || null,
        format:format,
        separator:options.separator || null,
        cascade:typeof options.cascade === 'undefined' ? true : utils.toBoolean(options.cascade),
        singular:options.singular,
        reflect:options.reflect || false,
        chars:typeof options.separateChars === 'undefined' ? true : utils.toBoolean(options.separateChars),
        label:labels,
        padding:padding,
        callback:{
            onComplete:cbComplete || function(){},
            onTick:cbTick || function(){}
        }
    };

    // if is a slow browser, force text
    if (utils.isSlow()) {
        setup.view = 'text';
        setup.reflect = false;
        setup.visual = null;
    }

    // holds ticker later on
    var ticker = null;

    // create the clock outline
    var outline = createClockOutline(setup,function(){

        // is called when clock runs out
        if (ticker) {
            ticker.stop();
        }

        // call onComplete method
        setup.callback.onComplete();

    });

    // set default values if missing
    setDefaultsForSoonElement(element);

    // create presenter
    var presenter = createPresenter(element,outline);

    // create the ticker
    ticker = createTicker(element,presenter,rate,options);

    // return
    return ticker;
};

// domready (c) Dustin Diaz 2012 - License MIT
// altered to stay in Soon scope
var domready;
!function(t){domready=t()}(function(e){function p(e){h=1;while(e=t.shift())e()}var t=[],n,r=!1,i=document,s=i.documentElement,o=s.doScroll,u="DOMContentLoaded",a="addEventListener",f="onreadystatechange",l="readyState",c=o?/^loaded|^c/:/^loaded|c/,h=c.test(i[l]);return i[a]&&i[a](u,n=function(){i.removeEventListener(u,n,r),p()},r),o&&i.attachEvent(f,n=function(){/^c/.test(i[l])&&(i.detachEvent(f,n),p())}),e=o?function(n){self!=top?h?n():t.push(n):function(){try{s.doScroll("left")}catch(t){return setTimeout(function(){e(n)},50)}n()}()}:function(e){h?e():t.push(e)}});

// if doc already loaded/complete than setup immediately, else wait for DOMContentLoaded
domready(function(){

    // if can listen to events, start listening to window resize for handling responsive behaviour
    resizer.init();

    // test if should block kickstart
    var script = document.querySelector('script[src*=soon]');
    if (script && script.getAttribute('data-auto')==='false') {
        return;
    }

    // find all soon elements
    var elements = document.getElementsByClassName ? document.getElementsByClassName('soon') : document.querySelectorAll('.soon');
    var i=0;
    var l=elements.length;

    for(;i<l;i++) {
        createByElement(elements[i]);
    }

});
// expose as jQuery plugin
(function(factory,$){

    // if no jquery, stop here
    if (!$) {return;}

    // setup plugin
    $.fn.soon = function(options) {
        options = options || {};
        return this.each(function() {
            factory.create(this,options);
        });
    };

    $.fn.soon.destroy = function() {
        return this.each(function() {
            factory.destroy(this);
        });
    };

    $.fn.soon.reset = function() {
        return this.each(function() {
            factory.reset(this);
        });
    };

    $.fn.soon.resize = function() {
        return this.each(function() {
            factory.resize(this);
        });
    };

    $.fn.soon.freeze = function() {
        return this.each(function() {
            factory.freeze(this);
        });
    };

    $.fn.soon.unfreeze = function() {
        return this.each(function() {
            factory.unfreeze(this);
        });
    };

    $.fn.soon.setOption = function(property,value) {
        return this.each(function() {
            factory.setOption(this,property,value);
        });
    };

}(exports,jQuery));

    // CommonJS
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports;
    }
    // AMD
    else if (typeof define === 'function' && define.amd) {
        define(function () {
            return exports;
        });
    }
    // Browser global
    else {
        win.Soon = exports;
    }

}(window,window['jQuery']));