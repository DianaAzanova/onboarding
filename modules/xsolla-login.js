$(document).ready(function () {
  var jwtToken;

  if (window.location.search) {
    jwtToken = getQueryParams(window.location.search).token;
  }

  if (jwtToken) {
    setCookie('xsolla_login_token', jwtToken);
    window.history.pushState('', '', document.location.pathname);
  } else {
    jwtToken = getCookie('xsolla_login_token');
  }

  initWidget(function () {
    if (jwtToken) {
      startUserAuthorizedProcess(jwtToken);
    } else {
      $('.user_name_logout').fadeIn();

      window.XSOLLA_INIT_SETUP.products.forEach(function (product) {
        initProduct(product);
      });

      $('.x_login_head_button').on('click', function () {
        $('.xsolla_login').fadeIn();
      });

      $('.xsolla_login').on('click', function () {
        $(this).fadeOut();
      });

      $('.xpay2play-widget-payment-button').on('click', function (e) {
        e.stopPropagation();
        setCookie('xsolla_last_click_id', $(this).attr('id'));
        $('.xsolla_login').fadeIn();
      });
    }
  });
});

/**
 * Инициализирует pay2play кнопки
 * @param product - { content: ' // SKU NAME IN PUBLISHER ', targetElements: [ массив id кнопок ] }
 * @param accessToken - опициональные параметр - токен Pay Station
 */
function initProduct(product, accessToken) {
  product.targetElements.forEach(function (targetElem) {
    var option = {
      template: "simple",
      lightbox: {
        height: "685px"
      },
      theme: {
        foreground: "gold",
        background: "dark"
      },
      target_element: targetElem
    };

    if (accessToken) {
      option.access_token = accessToken;
      var widget = XPay2PlayWidget.create(option);

      if (getCookie('xsolla_last_click_id') && '#' + getCookie('xsolla_last_click_id') === targetElem) {
        widget.open({});
        setCookie('xsolla_last_click_id', null);
      }
    } else {
      option.access_data = {
        settings: {
          ui: {
            theme: "dark"
          },
          project_id: window.XSOLLA_INIT_SETUP.projectId
        },
        purchase: {
          pin_codes: {
            codes: [{
              digital_content: product.content
            }]
          }
        }
      };

      XPay2PlayWidget.create(option);
    }
  });
}

/**
 * На основе jwtToken начинает flow авторизованного пользователя
 * @param jwtToken
 */
function startUserAuthorizedProcess(jwtToken) {
  $('.x_login_head_button').fadeOut(function () {
    $('.user_name_logout').text(parseJwt(jwtToken).username);
    $('.user_name_logout').show();
    $('#logout').show();
    $(this).fadeIn();
  });

  $('#logout').on('click', function () {
    eraseCookie('xsolla_login_token', null);
    eraseCookie('xsolla_last_click_id', null);
    location.reload();
  });

  window.XSOLLA_INIT_SETUP.products.forEach(function (product) {
    var ajaxSettings = {
      url: "https://store.xsolla.com/api/v1/xsolla_login/paystation/token",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtToken
      },
      async: true,
      processData: false,
      data: JSON.stringify({
        xsolla_login_user_id: parseJwt(jwtToken).sub,
        token_data: {
          user: {
            id: {
              value: parseJwt(jwtToken).username
            },
            email: {
              value: parseJwt(jwtToken).email,
              allow_modify: false
            }
          },
          purchase: {
            pin_codes: {
              codes: [{
                digital_content: product.content
              }]
            }
          },
          settings: {
            ui: {
              theme: "dark"
            },
            project_id: window.XSOLLA_INIT_SETUP.projectId
          }
        }
      })
    };

    $.ajax(ajaxSettings).done(function (response) {
      initProduct(product, response.token);
    });
  });
}

/**
 * Загрузка скриптов pay2play виджета
 * @param callback - выполняется после загрузки
 */
function initWidget(callback) {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.async = true;
  s.src = "https://static.xsolla.com/embed/pay2play/2.2.0/widget.min.js";
  s.addEventListener("load", callback, false);
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(s);
}

/**
 * @param token - jwtToken
 * @returns {any} - объект распарсенного объекта
 */
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

/**
 * Получение кук
 * @param cname - имя куки
 */
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Установка кук
 * @param cname - имя куки
 * @param cvalue - значение куки
 */
function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Удаление куки
 * @param cname
 */
function eraseCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
}

/**
 * Возвращает GET параметры от document.location.search
 * @param qs
 */
function getQueryParams(qs) {
  qs = qs.split('+').join(' ');

  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}
