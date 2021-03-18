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


// Should only run this step if needed:
foreach (Drupal::entityTypeManager()->getStorage("taxonomy_term")->loadByProperties(["vid" => ["news_type","employment_type","category", "aafc_type"]]) as $term) {
  $term->delete();
}



//
//ALTER TABLE node AUTO_INCREMENT=1;
//ALTER TABLE node_revision AUTO_INCREMENT=1;
//ALTER TABLE node_field_data AUTO_INCREMENT=1;
//ALTER TABLE node_field_revision AUTO_INCREMENT=1;
//truncate content_moderation_state_field_revision
//ALTER TABLE file_managed AUTO_INCREMENT=1;
//ALTER TABLE migrate_messqueryage_wxt_media AUTO_INCREMENT=1;
//ALTER TABLE migrate_message_wxt_media_slideshow AUTO_INCREMENT=1;
//ALTER TABLE migrate_message_wxt_file AUTO_INCREMENT=1;

$database = \Drupal::database();
$query = $database->query("ALTER TABLE {node} AUTO_INCREMENT=1")->execute();
$query = $database->query("ALTER TABLE {node_revision} AUTO_INCREMENT=1")->execute();
$query = $database->query("ALTER TABLE {node_field_data} AUTO_INCREMENT=1")->execute();
$query = $database->query("ALTER TABLE {node_field_revision} AUTO_INCREMENT=1")->execute();
$query = $database->query("ALTER TABLE {media_revision} AUTO_INCREMENT=1")->execute();
$query = $database->query("ALTER TABLE {media_field_revision} AUTO_INCREMENT=1")->execute();
//$query = $database->query("truncate {content_moderation_state_field_revision}")->execute();
$query = $database->query("ALTER TABLE {file_managed} AUTO_INCREMENT=1")->execute();
$query = $database->query("DELETE from {content_moderation_state_field_revision} where content_entity_type_id='node' OR content_entity_type_id='media'")->execute();

//$query = $database->query("TRUNCATE TABLE {node}")->execute();
//$query = $database->query("TRUNCATE TABLE {node_revision}")->execute();
//$query = $database->query("TRUNCATE TABLE {node_field_data}")->execute();
//$query = $database->query("TRUNCATE TABLE {node_field_revision}")->execute();
//$query = $database->query("TRUNCATE TABLE {media_revision}")->execute();
//$query = $database->query("TRUNCATE TABLE {media_field_revision}")->execute();
//$query = $database->query("TRUNCATE TABLE {file_managed}")->execute();
//$query = $database->query("TRUNCATE TABLE {content_moderation_state_field_revision}")->execute();

// TODO: content_moderation_state_field_data CLEANUP
//
//$query = $database->query("ALTER TABLE {migrate_messqueryage_wxt_media} AUTO_INCREMENT=1")->execute();
//$query = $database->query("ALTER TABLE {migrate_message_wxt_media_slideshow} AUTO_INCREMENT=1")->execute();
//$query = $database->query("ALTER TABLE {migrate_message_wxt_file} AUTO_INCREMENT=1")->execute();

//delete menu_name. main and External, sidebar
/*$menus = array('main');
foreach ($menus as $menuName) {
  $database = \Drupal::database();
  $sql = "SELECT id FROM menu_link_content_data WHERE external = :external and menu_name = :menuname";
  $result = $database->query($sql, [':external' => 1, ':menuname' => $menuName ]);
  if ($result) {
    while ($row = $result->fetchAssoc()) {
      // $row['column']
      echo print_r($row, true);
      $menu_link = \Drupal::entityTypeManager()->getStorage('menu_link_content')->load($row['id']);
      if(!empty($menu_link)){
        echo print_r($menu_link->getTitle() , true);
        $menu_link->delete();
      }
    }
  }
}*/

$menus = array('main', 'sidebar');
foreach ($menus as $menuName) {
  $database = \Drupal::database();
  $sql = "SELECT id FROM menu_link_content_data WHERE menu_name = :menuname";
  $result = $database->query($sql, [':menuname' => $menuName ]);
  if ($result) {
    while ($row = $result->fetchAssoc()) {
      // $row['column']
      echo print_r($row, true);
      $menu_link = \Drupal::entityTypeManager()->getStorage('menu_link_content')->load($row['id']);
      if(!empty($menu_link)){
        echo print_r($menu_link->getTitle() , true);
        $menu_link->delete();
      }
    }
  }
}

