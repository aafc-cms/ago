<?php

  $nodeTypes = array('news', 'empl', 'landing_page', 'page', 'webform');
  foreach ($nodeTypes as $nodeType) {
  $query = \Drupal::entityQuery('node')->condition('type', $nodeType);
  $nids = $query->execute();
  $count_success = 0;
    foreach ($nids as $vid => $nid) {
      $node = \Drupal::entityTypeManager()->getStorage('node')->load($nid);
      $node->delete();
      \Drupal\agri_admin\AgriAdminHelper::addToLog('deleted:' . $nodeType . $nid, TRUE);
      \Drupal\agri_admin\AgriAdminHelper::addMessage('deleted:' . $nodeType . $nid, TRUE);
      if ($result !== FALSE) {
        $count_success++;
      }
    }
  }

  $database = \Drupal::database();
  $query = $database->query("select fid from {file_managed}");
  $results = $query->fetchAll();
   $fids =[];
  foreach($results as $result) {
    $fids[] = $result->fid;
  $file = \Drupal\file\Entity\File::load($result->fid);
  $file_usage = \Drupal::service('file.usage');
  $list = $file_usage->listUsage($file);
    if (1 || empty($list)) {
      echo "\n deleted" .$file->id();
      $file->delete();
    }
  }

  $mediaTypes = array('audio_file', 'document', 'image', 'instagram', 'slideshow_thumbnav', 'slideshow', 'tweet', 'video', 'video_file');
  foreach ($mediaTypes as $mediaType) {
  $query = \Drupal::entityQuery('media')->condition('bundle', $mediaType);
  $medias = $query->execute();
    foreach ($medias as $media) {
      $media_entity = \Drupal\media\Entity\Media::load($media); 
      $media_entity->delete();
      echo print_r($mediaType , true);
      echo print_r($media_entity->getName() , true);
      echo " deleted \n";
    }
}

//ALTER TABLE node AUTO_INCREMENT=1;
//ALTER TABLE node_revision AUTO_INCREMENT=1;
//ALTER TABLE node_field_data AUTO_INCREMENT=1;
//ALTER TABLE node_field_revision AUTO_INCREMENT=1;
//truncate content_moderation_state_field_revision
//ALTER TABLE file_managed AUTO_INCREMENT=1;
//ALTER TABLE migrate_message_wxt_media AUTO_INCREMENT=1;
//ALTER TABLE migrate_message_wxt_media_slideshow AUTO_INCREMENT=1;
//ALTER TABLE migrate_message_wxt_file AUTO_INCREMENT=1;