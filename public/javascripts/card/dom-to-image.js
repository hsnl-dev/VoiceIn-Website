/*! dom-to-image 24-04-2016 */
!function (a) {
  'use strict';function b(a, b) {
    function c(a) {return b.bgcolor && (a.style.backgroundColor = b.bgcolor), b.width && (a.style.width = b.width + 'px'), b.height && (a.style.height = b.height + 'px'), b.style && Object.keys(b.style).forEach(function (c) {a.style[c] = b.style[c];}), a;}return b = b || {}, Promise.resolve(a).then(function (a) {return g(a, b.filter, !0);}).then(h).then(i).then(c).then(function (c) {return j(c, b.width || a.scrollWidth, b.height || a.scrollHeight);});
  }function c(a, b) {return f(a, b || {}).then(function (b) {return b.getContext('2d').getImageData(0, 0, a.scrollWidth, a.scrollHeight).data;});}function d(a, b) {return f(a, b || {}).then(function (a) {return a.toDataURL();});}function e(a, b) {return f(a, b || {}).then(o.canvasToBlob);}function f(a, c) {

    function d(a) {
      var b = document.createElement('canvas');return b.width = c.width || a.scrollWidth, b.height = c.height || a.scrollHeight, b;
    }return b(a, c).then(o.makeImage).then(o.delay(100)).then(function (b) {

      var c = d(a);return c.getContext('2d').drawImage(b, 0, 0), c;
    });
  }function g(a, b, c) {

    function d(a) {return a instanceof HTMLCanvasElement ? o.makeImage(a.toDataURL()) : a.cloneNode(!1);}function e(a, b, c) {

      function d(a, b, c) {
        var d = Promise.resolve();return b.forEach(function (b) {d = d.then(function () {return g(b, c);}).then(function (b) {b && a.appendChild(b);});}), d;
      }var e = a.childNodes;return 0 === e.length ? Promise.resolve(b) : d(b, o.asArray(e), c).then(function () {return b;});
    }function f(a, b) {

      function c() {
        function c(a, b) {
          function c(a, b) {o.asArray(a).forEach(function (c) {b.setProperty(c, a.getPropertyValue(c), a.getPropertyPriority(c))})}a.cssText ? b.cssText = a.cssText : c(a, b)
        }c(window.getComputedStyle(a), b.style)
      }function d() {

        function c(c) {
          function d(a, b, c) {
            function d(a) {
              var b = a.getPropertyValue("content");return a.cssText + " content: " + b + ";"
            }function e(a) {

              function b(b) {return b + ": " + a.getPropertyValue(b) + (a.getPropertyPriority(b) ? " !important" : "")}return o.asArray(a).map(b).join("; ") + ";"
            }var f = "." + a + ":" + b, g = c.cssText ? d(c) : e(c);return document.createTextNode(f + "{" + g + "}")
          }var e = window.getComputedStyle(a, c), f = e.getPropertyValue("content");if ("" !== f && "none" !== f) {

            var g = o.uid();b.className = b.className + " " + g;var h = document.createElement("style");h.appendChild(d(g, c, e)), b.appendChild(h)
          }
        }[":before", ":after"].forEach(function (a) {c(a)})
      }function e() {a instanceof HTMLTextAreaElement && (b.innerHTML = a.value), a instanceof HTMLInputElement && b.setAttribute("value", a.value)}function f() {b instanceof SVGElement && (b.setAttribute("xmlns", "http://www.w3.org/2000/svg"), b instanceof SVGRectElement && ["width", "height"].forEach(function (a) {

        var c = b.getAttribute(a);c && b.style.setProperty(a, c)
      }))}return b instanceof Element ? Promise.resolve().then(c).then(d).then(e).then(f).then(function () {return b}) : b
    }return c || !b || b(a) ? Promise.resolve(a).then(d).then(function (c) {return e(a, c, b)}).then(function (b) {return f(a, b)}) : Promise.resolve()
  }function h(a) {return q.resolveAll().then(function (b) {

    var c = document.createElement("style");return a.appendChild(c), c.appendChild(document.createTextNode(b)), a
  })}function i(a) {return r.inlineAll(a).then(function () {return a})}function j(a, b, c) {return Promise.resolve(a).then(function (a) {return a.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"), (new XMLSerializer).serializeToString(a)}).then(o.escapeXhtml).then(function (a) {return '<foreignObject x="0" y="0" width="100%" height="100%">' + a + "</foreignObject>"}).then(function (a) {return '<svg xmlns="http://www.w3.org/2000/svg" width="' + b + '" height="' + c + '">' + a + "</svg>"}).then(function (a) {return "data:image/svg+xml;charset=utf-8," + a})}function k() {

    function a() {
      var a = "application/font-woff", b = "image/jpeg";return { woff:a, woff2:a, ttf:"application/font-truetype", eot:"application/vnd.ms-fontobject", png:"image/png", jpg:b, jpeg:b, gif:"image/gif", tiff:"image/tiff", svg:"image/svg+xml" }
    }function b(a) {

      var b = /\.([^\.\/]*?)$/g.exec(a);return b ? b[1] : ""
    }function c(c) {

      var d = b(c).toLowerCase();return a()[d] || ""
    }function d(a) {return -1 !== a.search(/^(data:)/)}function e(a) {return new Promise(function (b) {

      for (var c = window.atob(a.toDataURL().split(",")[1]), d = c.length, e = new Uint8Array(d), f = 0; d > f; f++)e[f] = c.charCodeAt(f);b(new Blob([e], { type:"image/png" }))
    })}function f(a) {return a.toBlob ? new Promise(function (b) {a.toBlob(b)}) : e(a)}function g(a, b) {

      var c = document.implementation.createHTMLDocument(), d = c.createElement("base");c.head.appendChild(d);var e = c.createElement("a");return c.body.appendChild(e), d.href = b, e.href = a, e.href
    }function h() {

      var a = 0;return function () {
        function b() {return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)}return "u" + b() + a++
      }
    }function i(a) {return new Promise(function (b, c) {

      var d = new Image;d.onload = function () {b(d)}, d.onerror = c, d.src = a
    })}function j(a) {

      var b = 3e4;return new Promise(function (c) {
        function d() {if (4 === g.readyState) {
          if (200 !== g.status)return void f("cannot fetch resource: " + a + ", status: " + g.status);var b = new FileReader;b.onloadend = function () {
            var a = b.result.split(/,/)[1];c(a)
          }, b.readAsDataURL(g.response)
        }}function e() {f("timeout of " + b + "ms occured while fetching resource: " + a)}function f(a) {console.error(a), c("")}var g = new XMLHttpRequest;g.onreadystatechange = d, g.ontimeout = e, g.responseType = "blob", g.timeout = b, g.open("GET", a, !0), g.send()
      })
    }function k(a, b) {return "data:" + b + ";base64," + a}function l(a) {return a.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1")}function m(a) {return function (b) {return new Promise(function (c) {setTimeout(function () {c(b)}, a)})}}function n(a) {

      for (var b = [], c = a.length, d = 0; c > d; d++)b.push(a[d]);return b
    }function o(a) {return a.replace(/#/g, "%23").replace(/\n/g, "%0A")}return { escape:l, parseExtension:b, mimeType:c, dataAsUrl:k, isDataUrl:d, canvasToBlob:f, resolveUrl:g, getAndEncode:j, uid:h(), delay:m, asArray:n, escapeXhtml:o, makeImage:i }
  }function l() {

    function a(a) {return -1 !== a.search(e)}function b(a) {

      for (var b, c = []; null !== (b = e.exec(a));)c.push(b[1]);return c.filter(function (a) {return !o.isDataUrl(a)})
    }function c(a, b, c, d) {

      function e(a) {return new RegExp("(url\\(['\"]?)(" + o.escape(a) + ")(['\"]?\\))", "g")}return Promise.resolve(b).then(function (a) {return c ? o.resolveUrl(a, c) : a}).then(d || o.getAndEncode).then(function (a) {return o.dataAsUrl(a, o.mimeType(b))}).then(function (c) {return a.replace(e(b), "$1" + c + "$3")})
    }function d(d, e, f) {

      function g() {return !a(d)}return g() ? Promise.resolve(d) : Promise.resolve(d).then(b).then(function (a) {

        var b = Promise.resolve(d);return a.forEach(function (a) {b = b.then(function (b) {return c(b, a, e, f)})}), b
      })
    }var e = /url\(['"]?([^'"]+?)['"]?\)/g;return { inlineAll:d, shouldProcess:a, impl:{ readUrls:b, inline:c } }
  }function m() {

    function a() {return b(document).then(function (a) {return Promise.all(a.map(function (a) {return a.resolve()}))}).then(function (a) {return a.join("\n")})}function b() {

      function a(a) {return a.filter(function (a) {return a.type === CSSRule.FONT_FACE_RULE}).filter(function (a) {return p.shouldProcess(a.style.getPropertyValue("src"))})}function b(a) {

        var b = [];return a.forEach(function (a) {try {o.asArray(a.cssRules || []).forEach(b.push.bind(b))}catch (c) {console.log("Error while reading CSS rules from " + a.href, c.toString())}}), b
      }function c(a) {return { resolve:function () {

        var b = (a.parentStyleSheet || {}).href;return p.inlineAll(a.cssText, b)
      }, src:function () {return a.style.getPropertyValue("src")}, }}return Promise.resolve(o.asArray(document.styleSheets)).then(b).then(a).then(function (a) {return a.map(c)})
    }return { resolveAll:a, impl:{ readAll:b } }
  }function n() {

    function a(a) {
      function b(b) {return o.isDataUrl(a.src) ? Promise.resolve() : Promise.resolve(a.src).then(b || o.getAndEncode).then(function (b) {return o.dataAsUrl(b, o.mimeType(a.src))}).then(function (b) {return new Promise(function (c, d) {a.onload = c, a.onerror = d, a.src = b})})}return { inline:b }
    }function b(c) {

      function d(a) {
        var b = a.style.getPropertyValue("background");return b ? p.inlineAll(b).then(function (b) {a.style.setProperty("background", b, a.style.getPropertyPriority("background"))}).then(function () {return a}) : Promise.resolve(a)
      }return c instanceof Element ? d(c).then(function () {return c instanceof HTMLImageElement ? a(c).inline() : Promise.all(o.asArray(c.childNodes).map(function (a) {return b(a)}))}) : Promise.resolve(c)
    }return { inlineAll:b, impl:{ newImage:a } }
  }var o = k(), p = l(), q = m(), r = n(), s = { toSvg:b, toPng:d, toBlob:e, toPixelData:c, impl:{ fontFaces:q, images:r, util:o, inliner:p } };"undefined" != typeof module ? module.exports = s : a.domtoimage = s
}(this);
