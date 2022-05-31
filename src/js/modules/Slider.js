export default class Slider {
  constructor() {
    this.options = {
      el: '.js--slider:not(.js--slider-active)',
    };
    this.$el = $(this.options.el);

    return this;
  }

  init() {
    this.$el.addClass('js--slider-active').each((index, element) => {
      const $slider = $(element);
      const sliderData = $slider.data('slider') || {};

      $slider.slick(sliderData);

      $('body').on('click', '[data-slick-to-go]', (event) => {
        const slide = $(event.currentTarget).data('slick-to-go');
        $slider.slick('slickGoTo', slide);
      });
    });
  }

  render() {
    if (this.$el.length) {
      this
        .init();
    }
    return this;
  }
}
