<?php

function cm_browse_path_range ($from, $to, $browse_template, $reverse = 0, $show = 0) {
  global $REQUEST_URI, $f_title;
  global $admin_mode, $admin_url_prefix;
  global $current_catalogue, $current_sub, $current_cc, $cc_array;
  global $parent_sub_tree, $sub_level_count;
  global $titleTemplate, $action, $message, $classID;
  global $user_table_mode, $db, $SUB_FOLDER, $_db_cc, $nc_core;

  $routing_module_enabled = nc_module_check_by_keyword('routing');

  $current_page_path = urldecode(strtok($REQUEST_URI, '?'));

  //FIXME удалить если для полного отображения по ключевому слову будет определен $current_cc не по источнику зеркала
  if ($action == 'full' && $_db_cc != $current_cc['Sub_Class_ID']) {
    $current_cc_old = $current_cc;
    $current_cc = $nc_core->sub_class->get_by_id($_db_cc);
  }

  if ($to > $sub_level_count) {
    $to = $sub_level_count;
  }

  if ($from < -1) {
    $from = -1;
  }

  $result = $browse_template['prefix'];

  $result_array_name = array();
  $result_array_url = array();

  if ($show == 0 && $current_catalogue['Title_Sub_ID'] == $current_sub['Subdivision_ID']) {
    $from++;
  }

  for ($i = $to; $i > $from; $i--) {
    $result_array_name[] = $parent_sub_tree[$i]["Title".ucfirst($_SESSION['locale'])] ? $parent_sub_tree[$i]["Title".ucfirst($_SESSION['locale'])] : $parent_sub_tree[$i]['Subdivision_Name'];
    if ($admin_mode) {
      $result_array_url[] = $admin_url_prefix . "?catalogue=" . $parent_sub_tree[$i]['Catalogue_ID']
        . ($parent_sub_tree[$i]["Subdivision_ID"] ? "&amp;sub=" . $parent_sub_tree[$i]["Subdivision_ID"] : "");
    }else {
      if (isset($parent_sub_tree[$i]["ExternalURL"]) && ($ext_url = $parent_sub_tree[$i]["ExternalURL"])) {
        $result_array_url[] = (strchr($ext_url, ":") || substr($ext_url, 0, 1) == "/")
          ? $ext_url
          : $SUB_FOLDER . $parent_sub_tree[$i]['Hidden_URL'] . $ext_url;
      }else if ($routing_module_enabled && isset($parent_sub_tree[$i]['Subdivision_ID'])) {
        $result_array_url[] = (string) nc_routing::get_folder_path($parent_sub_tree[$i]['Subdivision_ID']);
      }else {
        $result_array_url[] = $SUB_FOLDER . $parent_sub_tree[$i]['Hidden_URL'];
      }
    }
  }

  switch ($show) {
    case 0:
      if ($current_cc['Sub_Class_ID'] != $cc_array[0] && $current_cc['Checked']) {
        $result_array_name[] = $current_cc['Sub_Class_Name'];
        if (isset($current_cc["ExternalURL"]) && ($ext_url = $current_cc["ExternalURL"])) {
          $result_array_url[] = ((strchr($ext_url, ":") || substr($ext_url, 0, 1) == "/")
              ? $ext_url
              : $SUB_FOLDER . $current_cc[$i]['Hidden_URL'] . $ext_url) . ".html";
        }else if ($routing_module_enabled) {
          $result_array_url[] = (string) nc_routing::get_infoblock_path($current_cc['Sub_Class_ID']);
        }else {
          $result_array_url[] = $SUB_FOLDER . $current_sub['Hidden_URL'] . $current_cc['EnglishName'] . ".html";
        }
      }
      break;
    case 1:
      if ($current_cc['Checked']) {
        $result_array_name[] = $current_cc['Sub_Class_Name'];
        if (isset($current_cc["ExternalURL"]) && ($ext_url = $current_cc["ExternalURL"])) {
          $result_array_url[] = ((strchr($ext_url, ":") || substr($ext_url, 0, 1) == "/")
              ? $ext_url
              : $SUB_FOLDER . $current_cc[$i]['Hidden_URL'] . $ext_url) . ".html";
        }else if ($routing_module_enabled) {
          $result_array_url[] = (string) nc_routing::get_infoblock_path($current_cc['Sub_Class_ID']);
        }else {
          $result_array_url[] = $SUB_FOLDER . $current_sub['Hidden_URL'] . $current_cc['EnglishName'] . ".html";
        }
      }
      break;
  }

  if ($titleTemplate && $action == 'full') {
    $result_array_name[] = $f_title;
    $result_array_url[] = $current_page_path;
  }

  if (!$reverse) {
    $result_array_name = array_reverse($result_array_name);
    $result_array_url = array_reverse($result_array_url);
  }

  $array_result = array();
  for ($j = $from, $i = count($result_array_name) - 1; $i > -1; $i--) {

    if ($reverse) {
      $j++;
    }else {
      $j = $i + ($from + 1);
    }

    if (isset($parent_sub_tree[$j]["Subdivision_ID"]) && $current_sub["Subdivision_ID"] == $parent_sub_tree[$j]["Subdivision_ID"]) {
      if ($browse_template['active_link'] && ($result_array_url[$j] == $current_page_path)) {
        $array_result[$j] = $browse_template['active_link'];
      }else {
        $array_result[$j] = $browse_template['active'];
      }
    }else {
      $array_result[$j] = $browse_template['unactive'];
    }

    $array_result[$j] = str_replace("%NAME", $result_array_name[$i], $array_result[$j]);
    $array_result[$j] = str_replace("%URL", $result_array_url[$i], $array_result[$j]);
  }

  $result .= implode($browse_template['divider'], $array_result);

  if (isset($browse_template['suffix'])) {
    $result .= $browse_template['suffix'];
  }
  //FIXME удалить если для полного отображения по ключевому слову будет определен $current_cc не по источнику зеркала
  if (isset($current_cc_old)) {
    $current_cc = $current_cc_old;
  }
  return $result;
}
