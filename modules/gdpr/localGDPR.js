var analytics = function () {
  const MERCHANT_ID = 0;
  const GTM_ID = 'GTM-XXXXXX';

  // Google Tag Manager
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
      'gtm.start':
        new Date().getTime(), event: 'gtm.js'
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src =
      'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', GTM_ID);

  // Xsolla Analytics
  var serviceXAScript = document.createElement("script");
  serviceXAScript.type = "text/javascript";
  serviceXAScript.async = true;
  serviceXAScript.src = "https://cdn.xsolla.net/sitebuilder/service-analytics-v2.min.js";
  serviceXAScript.addEventListener("load", function (e) {
    initXA({id: window.XSOLLA_INIT_SETUP.counterId, merchantId: MERCHANT_ID});
  });
  document.getElementsByTagName("body")[0].appendChild(serviceXAScript);
};

GDPR.State.onChangeIsAllowedDataCollection(function (isAllowedDataCollection) {
  if (isAllowedDataCollection) {
    analytics();
  }
});

GDPR.initialize({
  state: {
    productName: 'landing_standard'
  }
}, function (err, form) {
  if (err || !form) {
    return;
  }

  form.onAgreeButtonClick(function () {
    analytics();
  });
});
