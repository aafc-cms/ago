<?php

/**
 *  Return sha256 for fid.
 **/
function getHashByFid($fid) {
  $database = \Drupal::database();
  $result = $database->query('select sha256 from filehash where fid = :fid', [ ':fid' => $fid ])
    ->fetchAllAssoc('sha256', \PDO::FETCH_ASSOC);
  $sha256s = array_keys($result);
  $sha256 = reset($sha256s);
  return $sha256;
}

/**
 *  Return all fids for sha256 value.
 **/
function getFidsBySha256($sha256) {
  $database = \Drupal::database();
  $result = $database->query('select fid from filehash where sha256 = :sha256', [ ':sha256' => $sha256 ])
    ->fetchAllAssoc('fid', \PDO::FETCH_ASSOC);
  $fids = array_keys($result);
  return $fids;
}

/**
 *  Return array of fid.
 **/
function getDuplicateFids() {
  $database = \Drupal::database();
  $result = $database->query('select fid from filehash group by sha256 having count(sha256) > 1')
    ->fetchAllAssoc('fid', \PDO::FETCH_ASSOC);
  $fids = array_keys($result);
  return $fids;
}

$fids = getDuplicateFids();
$very_messed_up_files = [];

$idx = 0;
foreach ($fids as $fid) {
  $file = \Drupal\file\Entity\File::load($fid);
  if (!$file) {
    unset($fids[$idx]);
    continue;
  }
  $file_uri = str_replace('public://', '/sites/default/files/', $file->getFileUri());
  if (stripos($file_uri, '.pdf') < 2 ) {
    unset($fids[$idx]);
    continue;
  }
  echo "fid=$fid";
  echo "\n";

  $sha256 = getHashByFid($fid);
  $fids_with_matches = getFidsBySha256($sha256); 
  echo "---- sha256 = $sha256 ----";
  echo "\n";
  $inner_idx = 0;
  foreach ($fids_with_matches as $fid_matched) {
    $file = \Drupal\file\Entity\File::load($fid_matched);
    if (!$file) {
      unset($fids_with_matches[$inner_idx]);
      continue;
    }
    $file_uri = str_replace('public://', '/sites/default/files/', $file->getFileUri());
    if (stripos($file_uri, '.pdf') < 2 ) {
      $very_messed_up_files[] = [
        'fid' => $fid_matched,
        'file_uri' => $file_uri,
        'filename' => $file->getFilename(),
        'sha256' => $sha256,
      ];
      unset($fids_with_matches[$inner_idx]);
      continue;
    }
    $inner_idx++;
  }
  $inner_idx = 0;
  foreach ($fids_with_matches as $fid_matched) {
    $file = \Drupal\file\Entity\File::load($fid_matched);
    if (!$file) {
      continue;
    }
    if (stripos($file_uri, '.pdf') < 2 ) {
      unset($fids_with_matches[$inner_idx]);
      continue;
    }
    $file_uri = str_replace('public://', '/sites/default/files/', $file->getFileUri());
    echo "         fid = /admin/content/files/replace/$fid_matched";
    echo "\n";
    echo "Is duplicate = " . $file_uri;
    echo "\n";
    $inner_idx++;
  }
  $idx++;
}

echo "-----------------------------------------------------------------------------------";
echo "\n";
echo "------ report of corrupted filenames -----";
foreach ($very_messed_up_files as $fid_matched) {
  echo "-----------------------------------------------------------------------------------";
  echo "\n";
  echo "Filename matching file with problem       = " . $fid_matched['filename'];
  echo "\n";
  echo "fid matching corrupted fileuri duplicate  = /admin/content/files/replace/" . $fid_matched['fid'];
  echo "\n";
  echo "Has corrupted fileuri and is a duplicate  = " . $fid_matched['file_uri'];
  echo "\n";
  echo "-----------------------------------------------------------------------------------";
  echo "\n";
}
echo "\n";
echo "-----------------------------------------------------------------------------------";
echo "\n";

echo count($fids) . ' duplicates in total';


