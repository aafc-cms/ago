<?php

namespace Drupal\agri_reports;
use Drupal\Core\File\FileSystemInterface;
use Drupal\file\Entity\File;
use Drupal\Core\Database\Connection;

class AdminHelper {

  static public function CreateWarmingCacheJsonfile($filedirectory ='', $database) {
    $directoryexists = \Drupal::service('file_system')->prepareDirectory($filedirectory);
    if(!$directoryexists) {
      \Drupal::service('file_system')->mkdir($filedirectory);
    }
    else {
      // clean up old json files before new json files are generated
      $files = \Drupal::service('file_system')->scanDirectory($filedirectory, '/.json/');
      $filearraynid = array();
      foreach ($files as $file) {
        $fileuri = $file ->uri;
        \Drupal::service('file_system')->deleteRecursive($fileuri);
      }
    }
    $sqlstatement = "SELECT  CONVERT ( REPLACE(a.path, '/node/', ''), UNSIGNED INTEGER) as nodeid,
                    a.path , a.langcode, CONCAT('/', a.langcode,  a.alias) as uri,
                    length( a.alias)-length(replace( a.alias,'/','')) as depth
                    FROM path_alias a
                    inner join
                    ( select distinct b.langcode, b.path, Max(b.revision_id) as revision_id
                    FROM path_alias b where b.path like '/node/%'
                    group by b.langcode, b.path
                    order by b.path asc
                    ) c
                    on a.revision_id = c.revision_id
                    and a.langcode = c.langcode
                    and a.path = c.path
                    and a.path <> '/node/1'
                    inner join
                    ( select content_entity_id as nodeid, langcode
                      from content_moderation_state_field_data
                      where content_entity_type_id ='node' and moderation_state = 'published'
                    ) s
                    on CONVERT ( REPLACE(a.path, '/node/', ''), UNSIGNED INTEGER)  =  s.nodeid
                    and a.langcode = s.langcode
                    Where a.path like '/node/%' and a.status = 1
                    order by depth asc, a.langcode asc, nodeid asc";
    $query = $database->query($sqlstatement);
    $result = $query->fetchAll();
    $jsonarray =  array();
    foreach( $result  as $row ) {
      $element = array (
        "nodeid" => $row->nodeid,
        "uri"    => $row->uri
        );
      array_push($jsonarray,$element);
    }
    $json = json_encode($jsonarray, JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE);
    $fp = $filedirectory . "cache_warming.json";
    $file = file_save_data($json, $fp, FileSystemInterface::EXISTS_REPLACE);
  }
}