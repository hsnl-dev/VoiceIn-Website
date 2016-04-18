/**
return true is webView, false not webView.
**/
function isWebView(_window) {
  // window
  let isStandalone = _window.navigator.standalone;
  let userAgent = _window.navigator.userAgent.toLowerCase();
  let isSafari = /safari/.test(userAgent);
  let isIos = /iphone|ipod|ipad/.test(userAgent);

  return !isStandalone && !isSafari && isIos;
}

module.exports = exports = isWebView;
