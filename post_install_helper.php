#!/usr/bin/env php
<?php


/**
 * @file
 * Argument handling from command line and from web browser.
 */

foreach ($argv as $arg) {
  echo $arg . "\n";
  $e = explode("=", $arg);
  if (count($e) == 2) {
    $_GET[$e[0]] = $e[1];
  }
  else {
    $_GET[$e[0]] = 0;
  }
}

if (isset($_GET['file_path'])) {
  $file_path = $_GET['file_path'];
}
if (isset($_GET['old_text'])) {
  $old_text = $_GET['old_text'];
}
if (isset($_GET['new_text'])) {
  $new_text = $_GET['new_text'];
}
if (isset($_GET['force_split'])) {
  $force_split = $_GET['force_split'];
}

if (empty($file_path)) {
  $file_path = 'html/sites/default/settings.php';
}
if (!isset($force_split)) {
  $force_split = 'neither';
}

if (($force_split != 'dev' && $force_split != 'live') && empty($old_text)) {
  echo "\n\n";
  echo "Usage: post_install_helper.php file_path='path/to/file.txt' old_text='old_text' new_text='new_text' # Custom path to filename.\n";
  echo "OR\n";
  echo "Usage: post_install_helper.php old_text='old_text' new_text='new_text' # No path or file specified, default file = html/sites/default/settings.php\n";
  echo "OR\n";
  echo "Usage: post_install_helper.php force_split='live'\n";
  echo "OR\n";
  echo "Usage: post_install_helper.php force_split='dev'\n";
  echo "\n\n";
  exit;
}

if ($force_split == 'dev') {
  // Allow $file_path (settings) to be modified.
  chmod('html/sites/default', 0775);
  // Allow $file_path (settings) to be modified.
  chmod($file_path, 0664);
  $old_text = "config['config_split.config_split.dev']['status'] = FALSE";
  $new_text = "config['config_split.config_split.dev']['status'] = TRUE";
  replace_in_file($old_text, $new_text, $file_path);
  $old_text = "config['config_split.config_split.live']['status'] = TRUE";
  $new_text = "config['config_split.config_split.live']['status'] = FALSE";
  replace_in_file($old_text, $new_text, $file_path);
  echo 'dev' . "\n";
  // Restore permissions, could make this 440 but this is only dev.
  chmod($file_path, 0444);
  // Allow $file_path (settings) to be modified.
  chmod('html/sites/default', 0555);
  exit;
}
if ($force_split == 'live') {
  // Allow $file_path (settings) to be modified.
  chmod('html/sites/default', 0775);
  // Allow $file_path (settings) to be modified.
  chmod($file_path, 0664);
  $old_text = "config['config_split.config_split.dev']['status'] = TRUE";
  $new_text = "config['config_split.config_split.dev']['status'] = FALSE";
  replace_in_file($old_text, $new_text, $file_path);
  $old_text = "config['config_split.config_split.live']['status'] = FALSE";
  $new_text = "config['config_split.config_split.live']['status'] = TRUE";
  replace_in_file($old_text, $new_text, $file_path);
  echo 'live' . "\n";
  // Restore permissions, make this more secure in 'live' environments.
  chmod($file_path, 0440);
  // Allow $file_path (settings) to be modified.
  chmod('html/sites/default', 0555);
  exit;
}

replace_in_file($file_path, $old_text, $new_text);

/**
 * Replaces a string in a file.
 *
 * @param string $old_text
 *   Text to be replaced.
 * @param string $new_text
 *   New text.
 * @param string $file_path
 *   Path to settings file.
 *
 * @return array
 *   Status (success | error) & message (file exist, file permissions).
 */
function replace_in_file($old_text, $new_text, $file_path = 'html/sites/default/settings.php') {
  $result = ['status' => 'error', 'message' => ''];
  if (file_exists($file_path) === TRUE) {
    if (is_writable($file_path)) {
      try {
        $file_content = file_get_contents($file_path);
        $file_content = str_replace($old_text, $new_text, $file_content);
        if (file_put_contents($file_path, $file_content) > 0) {
          $result["status"] = 'success';
        }
        else {
          $result["message"] = 'Error while writing file';
        }
      }
      catch (Exception $e) {
        $result["message"] = 'Error : ' . $e;
      }
    }
    else {
      $result["message"] = 'File ' . $file_path . ' is not writable !';
    }
  }
  else {
    $result["message"] = 'File ' . $file_path . ' does not exist !';
  }
  return $result;
}
