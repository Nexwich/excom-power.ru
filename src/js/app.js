import formValidate from './modules/form.validate';
import Action from './modules/Action';
import Waves from './modules/Waves';
import Slider from './modules/Slider';

$(() => new Waves().render());
$(() => new Slider().render());

function queryItems(url) {
  console.log(url);
  window.location.href = url;
}

const $body = $('body');
const $window = $(window);

// Клик
$body.on('click', '[data-click]', function a(event) {
  event.preventDefault();

  const data = $(this).data('click');

  new Action(data, this);
});

// Открыть модальное окно
$body.on('click', '.js--modal--action', function a(event) {
  event.preventDefault();

  const $modal = $('#modal-ajax');
  const isActive = $modal.hasClass('active');
  let data = {};

  if (isActive) {
    data = {
      '#modal-ajax .fade': { addClass: 'animated fadeOut' },
      '#modal-ajax .content': { addClass: 'animated zoomOutDown' },
    };
    new Action(data, this);

    setTimeout(function b() {
      data = {
        '#modal-ajax': { removeClass: 'active' },
        '#modal-ajax .fade': { removeClass: 'animated fadeOut' },
        '#modal-ajax .content': { removeClass: 'animated zoomOutDown' },
      };
      new Action(data, this);
    }, 1000);
  } else {
    data = {
      '#modal-ajax': { ajax: { selector: '#modal-ajax .ajax' }, addClass: 'active' },
      '#modal-ajax .fade': { addClass: 'animated fadeIn' },
      '#modal-ajax .content': { addClass: 'animated zoomInDown' },
    };
    new Action(data, this);

    setTimeout(function c() {
      data = {
        '#modal-ajax .fade': { removeClass: 'animated fadeIn' },
        '#modal-ajax .content': { removeClass: 'animated zoomInDown' },
      };
      new Action(data, this);
    }, 1000);
  }
});

// Открыть навигацию
$body.on('click', '.js--nav--action', function a(event) {
  event.preventDefault();

  const $nav = $('nav');
  const isActive = $nav.hasClass('active');
  let data = {};

  if (isActive) {
    data = {
      nav: { addClass: 'animated fadeOutLeft faster' },
    };
    new Action(data, this);

    setTimeout(function b() {
      data = {
        nav: { removeClass: 'active animated fadeOutLeft faster' },
      };
      new Action(data, this);
    }, 1000);
  } else {
    data = {
      nav: { addClass: 'active animated fadeInLeft faster' },
    };
    new Action(data, this);

    setTimeout(function c() {
      data = {
        nav: { removeClass: 'animated fadeInLeft faster' },
      };
      new Action(data, this);
    }, 1000);
  }
});

const $fix = $('.js--fix');
if ($fix.length) {
  $fix.each(function a() {
    const $this = $(this);

    $this.data({ offsetTop: $this.offset().top });
  });

  $window.on('scroll', () => {
    const scrollTop = $window.scrollTop();

    $fix.each(function a() {
      const $this = $(this);
      const offset = $this.data('offsetTop');

      if (scrollTop > offset) $this.addClass('fixed');
      else $this.removeClass('fixed');
    });
  });
}

if ($('.js--viewports').length) {
  $window.on('scroll load', () => {
    const height = $window.height();
    const top = $window.scrollTop();
    const center = top + height / 2;

    $('.js--viewports [data-viewport]').each((index, element) => {
      const $this = $(element);
      const { top } = $this.offset();
      const bottom = $this.height() + top;
      const viewport = $this.data('viewport');

      if (center >= top && center < bottom) {
        $(`[data-viewport-link=${viewport}]`).addClass('active').siblings().removeClass('active');
      }
    });
  });
}

$body.on('change', '.js--redirect', function a() {
  const $this = $(this);

  queryItems($this.val());
});

$body.on('click', '.js--redirect-link', function a(event) {
  event.preventDefault();

  const $this = $(this);
  $this.addClass('active').siblings().removeClass('active');
  let url = $this.attr('href');
  if (!url) url = $this.find('a').attr('href');

  queryItems(url);
});

formValidate();
