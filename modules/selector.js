(function selector() {
  function Pack(initialValue) {
    this.edition = initialValue.edition || '';
    this.country = initialValue.country || 'Argentina';
    this.platform = initialValue.platform || 'PS4';
    this.retailer = initialValue.retailer || 'SIEE';
    this.version = initialValue.version || '';
    this.packElement = initialValue.packElement || null;
    this.dataArray = initialValue.dataArray || [];

    this.initialFillCountrySelector();
    this.setOnChangeEditonHandler();
    this.setOnChangeCountryHandler();
    this.setOnChangePlatformHandler();
    this.updatePack();
  }

  Pack.prototype.filterDataArrayByField = function (dataArray, field, target) {
    //  хелпер для фильтрации массива по указанному полю
    const dataArrayByField = $.grep(dataArray, function (element) {
      return element[field] === target;
    });
    return dataArrayByField;
  };

  Pack.prototype.uniqDataArrayByField = function (dataArray, field) {
    // хелпер для фильтрации массива с уникальными датами в отсортированном массиве
    let previous = '';
    const uniqDataArray = $.grep(dataArray, function (element) {
      const isUniq = element[field] !== previous;
      previous = element[field];
      return isUniq;
    });
    return uniqDataArray;
  };

  Pack.prototype.findCurrentDataItemRecursive = function (nextDataArray, enumIndex) {
    // хелпер для поиска единственного объекта по значению текущих полей класса
    const MAP_INDEX_TO_FIELDS = ['country', 'platform', 'retailer', 'version'];

    nextDataArray = nextDataArray || this.dataArray;
    enumIndex = enumIndex || 0;

    if (nextDataArray.length <= 1 || enumIndex > 3) {
      return nextDataArray[0];
    }

    const newDataArray = this.filterDataArrayByField(nextDataArray, [MAP_INDEX_TO_FIELDS[enumIndex]], this[MAP_INDEX_TO_FIELDS[enumIndex]]);
    return this.findCurrentDataItemRecursive(newDataArray, ++enumIndex);
  };

  Pack.prototype.initialFillCountrySelector = function () {
    const countrySelectorBody = this.packElement.find('.x_selector .x_selector_pop.x_country_pop')[0];
    const uniqDataArray = this.uniqDataArrayByField(this.dataArray, 'country');

    let selectorOptions = '';
    uniqDataArray.forEach(function (element) {
      selectorOptions += '<div class="x_dropdown_li">' + element.country + '</div>';
    });
    // countrySelectorBody.innerHTML = selectorOptions;
  };

  Pack.prototype.setOnChangeEditonHandler = function () {
    function resetAllButtons(editonButtonArray) {
      editonButtonArray.forEach(function (element) {
        element.removeClass('gold active');
      });
    }

    const physicalEditon = this.packElement.find('#game_psysical');
    const digitalEditon = this.packElement.find('#game_digital');
    const editonButtonArray = [physicalEditon, digitalEditon];

    const self = this;
    editonButtonArray.forEach(function (element) {
      element.click(function () {
        resetAllButtons(editonButtonArray);
        $(this).closest('.x_menu_li').addClass('gold active');

        if (self.edition) {
          self.edition = $(this).text().trim();
          self.updatePack();
        }
      });
    });
  };

  Pack.prototype.setOnChangeCountryHandler = function () {
    const selectorArray = this.packElement.find('.x_dropdown_li');

    const self = this;
    selectorArray.each(function (index, element) {
      $(element).click(function () {
        const selectedCountry = $(this).text().trim();
        self.packElement.find('.x_country_title div').text(selectedCountry)

        self.country = selectedCountry;
        self.updatePack();
      });
    });
  };

  Pack.prototype.setOnChangePlatformHandler = function () {
    const MAP_INDEX_TO_RETAILES = ['SIEE', 'Microsoft', 'Epic Games Store Key'];

    function resetAllButtons(platformButtonArray) {
      platformButtonArray.forEach(function (element) {
        element.removeClass('gold active');
      });
    }

    const ps4Platform = this.packElement.find('#platform_ps4');
    const xboxonePlatform = this.packElement.find('#platform_xboxone');
    const pcPlatform = this.packElement.find('#platform_pc');
    const platformButtonArray = [ps4Platform, xboxonePlatform, pcPlatform];

    const self = this;
    platformButtonArray.forEach(function (element, index) {
      element.click(function (event) {
        resetAllButtons(platformButtonArray);
        $(event.target).closest('.x_menu_li').addClass('gold active');

        self.platform = $(this).text().trim();
        self.retailer = MAP_INDEX_TO_RETAILES[index];
        self.updatePack();
      });
    });
  };

  Pack.prototype.updatePlatform = function () {
    console.log('asd');

    const NOT_ACTIVE_CLASS = 'hide';

    function hideAllButtons(platformButtonArray) {
      platformButtonArray.forEach(function (element) {
        element.addClass(NOT_ACTIVE_CLASS);
      });
    }

    function showAvailablePlatformButton(dataArrayFromCountry, platformButtonArray, platform) {
      const arrayOfActivePlatform = [];
      dataArrayFromCountry.forEach(function (element) {
        element.platform === 'PS4' && platformButtonArray[0].removeClass(NOT_ACTIVE_CLASS);
        element.platform === 'Xbox One' && platformButtonArray[1].removeClass(NOT_ACTIVE_CLASS);
        element.platform === 'PC' && platformButtonArray[2].removeClass(NOT_ACTIVE_CLASS);
        arrayOfActivePlatform.push(element.platform)
      });

      // переключение на существующую платформу если выбранная отсутствует
      if (arrayOfActivePlatform.indexOf(platform) === -1) {
        platformButtonArray.forEach(function (element) {
          element.not('.' + NOT_ACTIVE_CLASS).trigger('click');
        });
      }
    }

    const ps4Platform = this.packElement.find('#platform_ps4');
    const xboxonePlatform = this.packElement.find('#platform_xboxone');
    const pcPlatform = this.packElement.find('#platform_pc');
    const platformButtonArray = [ps4Platform, xboxonePlatform, pcPlatform];
    hideAllButtons(platformButtonArray);

    const dataArrayFromCountry = this.filterDataArrayByField(this.dataArray, 'country', this.country);
    showAvailablePlatformButton(dataArrayFromCountry, platformButtonArray, this.platform);
  }

  Pack.prototype.updateButton = function () {
    function showXsollaButton(xsollaButton, otherButton) {
      $(xsollaButton).removeClass('hide');
      $(otherButton).addClass('hide');
    }

    function showOtherButton(xsollaButton, otherButton, link) {
      $(xsollaButton).addClass('hide');
      $(otherButton).removeClass('hide');
      $(otherButton).attr('href', link);
    }

    const xsollaButton = this.packElement.find('#XS-pay2play-widget-1');
    const otherButton = this.packElement.find('#buy');

    if (this.edition === 'physical') {
      return showXsollaButton(xsollaButton, otherButton);
    }

    const currentDataItem = this.findCurrentDataItemRecursive();
    // console.log(currentDataItem);
    return showOtherButton(xsollaButton, otherButton, currentDataItem.url);
  }

  Pack.prototype.updateBottomLabel = function () {
    const MAP_INDEX_TO_FIELD = [
      'edition', 'country', 'platform', 'retailer'
    ];

    const editionLabel = this.packElement.find('#edition_label');
    const countryLabel = this.packElement.find('#country_label');
    const platformLabel = this.packElement.find('#platform_label');
    const retailerLabel = this.packElement.find('#retailer_label');

    const self = this;
    [editionLabel, countryLabel, platformLabel, retailerLabel].forEach(function (element, index) {
      if (!element) {
        return;
      }

      // physical => physical edition
      if (MAP_INDEX_TO_FIELD[index] === 'edition') {
        return $(element).find('div').text(self[MAP_INDEX_TO_FIELD[index]] + ' edition');
      }

      // скрытие нижних лейблов кроме physical edition
      if (self.edition === 'physical' && MAP_INDEX_TO_FIELD[index] !== 'edition') {
        $(element).css('display', 'none');
      } else {
        $(element).css('display', 'flex');
      }
      
      $(element).find('div').text(self[MAP_INDEX_TO_FIELD[index]]);
    });
  };

  Pack.prototype.updatePack = function () {
    this.updatePlatform();
    this.updateButton();
    this.updateBottomLabel();
  }

  function divideDataForPack(data) {
    function sortByCountry(a, b) {
      return a.country > b.country ? 1 : -1;
    }

    const standardPackData = $.grep(data, function (element) {
      return element.version === 'Standard';
    });
    const deluxePackData = $.grep(data, function (element, index) {
      return element.version === 'Deluxe';
    });

    return {
      standardData: standardPackData.sort(sortByCountry),
      deluxeData: deluxePackData.sort(sortByCountry)
    }
  }

  //https://codebeautify.org/excel-to-json
  //last: WRC8_DigitalShops (3).xlsx 
  $.getJSON("data/retailers.json", function (data) {
    const dividedData = divideDataForPack(data);

    const standartPack = new Pack({
      edition: 'physical',
      version: 'Standard',
      packElement: $('[data-id=standard]'),
      dataArray: dividedData.standardData
    })

    const deluxePack = new Pack({
      version: 'Deluxe',
      packElement: $('[data-id=magnus]'),
      dataArray: dividedData.deluxeData
    })
  });
})();
