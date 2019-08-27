const clearPriceInterval = intervalId => {
  clearInterval(intervalId);
};

const generatePrices = () => {
  window.XSOLLA_INIT_SETUP.products.map((info, index) => {
    const sku = info.targetElements[0];
    const priceInterval = setInterval(() => {
      const price = $(`${sku} .formatted-currency`).html();
      if (price) {
        clearPriceInterval(priceInterval);
        $(`.pack-price_amouth.price_${index + 1}`).html(price);
        $('.pack-price .preloader').addClass('hide');
        $('.pack-price_from').removeClass('hide');
      }
    });
  })
};