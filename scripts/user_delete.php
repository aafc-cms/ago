<?php

  $query = \Drupal::entityQuery('user')->condition('uid', 1, '<>');
  $uids = $query->execute();
  $count_success = 0;
  foreach ($uids as $vid => $uid) {
    $user = \Drupal::entityTypeManager()->getStorage('user')->load($uid);
    $user->delete();
    \Drupal\agri_admin\AgriAdminHelper::addToLog('deleted:' . $uid, TRUE);
    \Drupal\agri_admin\AgriAdminHelper::addMessage('deleted:'. $uid, TRUE);
    if ($result !== FALSE) {
      $count_success++;
    }
  }

