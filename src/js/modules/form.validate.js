import Action from './Action';

export default function formValidate () {
  $('form.js--validation:not(.active)').each(function (index, element) {
    let array = {warnText: null, response: null};
    let $this = $(element);
    let settings = [];
    let data = $this.data('submit');
    let dataFail = $this.data('submit-fail');
    let dataSuccess = $this.data('submit-success');

    array = $this.data('array') || array;

    if ($this.data('settings')) settings = $this.data('settings');

    // Форма заполеная не верно
    settings.invalidHandler = function () {
      $this.ajaxSubmit({
        data: {isNaked: 1},
        beforeSubmit: function (arr, $form, options) {
          new Action(data);
        },
        success: function (response, status, xhr, Form) {
          let warnText = $(response).filter('.warnText');
          let all = $(response);

          actions(data);

          // Отобразить ответ
          if (warnText.length && warnText.length !== false) {
            if (array.warnText != null) $(array.warnText).html(warnText);
            else $(Form).find('.warnText').html(warnText);
          }else {
            if (array.warnText != null) $(array.warnText).html(all);
            else $(Form).find('.warnText').html(all);
          }

          new Action(dataFail);
        },
      });
    };

    // Форма заполнена верно
    settings.submitHandler = function (form) {
      let $this_form = $(form);
      let $submit = $this_form.find('[type=submit]');
      let $submit_text;

      // Заблокировать кнопку
      if ($submit) {
        $submit_text = $submit.find('.text');
        $submit.attr({'disabled': 'disabled', 'title': $submit.html()}).html('Отправка…');
        if ($submit_text) $submit_text.text('Отправка…');
        else $submit.text('Отправка…');
      }

      if (array.ajax !== false) {
        $(form).ajaxSubmit({
          data: {isNaked: 1},
          beforeSubmit: function () {
            new Action(data);
          },
          success: function (response) {
            response = $(response.replace(/^deleted/,''));
            console.log(response);
            let resp = (response.filter('.response').length ? response.filter('.response') : response.find('.response'));
            console.log(resp);
            let warnText = (response.filter('#nc_modal_status').length ? response.filter('#nc_modal_status') : response.find('#nc_modal_status'));
            let all = response;

            // Отобразить ответ
            if (warnText.length) {
              if (warnText.length && warnText.length !== false) {
                if (array.warnText != null) $(array.warnText).html(warnText);
                else $this_form.find('.warnText').html(warnText);
              }else {
                if (array.warnText != null) $(array.warnText).html(all);
                else $this_form.find('.warnText').html(all);
              }
            }else {
              if (resp.length && resp.length !== false) {
                if (array.response) $(array.response).html(resp);
                else $this_form.closest('div').html(resp);
              }else {
                if (array.response) $(array.response).html(all);
                else $this_form.closest('div').html(all);
              }
            }

            // Разблокировать кнопку
            if ($submit) {
              let title = $submit.data('title') ? $submit.data('title') : $submit.attr('title');
              $submit.removeAttr('disabled').html(title);
              if ($submit_text) $submit_text.html(title);
              else $submit.html($submit.attr('title'));
            }

            // Изменить адсресную строку
            if (array.history) history.pushState(null, null, $(form).attr('action') + '?' + $(form).formSerialize());

            new Action(dataSuccess);
            formValidate();
          },
        });
      }
    };

    $this.addClass('active').validate(settings);
  });
}
