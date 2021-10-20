export default class Tabs {
  constructor (obj = {}) {

    const defaults = {
      el: 'tab--link',

      success: {
        addClass:'',
        removeClass:'hide',
      },
      fail: {
        addClass:'hide',
        removeClass:'',
      },

      dom: {
        tab: 'tab--content'
      }
    };

    this.option = defaults;
    this.$el = $('[data-' + defaults.el + ']');
    this.$body = $('body');

    if (!obj) obj = {};
    if (obj.hasOwnProperty('onAfter')) {
      this.onAfter = obj.onAfter;
    }

    return this;
  }

  init () {
    let _this = this;

    this.$body.on('click', '[data-' + this.option.el + ']', function () {

      let $this = $(this);
      let dataLink = $this.data(_this.option.el);
      let elements = [];

      $('[data-' + _this.option.dom.tab + ']').each(function (index, element) {
        let $element = $(element);
        let dataContent = $element.data(_this.option.dom.tab);

        dataContent.forEach(function (content) {
          dataLink.forEach(function (link) {
            if (content === link) {
              elements.push($element);
            }
          });
        });
      });

      // Скрываем сестренские контейнеры
      elements.forEach(function ($element) {
        $element.siblings('[data-' + _this.option.dom.tab + ']').addClass(_this.option.fail.addClass).removeClass(_this.option.fail.removeClass)
          .find('input').attr('disabled', 'disabled').prop('disabled', true);
      });

      // Отображаем подходящие контейнеры
      elements.forEach(function ($element) {
        $element.addClass(_this.option.success.addClass).removeClass(_this.option.success.removeClass)
          .find('input').removeAttr('disabled').prop('disabled', false);
      });

      _this.after();

      if ($(this).is('a')) return false;
    });

  }

  after() {
    this.onAfter();
  }

  render () {
    if (this.$el.length) {
      this
        .init();
    }
    return this;
  }
}
