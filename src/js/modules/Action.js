import formValidation from './form.validate';

export default class Action {
  constructor(data, element, serialize) {
    for (const selector in data) {
      if (data.hasOwnProperty(selector)) {
        this.$selector = $(selector);
        if (selector === 'this') this.$selector = $(element);

        const { $selector } = this;

        if (data[selector].class) $selector.toggleClass(data[selector].class);
        if (data[selector].removeClass) $selector.removeClass(data[selector].removeClass);
        if (data[selector].addClass) $selector.addClass(data[selector].addClass);
        if (data[selector].click === true) $selector.click();
        if (data[selector].text) $selector.text(data[selector].text);
        if (data[selector].remove) $selector.remove();
        if (data[selector].removeAttr) $selector.removeAttr(data[selector].removeAttr);
        if (data[selector].attr) $selector.attr(data[selector].attr);
        if (data[selector].siblings) {
          if (data[selector].siblings.class) $selector.toggleClass(data[selector].siblings.class).siblings().toggleClass(data[selector].siblings.class);
          if (data[selector].siblings.addClass) $selector.addClass(data[selector].siblings.addClass).siblings().removeClass(data[selector].siblings.addClass);
          if (data[selector].siblings.removeClass) $selector.removeClass(data[selector].siblings.removeClass).siblings().addClass(data[selector].siblings.removeClass);
        }
        if (data[selector].toggle) this.actionsToogle(data[selector].toggle);
        if (data[selector].scroll) this.actionsScroll(data[selector].scroll);
        if (data[selector].xhr) this.actionsXhr(data[selector].xhr, element, serialize);
        if (data[selector].ajax) this.actionsAjax(data[selector].ajax, element, serialize);
      }
    }
  }

  actionsToogle(toggle) {
    switch (toggle) {
      case 'slide':
        this.$selector.slideToggle('fast');
        break;
      case 'slideUp':
        this.$selector.slideUp('fast');
        break;
      case 'slideDown':
        this.$selector.slideDown('fast');
        break;
      case 'fade':
        this.$selector.fadeToggle('fast');
        break;
      case 'fadeIn':
        this.$selector.fadeIn('fast');
        break;
      case 'fadeOut':
        this.$selector.fadeOut('fast');
        break;
    }
  }

  actionsScroll(top = 0) {
    const offset = this.$selector.offset().top + top;
    $('html, body').animate({ scrollTop: offset }, 'fast');
  }

  actionsAjax(ajax, element, serialize) {
    let url;
    url = (ajax.url ? ajax.url : $(element).attr('href'));
    if (serialize) url = `${url}?${serialize}`;

    $.ajax({
      url,
      cache: false,
      type: (ajax.type ? ajax.type : 'GET'),
      data: ajax.data ? ajax.data : { isNaked: 1 },
      success(response) {
        if (ajax.response) response = $(response).find(ajax.response);

        if (ajax.selector === 'this') this.$selector.html(response);
        else if ($(ajax.selector).length) $(ajax.selector).html(response);

        // Изменить адсресную строку
        if (ajax.history) history.pushState(null, null, url);

        formValidation();
      },
    });
  }

  actionsXhr(ajax, element, serialize) {
    const xhr = new XMLHttpRequest();
    let url;

    url = (ajax.url ? ajax.url : $(element).attr('href'));
    if (serialize) url = `${url}?${serialize}`;
    const type = (ajax.type ? ajax.type : 'GET');

    xhr.open(type, url, true);
    xhr.onreadystatechange = function a() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText.trim().length) {
            // let response = $(xhr.responseText);
          }
        }
      }
    };
  }
}
