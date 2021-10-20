// JavaScript Document

// jQuery
(function ($) {
  $(function () {

    let $body = $('body');

    loadContent($body);

  });
})(jQuery);


function loadContent ($request) {

  // Выброр страницы
  let params = getUrlParams(window.location.search);
  let page;
  if (!params.page) page = 'index';
  else page = params.page;


  // Поиск блоков для загрузки
  let $sections = $request.find('[data-load]');
  if (!$sections.length) $sections = $request.filter('[data-load]');

  // Перебрать блоки
  $sections.each(function () {
    let $this = $(this);
    let data = $this.data('load');


    // Выбор блоков для страницы
    let check = true;
    if (data.load !== undefined) {
      check = false;
      data.load.forEach(function (content) {
        if (content === page) {
          check = true;
        }
      });
    }


    // Загрузить блоки страницы
    if (check) {
      $.ajax({
        url: data.url,
        cache: false,
        async: false,
        success (request) {
          //console.log(request);
          let $request = $(request);
          $this.after($request);
          $this.remove();
          loadContent($request);
        }
      });
    }else {
      $this.remove();
    }
  });


}


function getUrlParams(search) {
  let hashes = search.slice(search.indexOf('?') + 1).split('&');
  return hashes.reduce((params, hash) => {
      let [key, val] = hash.split('=');
      return Object.assign(params, {[key]: decodeURIComponent(val)})
  }, {})
}
