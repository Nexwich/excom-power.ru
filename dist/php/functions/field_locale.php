<?php

function field_locale ($field_name) {
  return 'f_' . $field_name . ucfirst($_SESSION['locale']);
}

function get_field_by_locale ($field_name, $is_first) {
  $locale = $_SESSION['locale'];
  if ($is_first) $locale = ucfirst($locale);

  return $field_name . $locale;
}
