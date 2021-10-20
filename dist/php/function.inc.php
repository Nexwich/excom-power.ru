<?php

require __DIR__ . '/functions/field_locale.php';
require __DIR__ . '/functions/get_structure.php';
require __DIR__ . '/functions/image_resize.php';
require __DIR__ . '/functions/cm_browse_path_range.php';

function format_date ($date, $locale = 'ru') {


  if ($locale == 'ru') {
    $month = array(
      1 => 'Январь', 2 => 'Февраль', 3 => 'Март', 4 => 'Апрель',
      5 => 'Май', 6 => 'Июнь', 7 => 'Июль', 8 => 'Август',
      9 => 'Сентябрь', 10 => 'Октябрь', 11 => 'Ноябрь', 12 => 'Декабрь'
    );
  }else {
    $month = array(
      1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April',
      5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August',
      9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'
    );
  }

  $time = strtotime($date);

  $response = $month[(int) date('m', $time)] . " " . date('d', $time);

  return $response;

}

/*
function build_nav ($sub_id){
  $nav = nc_nav::get_instance();

  $subdivisions = $nav->get_sub($sub_id);
  ?>
  <? if ($subdivisions){ ?>
    <ul>
      <? foreach ($subdivisions as $subdivision){ ?>
        <li <? if ($subdivision->active){ ?> class='active'<? } ?>>
          <a href="<?= $subdivision->url ?>"><?= $subdivision->name ?></a>
          <? build_nav($sub_id) ?>
        </li>
      <? } ?>
    </ul>
  <? } ?>
  <?
}
*/


/* Получить список типов владений */
function get_property_types ($sub) {
  $nc_core = nc_Core::get_object();

  $cc = $nc_core->db->get_var("SELECT `Sub_Class_ID` FROM `Sub_Class` WHERE `Checked` = 1 AND `Class_ID` = 135 AND `Subdivision_ID` = " . $sub . " LIMIT 1");
  $types_items = $nc_core->db->get_results("SELECT `Types` FROM `Message135` WHERE `Checked` = 1 AND `Sub_Class_ID` = " . $cc . " AND `Types` != ''", ARRAY_A);

  $types = array();
  foreach ($types_items as $types_item) {
    $types_array = explode(",", $types_item['Types']);
    foreach ($types_array as $type) {
      $type = trim($type);
      $types[$type] = $type;
    }
  }
  asort(array_unique($types));


  return $types;
}


/* Получить список владений */
function get_properties ($sub, $type) {
  $nc_core = nc_Core::get_object();

  $cc = $nc_core->db->get_var("SELECT Sub_Class_ID FROM `Sub_Class` WHERE `Checked` = 1 AND `Class_ID` = 135 AND `Subdivision_ID` = " . $sub . " LIMIT 1");
  $properties = $nc_core->db->get_results("SELECT `Message_ID`, `Name` FROM `Message135` WHERE `Checked` = 1 AND `Sub_Class_ID` = " . $cc . " AND (`Types` = '" . $type . "' OR `Types` LIKE '" . $type . ",%' OR `Types` LIKE '%," . $type . ",%' OR `Types` LIKE '%," . $type . "')", ARRAY_A);

  return $properties;
}


/* Проверить группу пользователя */
function is_user_group ($user_id, $group_id) {
  $user_groups = nc_usergroup_get_group_by_user($user_id);

  $is = false;
  if (array_search($group_id, $user_groups) !== false) $is = true;

  return $is;
}
