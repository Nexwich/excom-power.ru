<?php

function image_resize ($image_path, $return_image_size = [], $return_image_crop = 0) {
  global $nc_core;
  require_once($nc_core->INCLUDE_FOLDER . "classes/nc_imagetransform.class.php");

  if (!$image_path) return false;

  $image_root = $nc_core->DOCUMENT_ROOT . $image_path;
  $image_info = pathinfo($image_path);

  $return_image_size_width = $return_image_size[0] ? $return_image_size[0] : 9999;
  $return_image_size_height = $return_image_size[1] ? $return_image_size[1] : 9999;

  if (is_file($image_root)) {
    $return_image_folder_path = $nc_core->HTTP_FILES_PATH . "resize/" . $return_image_size_width . "x" . $return_image_size_height;
    $return_image_folder_root = $nc_core->DOCUMENT_ROOT . $return_image_folder_path;
    $return_image_path = $return_image_folder_path . $image_path;
    $return_image_root = $nc_core->DOCUMENT_ROOT . $return_image_path;
    $return_image_size_fact = getimagesize($return_image_root);

    if (!is_dir($return_image_folder_root)) mkdir($return_image_folder_root, 0755, true);

    $return_image_info = pathinfo($return_image_root);

    if (!is_file($return_image_root)
      or ($return_image_size_fact[0] != $return_image_size_width and $return_image_size_fact[1] != $return_image_size_height and !$return_image_crop)
      or (($return_image_size_fact[0] != $return_image_size_width or $return_image_size_fact[1] != $return_image_size_height) and $return_image_crop)) {

      if (!is_dir($return_image_info['dirname'])) mkdir($return_image_info['dirname'], 0755, true);
      nc_ImageTransform::imgResize($image_root, $return_image_root, $return_image_size_width, $return_image_size_height, $return_image_crop);
    }

    return $return_image_path;
  }

  return false;
}
