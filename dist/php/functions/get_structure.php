<?php

function get_structure ($section, $where = 1, $mode = "plain") {
  if (!is_numeric($section)) return false;
  if (!$where) $where = 1;

  global $_structure_level;

  $ret = array();

  $res = nc_db()->get_results(
    "SELECT *
        FROM Subdivision
        WHERE $where AND Parent_Sub_ID = $section",
    ARRAY_A
  );

  if ($res) {
    foreach ($res as $row) {
      $row["level"] = (int) $_structure_level;
      $ret[$row["Subdivision_ID"]] = $row;
      $_structure_level++;
      $children = get_structure($row["Subdivision_ID"], $where);
      $_structure_level--;

      foreach ($children as $idx => $row2) {
        $ret[$idx] = $row2;
      }
    }
  }

  if ($mode == "get_children") {
    foreach ($ret as $idx => $row) {
      while ($row["Parent_Sub_ID"] != $section) {
        $ret[$row["Parent_Sub_ID"]]["Children"][] = $row["Subdivision_ID"];
        $row = $ret[$row["Parent_Sub_ID"]];
      }
    }
  }

  return $ret;
}
