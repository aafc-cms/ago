<?php

namespace Drupal\agri_admin;

use Drupal\menu_link_content\Entity\MenuLinkContent;
use Drupal\node\Entity\Node;
use Drupal\access_unpublished\Entity\AccessToken;

/**
 * Helper class that provides useful functions that may be used more than once.
 */
class AgriAdminHelper {

  /**
   * Add a message to the page.
   */
  public static function addMessage($message) {
    \Drupal::messenger()->addMessage($message);
  }

  /**
   * Log something to the dblog (drush wd-show to see it).
   */
  public static function addToLog($message, $debug = FALSE) {
    // $debug = FALSE;
    if ($debug) {
      \Drupal::logger('agri_admin')->notice($message);
    }
  }

  /**
   * Log something to the dblog (drush wd-show to see it).
   */
  public static function addError($message) {
    \Drupal::logger('agri_admin')->error($message);
  }

  /**
   * Log something to the dblog (drush wd-show to see it).
   */
  public static function addWarning($message) {
    \Drupal::logger('agri_admin')->warning($message);
  }

  /**
   * Automatically translate menu links in french if not already translated.
   */
  public static function postCreateOrUpdateAutoTranslate($action, $entity_id, $bundle) {
    if ($bundle == 'page' || $bundle == 'landing_page') {
      // @todo that function doesn't actually do anything with param 2.
      $menu_link_main_array = static::translateLinkIfNotTranslated($entity_id, 'sidebar');
      // For goto redirect.
      return $menu_link_main_array;
    }
  }

  /**
   * Is called from the hook_update() function to do post update processing on a node.
   */
  public static function postUpdateProcess($action, $entity_id, $bundle, $disable_menu_link = FALSE) {
    static::addToLog(__function__);
    static::addToLog($action . ' entity_id ' . $entity_id);
    $parentUuid = NULL;
    $parentUuidClean = NULL;
    if ($bundle == 'page') {
      $parentNid = static::findParentOfNid($entity_id, 'sidebar', $parentUuid, $parentUuidClean);
      if ($parentNid > 0) {
        $resultCode = static::createChildOfParentNid($entity_id, 'sidebar', $parentNid, $parentUuid, $disable_menu_link);
        if ($resultCode) {
          static::addToLog('Successfully created new sidebar link for nid=id=' . $entity_id);
        }
      }
    }
  }

  /**
   * Used during imports, might not be needed anymore.
   */
  public static function postImportProcess($action, $entity_id, $bundle, $disable_menu_link = FALSE) {
    static::addToLog(__function__);
    static::addToLog($action . ' entity_id ' . $entity_id);
    $parentUuid = NULL;
    $parentUuidClean = NULL;
    if ($bundle == 'page') {
      $parentNid = static::findParentOfNid($entity_id, 'sidebar', $parentUuid, $parentUuidClean);
      if ($parentNid > 0) {
        $resultCode = static::createChildOfParentNid($entity_id, 'sidebar', $parentNid, $parentUuid, $disable_menu_link);
        if ($resultCode) {
          static::addToLog('Successfully created new main link for nid=id=' . $entity_id);
        }
        $resultCode = static::createChildOfParentNid($entity_id, 'sidebar', $parentNid, $parentUuid, $disable_menu_link);
        if ($resultCode) {
          static::addToLog('Successfully created new sidebar link for nid=id=' . $entity_id);
        }
      }
    }
    if ($bundle == 'landing_page') {
      $parentNid = static::findParentOfNid($entity_id, 'sidebar', $parentUuid, $parentUuidClean);
      $resultCode = static::createChildOfParentNid($entity_id, 'sidebar', $parentNid, $parentUuid);
      if ($resultCode) {
        static::addToLog('Successfully created new main link for nid=id=' . $entity_id);
      }
    }
  }

  /**
   * Retrieve the lang code for the current ui interface language.
   */
  public static function getLang() {
    return \Drupal::languageManager()->getCurrentLanguage()->getId();
  }

  /**
   * Retrieve the other official language langcodes.
   */
  public static function getOtherLang() {
    // Get the list of all languages.
    $langcode = static::getLang();
    $otherLangCode = 'fr';
    if ($langcode != 'en') {
      $otherLangCode = 'en';
    }
    return $otherLangCode;
  }

  /**
   * Hide internal page menu links from the ui.
   */
  public static function disableMenuLinkByNid($nid, $menu_name = 'sidebar') {
    return self::disableMenuLink(NULL, $nid, $menu_name, TRUE);
  }

  /**
   * Verify if the menu link exists for a specific nid.
   */
  public static function legacyMenuLinkExists($menu_name, $ts_nid, $lang) {
    static::addToLog(__function__ . '(' . $menu_name . ', ' . $ts_nid . ', ' . $lang . ')');
    $database = \Drupal::database();
    $sql = "SELECT ml.uuid as uuid FROM menu_link_content as ml inner join menu_tree as mt on mt.id = concat('menu_link_content:', ml.uuid) " .
    " WHERE mt.menu_name = :menuname and ml.ts_nid = :tsnid  and ml.langcode = :lang";
    // $sql = "SELECT uuid FROM menu_link_content WHERE menu_name = :menuname AND ts_nid = :tsnid AND langcode = :lang";
    $result = $database->query($sql, [
      ':menuname' => $menu_name,
      ':tsnid' => $ts_nid,
      ':lang' => $lang,
    ]
    );
    $uuid = '';
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        // $row['column']
        static::addToLog('Found menu uuid=' . $row['uuid']);
        $uuid = $row['uuid'];
        return $uuid;
      }
    }
    static::addToLog('Menu was not found from ts_nid=' . $ts_nid . ' lang=' . $lang);
    return FALSE;
  }

  /**
   * Verify if the external link already exists or not.
   */
  public static function menuExternalLinkExists($title, $external_link, $menu_name, $ts_nid, $lang) {
    static::addToLog(__function__);
    if (is_null($menu_name) || empty($menu_name)) {
      // Makes this function PHP 8.0 compatible.
      $menu_name = 'sidebar';
    }

    $uuid = static::legacyMenuLinkExists($menu_name, $ts_nid, $lang);
    if (!empty($uuid) && gettype($uuid) == 'string') {
      return TRUE;
      // Return $uuid;.
    }

    if (empty($title) || empty($external_link)) {
      static::addToLog('Menu Link Exists , title or external_link is empty, cannot process, abort.');
      return TRUE;
    }
    $menuLink = \Drupal::entityTypeManager()->getStorage('menu_link_content')
      ->loadByProperties([
        'link.title' => $title,
        'link.uri' => $external_link,
        'langcode' => $lang,
        'menu_name' => $menu_name,
      ]);
    $menuLink = reset($menuLink);
    if (isset($menuLink) && !empty($menuLink)) {
      static::addToLog('Menu Link Exists,<pre>uuid=' . print_r($menuLink->uuid(), TRUE) . '</pre>');
      return TRUE;
      // Return $menuLink->uuid();
    }
    static::addToLog($menu_name . ' menu link for ts_nid does not yet exist: ts_nid=<pre>' . print_r($ts_nid, TRUE) . '</pre>');
    return FALSE;
  }

  /**
   * Enable or disable menu links depending on the action param.
   */
  public static function menuLinkAction($nid, $menu_name = 'sidebar', $action = 'disable') {
    static::addToLog(__function__);
    $menuLink = \Drupal::entityTypeManager()->getStorage('menu_link_content')
      ->loadByProperties([
        'link.uri' => 'entity:node/' . $nid,
        'menu_name' => $menu_name,
      ]);
    $menuLink = reset($menuLink);
    if (isset($menuLink) && !empty($menuLink)) {
      static::addToLog('Menu Link Exists,<pre>id=' . print_r($menuLink->id(), TRUE) . '</pre>');
      if ($action == 'disable') {
        $menuLink->set('enabled', FALSE);
        $menuLink->save();
      }
      if ($action == 'delete') {
        $menuLink->delete();
      }
      if ($action == 'enable') {
        $menuLink->set('enabled', TRUE);
        $menuLink->save();
      }
      return TRUE;
    }
    static::addToLog($menu_name . ' menu link for nid does not yet exist: nid=<pre>' . print_r($nid, TRUE) . '</pre>');
    return FALSE;
  }

  /**
   * Verify if the node has a menu link for a particular menu.
   */
  public static function menuLinkExists($nid, $menu_name = 'sidebar') {
    static::addToLog(__function__);
    $menuLink = \Drupal::entityTypeManager()->getStorage('menu_link_content')
      ->loadByProperties([
        'link.uri' => 'entity:node/' . $nid,
        'menu_name' => $menu_name,
      ]);
    $menuLink = reset($menuLink);
    if (isset($menuLink) && !empty($menuLink)) {
      static::addToLog('Menu Link Exists,<pre>id=' . print_r($menuLink->id(), TRUE) . '</pre>');
      return TRUE;
    }
    static::addToLog($menu_name . ' menu link for nid does not yet exist: nid=<pre>' . print_r($nid, TRUE) . '</pre>');
    return FALSE;
  }

  /**
   * Verify if the menu link for the specified language exists or not.
   */
  public static function menuLinkByLanguageExists($nid, $menu_name = 'sidebar', $lang = 'en') {
    static::addToLog(__function__);
    $menuLink = \Drupal::entityTypeManager()->getStorage('menu_link_content')
      ->loadByProperties([
        'link.uri' => 'entity:node/' . $nid,
        'menu_name' => $menu_name,
        'langcode' => $lang,
      ]);
    $menuLink = reset($menuLink);
    if (isset($menuLink) && !empty($menuLink)) {
      static::addToLog('Menu Link Exists,<pre>id=' . print_r($menuLink->id(), TRUE) . '</pre>');
      return TRUE;
    }
    static::addToLog('Sidebar menu link for nid does not yet exist: nid=<pre>' . print_r($nid, TRUE) . '</pre>');
    return FALSE;
  }

  /**
   * Retrieve the mnu link uuid.
   */
  public static function getMenuUuidFromNidAndMenuName($nid, $menu_name) {
    static::addToLog(__function__);
    static::addToLog('Search for menu id from nid:' . $nid);
    $storage = \Drupal::entityTypeManager()->getStorage('menu_link_content');
    $link = $storage->loadByProperties([
      'link.uri' => 'entity:node/' . $nid,
      'menu_name' => $menu_name,
    ]);
    $link = reset($link);
    if (isset($link) && !empty($link)) {
      static::addToLog('<pre>' . print_r(get_class_methods($link), TRUE) . '</pre>');
      static::addToLog('Menu link found from nid=' . $nid . ' uuid = ' . $link->uuid());
      return $link->uuid();
    }
    static::addToLog('Menu link was not found from nid=' . $nid . ' and menu_name = ' . $menu_name);
    return FALSE;
  }

  /**
   * Retrieve the menu link uuid for the specified mlid and language.
   */
  public static function getUuidFromId($id, $lang) {
    static::addToLog(__function__ . ' lang=' . $lang);
    $database = \Drupal::database();
    $sql = "SELECT uuid FROM menu_link_content WHERE id = :id and langcode = :lang";
    $result = $database->query($sql, [':id' => $id, 'lang' => $lang]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        // $row['column']
        static::addToLog('Found ' . $lang . ' menu uuid=' . $row['uuid']);
        return $row['uuid'];
      }
    }
    static::addToLog('Menu link uuid was not found from id=' . $id);
    return FALSE;
  }

  /**
   * This was used during the initial import of the content from teamsite.
   */
  public static function updateNodeLegacyIds($nid, $ts_nid, $ts_pnid, $dcr_id) {
    // For teamsite import organising.
    $database = \Drupal::database();
    $num_updated = $database->update('node')
      ->fields([
        'ts_nid' => $ts_nid,
        'ts_pnid' => $ts_pnid,
        'dcr_id' => $dcr_id,
      ])
      ->condition('nid', $nid, '=')
      ->execute();
    return $num_updated;
  }

  /**
   * Update the dcrid for a specified mlid and dcrid and lang.
   */
  public static function updateDcrId($menuid, $dcr_id, $lang) {
    // For teamsite import organising.
    $database = \Drupal::database();
    $num_updated = $database->update('menu_link_content')
      ->fields([
        'dcr_id' => $dcr_id,
      ])
      ->condition('id', $menuid, '=')
      ->condition('langcode', $lang, '=')
      ->execute();
    return $num_updated;
  }

  /**
   * Update parent teamsite parent teamsite id.
   */
  public static function updateTsPnid($menuid, $ts_pnid, $lang = 'en') {
    // For teamsite import organising.
    $database = \Drupal::database();
    $num_updated = $database->update('menu_link_content')
      ->fields([
        'ts_pnid' => $ts_pnid,
      ])
      ->condition('id', $menuid, '=')
      ->condition('langcode', $lang, '=')
      ->execute();
    return $num_updated;
  }

  /**
   * Update the teamsite TsNid.
   */
  public static function updateTsNid($menuid, $ts_nid, $lang) {
    // For teamsite import organising.
    $database = \Drupal::database();
    $num_updated = $database->update('menu_link_content')
      ->fields([
        'ts_nid' => $ts_nid,
      ])
      ->condition('id', $menuid, '=')
      ->condition('langcode', $lang, '=')
      ->execute();
    return $num_updated;
  }

  /**
   * Update the teamsite nid.
   */
  public static function hasTsNid($menuid, $lang = 'en') {
    // static::addToLog(__function__);
    $database = \Drupal::database();
    $sql = "SELECT id, ts_nid FROM menu_link_content WHERE id = :menuid and langcode = :language";
    $result = $database->query($sql, [
      ':menuid' => $menuid,
      ':language' => $lang,
    ]
    );
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        // $row['column']
        if (!isset($row['ts_nid']) || is_null($row['ts_nid'])) {
          return FALSE;
        }
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * Determines if the teamsite id was previously imported or not.
   */
  public static function tsNidPreviouslyImported($ts_nid, $lang = 'en') {
    $database = \Drupal::database();
    $sql = "SELECT ts_nid FROM node WHERE ts_nid = :tsnid and langcode = :language";
    $result = $database->query($sql, [':tsnid' => $ts_nid, ':language' => $lang]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        return TRUE;
      }
    }
    $sql = "SELECT ts_nid FROM menu_link_content WHERE ts_nid = :tsnid and langcode = :language";
    $result = $database->query($sql, [':tsnid' => $ts_nid, ':language' => $lang]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        // $row['column']
        if (!isset($row['ts_nid']) || is_null($row['ts_nid'])) {
          return FALSE;
        }
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * Determine if the dcrid was previously imported or not.
   */
  public static function dcrIdPreviouslyImported($dcr_id, $lang = 'en') {
    // static::addToLog(__function__);
    $database = \Drupal::database();
    $sql = "SELECT dcr_id FROM node WHERE dcr_id = :dcrid and langcode = :language";
    $result = $database->query($sql, [':dcrid' => $dcr_id, ':language' => $lang]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        // $row['column']
        if (!isset($row['dcr_id']) || is_null($row['dcr_id'])) {
          return FALSE;
        }
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * Retrieve the menu link from mlid.
   */
  public static function getMenuLinkFromMlid($mlid) {
    $menuLink = \Drupal::entityTypeManager()->getStorage('menu_link_content')->load($mlid);
    return $menuLink;
  }

  /**
   * Get the menu link by uuid.
   */
  public static function getMenuLinkByUuid($uuid) {
    $menuLinks = \Drupal::entityTypeManager()->getStorage('menu_link_content')->loadByProperties(['uuid' => $uuid]);
    return reset($menuLinks);
  }

  /**
   * Is the link english only.
   */
  public static function isLinkEnglishOnly($id) {
    if (is_numeric($id)) {
      $menuLink = self::getMenuLinkFromMlid($id);
    }
    else {
      // $id is not numeric, so it must be uuid.
      $menuLink = self::getMenuLinkByUuid($id);
    }
    if (!$menuLink) {
      return FALSE;
    }
    $link_attributes = $menuLink->link->options;
    if (isset($link_attributes['attributes']['class'])) {
      if (!empty($link_attributes['attributes']['class'])) {
        foreach ($link_attributes['attributes']['class'] as $classname) {
          if (strpos($classname, 'nglish-only') > 0) {
            return TRUE;
          }
        }
      }
    }
  }

  /**
   * Is the link french only.
   */
  public static function isLinkFrenchOnly($id) {
    if (is_numeric($id)) {
      $menuLink = self::getMenuLinkFromMlid($id);
    }
    else {
      if (strlen($id) >= 35) {
        // $id is not numeric, so it must be uuid.
        $menuLink = self::getMenuLinkByUuid($id);
      }
      else {
        return FALSE;
      }
    }
    if (!$menuLink) {
      return FALSE;
    }
    $link_attributes = $menuLink->link->options;
    if (isset($link_attributes['attributes']['class'])) {
      if (!empty($link_attributes['attributes']['class'])) {
        foreach ($link_attributes['attributes']['class'] as $classname) {
          if (strpos($classname, 'rench-only') > 0) {
            return TRUE;
          }
        }
      }
    }
  }

  /**
   * Retrieve the mlid using the uuid.
   */
  public static function getMenuIdFromUuid($uuid) {
    static::addToLog(__function__);
    $cleanUuid = str_replace('menu_link_content:', '', $uuid);
    static::addToLog('Search for menu id from uuid clean:' . $cleanUuid);
    $database = \Drupal::database();
    $sql = "SELECT id FROM menu_link_content WHERE uuid = :uuid";
    $result = $database->query($sql, [':uuid' => $cleanUuid]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        // $row['column']
        static::addToLog('Found menu id=' . $row['id']);
        return $row['id'];
      }
    }
    static::addToLog('Menu was not found from uuid=' . $cleanUuid);
    return FALSE;
  }

  /**
   * Retrieve the node id from the mlid.
   */
  public static function getNidFromMenuLinkContentId($mlid, $menu_name = 'sidebar', $lang = 'en') {
    static::addToLog(__function__);
    static::addToLog('Search for nid from id:' . $mlid);
    $database = \Drupal::database();
    $sql = "SELECT link__uri FROM menu_link_content_data WHERE langcode = :lang and external = :external and menu_name = :menuname and id = :mlid";
    $result = $database->query($sql, [
      ':lang' => $lang,
      ':external' => 0,
      ':menuname' => $menu_name,
      ':mlid' => $mlid,
    ]
    );
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        // $row['column']
        static::addToLog('Found menu link__uri=' . $row['link__uri']);
        return str_replace('entity:node/', '', $row['link__uri']);
      }
    }
    static::addToLog('Menu link was not found from id=' . $mlid);
    return FALSE;
  }

  /**
   * Create an external menu link.
   */
  public static function createExternalLegacyMenuLink($title, $external_link, $menu_name, $ts_nid, $ts_pnid, $titleFr, $external_linkFr, $lang = 'en') {
    static::addToLog(__function__ . ' : ' . $lang);
    if (is_null($menu_name) || empty($menu_name)) {
      // Makes this function PHP 8.0 compatible.
      $menu_name = 'sidebar';
    }
    if ($lang == 'en') {
      if (!static::menuExternalLinkExists($title, $external_link, $menu_name, $ts_nid, $lang) && gettype(static::legacyMenuLinkExists($menu_name, $ts_pnid, $lang)) == 'string') {
        $parentUuid = static::legacyMenuLinkExists($menu_name, $ts_pnid, $lang);
        $menu_attributes = [
          'title' => $title,
          'link' => ['uri' => $external_link],
          'menu_name' => $menu_name,
          'target' => '_blank',
          'external' => TRUE,
          'parent' => 'menu_link_content:' . $parentUuid,
          'expanded' => FALSE,
          'bundle' => 'menu_link_content',
          'status' => TRUE,
          'langcode' => $lang,
        ];
        // static::addToLog('en menu_attributes["parent"]=' . $menu_attributes['parent']);.
        if (gettype($parentUuid) == 'boolean') {
          unset($menu_attributes['parent']);
        }
        $menu_link = MenuLinkContent::create($menu_attributes);
        $options['attributes']['class'] = ['english-only legacy-external-link'];
        $menu_link->link->options = $options;
        $returnCode = $menu_link->save();
        if ($returnCode) {
          $id = $menu_link->id();
          static::updateTsNid($id, $ts_nid, $lang);
          static::updateTsPnid($id, $ts_pnid, $lang);
          // static::updateDcrId($id, $dcr_id, $lang); // dcr_id is not numeric for external legacy sitemap menu links.
        }
        if ($lang == 'en' && !$menu_link->hasTranslation('fr') && $external_link == $external_linkFr && $title != $titleFr) {
          $menu_link->addTranslation('fr', ['title' => $titleFr]);
          static::addToLog(__function__ . '** JOSEPH TEST ************added french translation for menu title=' . $titleFr);
          $returnCode = $menu_link->save();
        }
        if ($returnCode) {
          static::addToLog('JOSEPH TEST ************ JOSEPH TEST ************English new uuid:' . $uuid);
          return $uuid;
        }
        // @todo remove this
        return $returnCode;
      }
    }
    elseif ($lang == 'fr') {
      if (!static::menuExternalLinkExists($titleFr, $external_linkFr, $menu_name, $ts_nid, 'fr') && gettype(static::legacyMenuLinkExists($menu_name, $ts_pnid, 'en')) == 'string') {
        $parentUuid = static::legacyMenuLinkExists($menu_name, $ts_pnid, 'en');
        if (gettype($parentUuid) == 'boolean') {
          $parentUuid = static::legacyMenuLinkExists($menu_name, $ts_pnid, $lang);
        }
        $menu_attributes = [
          'title' => $titleFr,
          'link' => ['uri' => $external_linkFr],
          'menu_name' => $menu_name,
          'target' => '_blank',
          'expanded' => TRUE,
          'parent' => 'menu_link_content:' . $parentUuid,
          'external' => TRUE,
          'bundle' => 'menu_link_content',
          'status' => TRUE,
          'langcode' => $lang,
        ];
        if (gettype($parentUuid) == 'boolean') {
          unset($menu_attributes['parent']);
        }
        static::addToLog('********** JOSEPH TEST ************just before create French menu link');
        $menu_link = MenuLinkContent::create($menu_attributes);
        $options['attributes']['class'] = ['french-only legacy-external-link'];
        $menu_link->link->options = $options;
        $returnCode = $menu_link->save();
        if ($returnCode) {
          $id = $menu_link->id();
          $uuid = static::getUuidFromId($id, $lang);
          static::updateTsNid($id, $ts_nid, $lang);
          static::updateTsPnid($id, $ts_pnid, $lang);
          // static::updateDcrId($id, $dcr_id, $lang); // dcr_id is not numeric for external legacy sitemap menu links.
          static::addToLog('******** JOSEPH TEST ************French new menu link with uuid:' . $uuid);
        }
        if ($returnCode) {
          $uuid = static::getUuidFromId($id, $lang);
          return $uuid;
        }
        // @todo remove this
        return $returnCode;
      }
    }
    return FALSE;
  }

  /**
   * Creates an internal legacy menu link (used during import initially, probably no longer needed).
   */
  public static function createInternalLegacyMenuLink($nid, $ts_nid, $ts_pnid, $dcr_id, $menu_name = 'sidebar', $lang = 'en', $title_en = NULL, $title_fr = NULL, $disable_menu_link = FALSE) {
    static::addToLog(__function__ . ' : ' . $lang);
    // @todo add description.
    // $lang = static::getLang();
    // $lang = 'en'; // default to 'en' for now.
    if ($nid > 0 && $lang == 'en') {
      if (!static::menuLinkExists($nid, $menu_name)) {
        $status = TRUE;
        if ($disable_menu_link) {
          $status = FALSE;
        }
        $node = Node::load($nid);
        $title = !isset($title_en) ? $node->getTitle() : $title_en;
        $parentUuid = static::legacyMenuLinkExists($menu_name, $ts_pnid, $lang);
        if (gettype($parentUuid) != 'string') {
          // Importing a teamsite content that has no ts_pnid , only a ts_nid.
          $parentUuid = static::legacyMenuLinkExists($menu_name, $ts_nid, $lang);
        }
        $menu_attributes = [
          'title' => $title,
          'link' => ['uri' => 'entity:node/' . $nid],
          'menu_name' => $menu_name,
          'parent' => 'menu_link_content:' . $parentUuid,
          'expanded' => TRUE,
          'external' => FALSE,
          'bundle' => 'menu_link_content',
          'status' => $status,
          'langcode' => $lang,
        ];
        if ($menu_name == 'sidebar') {
          $menu_attributes['expanded'] = FALSE;
        }
        // static::addToLog('en menu_attributes["parent"]=' . $menu_attributes['parent']);.
        if (gettype($parentUuid) == 'boolean') {
          unset($menu_attributes['parent']);
        }
        $menu_link = MenuLinkContent::create($menu_attributes);
        $returnCode = $menu_link->save();
        $titleFr = !isset($title_fr) ? $node->getTranslation('fr')->getTitle() : $title_fr;
        if (!$menu_link->hasTranslation('fr') && !empty($titleFr)) {
          $menu_link->addTranslation('fr', ['title' => $titleFr]);
          static::addToLog(__function__ . '** JOSEPH TEST ************added french translation for menu title=' . $titleFr);
          $returnCode = $menu_link->save();
          // No need to update the ts_nid/ts_pnid/dcr_id for the translation of internal links.
          // The menu link is english even for links that are translated.
        }
        if ($returnCode) {
          $id = $menu_link->id();
          $uuid = static::getUuidFromId($id, $lang);
          static::updateTsNid($id, $ts_nid, $lang);
          static::updateTsPnid($id, $ts_pnid, $lang);
          // dcr_id is numeric for internal legacy sitemap menu links.
          static::updateDcrId($id, $dcr_id, $lang);
        }
        return $returnCode;
      }
      else {
        static::addToLog(__function__ . ' link for nid=' . $nid . ' or ts_nid=' . $ts_nid . ' already exists ************English');
      }
    }
    // No french internal links, they are translated instead.
    return FALSE;
  }

  /**
   * Create the first menu item during import.
   */
  public static function createTopLevelInternalMenuItem($nid, $menu_name = 'sidebar', $ts_nid = NULL, $ts_pnid = NULL, $dcr_id = NULL, $title_en = NULL, $title_fr = NULL) {
    static::addToLog(__function__);
    // Load main navigation menu link for nid, find the parent nid, then look up the menu link
    // in the sidebar with that nid, that will be the parent of this new sidebar link.
    $node = Node::load($nid);
    $lang = static::getLang();
    $expanded = TRUE;
    if ($menu_name == 'sidebar') {
      $expanded = FALSE;
    }
    if ($lang == 'en') {
      if (!static::menuLinkExists($nid, $menu_name)) {
        $title = !isset($title_en) ? $node->getTitle() : $title_en;
        // $parentId = static::getMenuIdFromUuid($parentUuid);
        $menu_link = MenuLinkContent::create([
          'title' => $title,
          'link' => ['uri' => 'entity:node/' . $nid],
          'menu_name' => $menu_name,
          'expanded' => $expanded,
          'external' => FALSE,
          'langcode' => $lang,
          'status' => TRUE,
        ]);
        $menu_link->save();
        if (!$menu_link->hasTranslation('fr')) {
          $title = !isset($title_fr) ? $node->getTranslation('fr')->getTitle() : $title_fr;
          $menu_link->addTranslation('fr', ['title' => $title]);
        }
        if ($returnCode && isset($ts_nid) && !empty($ts_nid)) {
          $id = $menu_link->id();
          $uuid = static::getUuidFromId($id, $lang);
          static::updateTsNid($id, $ts_nid, $lang);
          static::updateTsPnid($id, $ts_pnid, $lang);
          // dcr_id is numeric for internal legacy sitemap menu links.
          static::updateDcrId($id, $dcr_id, $lang);
        }
        $returnCode = $menu_link->save();
        return $returnCode;
      }
    }
    return FALSE;
  }

  /**
   * Create a child item of a landing page most likely.
   */
  public static function createChildOfParentNid($nid, $menu_name, $parentNid, $parentUuid, $disable_menu_link = FALSE) {
    if (is_null($menu_name) || empty($menu_name)) {
      // Makes this function PHP 8.0 compatible.
      $menu_name = 'sidebar';
    }
    static::addToLog(__function__);
    // Load main navigation menu link for nid, find the parent nid, then look up the menu link
    // in the sidebar with that nid, that will be the parent of this new sidebar link.
    $status = TRUE;
    if ($disable_menu_link) {
      $status = FALSE;
    }
    $node = Node::load($nid);
    $lang = static::getLang();
    if ($lang == 'en') {
      if (!static::menuLinkExists($nid, $menu_name)) {
        $title = $node->getTitle();

        $parentUuid = static::getMenuUuidFromNidAndMenuName($parentNid, $menu_name);
        // $parentId = static::getMenuIdFromUuid($parentUuid);
        $menu_link = MenuLinkContent::create([
          'title' => $title,
          'link' => ['uri' => 'entity:node/' . $nid],
          'menu_name' => $menu_name,
          'expanded' => TRUE,
          'external' => FALSE,
          'langcode' => $lang,
          'status' => $status,
          'parent' => 'menu_link_content:' . $parentUuid,
        ]);
        $menu_link->save();
        if (!$menu_link->hasTranslation('fr')) {
          $title = $node->getTranslation('fr')->getTitle();
          $menu_link->addTranslation('fr', ['title' => $title]);
        }
        return $menu_link->save();
      }
    }
    return FALSE;
  }

  /**
   * Disable a menu link id, used for hiding menu items simplifying UI for internal pages.
   */
  public static function disableMenuLink($id = NULL, $nid = NULL, $menu_name = 'sidebar', $force = FALSE) {
    $debug = FALSE;

    if (isset($id) && !empty($id)) {
      $menu_link = \Drupal::entityTypeManager()->getStorage('menu_link_content')->load($id);
      static::addToLog($id, $debug);
      if (isset($menu_link) && is_object($menu_link)) {
        if ($menu_link->getMenuName() == $menu_name) {
          $menu_link->set('enabled', FALSE);
          $menu_link->save();
          if ($menu_link->isEnabled()) {
            static::addToLog('enabled', $debug);
          }
          else {
            static::addToLog('disabled', $debug);
          }
        }
      }
    }
    if (!isset($menu_link) && isset($nid) && is_numeric($nid)) {
      $menu_link_manager = \Drupal::service('plugin.manager.menu.link');
      $result = $menu_link_manager->loadLinksByRoute('entity.node.canonical', ['node' => $nid]);
      foreach ($result as $menu_item) {
        if (is_object($menu_item)) {
          $id = $menu_item->getPluginDefinition()['metadata']['entity_id'];
          static::addToLog($id, $debug);
          $menu_link = \Drupal::entityTypeManager()->getStorage('menu_link_content')->load($id);
          if ($force || ($menu_link->getMenuName() == $menu_name && $menu_name != 'sidebar')) {
            $options = $menu_link->link->options;
            if ($menu_link->isEnabled() && empty($options['attributes']['class'])) {
              $options['attributes']['class'] = ['basic-page-link'];
              $menu_link->link->options = $options;
              $menu_link->save();
            }
            static::addToLog('disabling ' . $menu_name . ' link for menu link id=' . $id, $debug);
            $menu_link->set('enabled', FALSE);
            $menu_link->save();
            $options = $menu_link->link->options;
          }
          if ($menu_link->getMenuName() == 'sidebar') {
            $options = $menu_link->link->options;
            if (empty($options['attributes']['class'])) {
              $options['attributes']['class'] = ['basic-page-link'];
              $menu_link->link->options = $options;
              $menu_link->save();
            }
          }
        }
      }
    }

  }

  /**
   * Translate a link using the node title translated value if none exist.
   */
  public static function translateLinkIfNotTranslated($nid, $menu_name = 'sidebar') {

    $menu_link_ids = [];
    $menu_link_manager = \Drupal::service('plugin.manager.menu.link');
    $result = $menu_link_manager->loadLinksByRoute('entity.node.canonical', ['node' => $nid]);
    $node = NULL;
    foreach ($result as $menu_item) {
      if (is_object($menu_item)) {
        $otherLang = static::getOtherLang();
        $id = $menu_item->getPluginDefinition()['metadata']['entity_id'];
        $menu_link = \Drupal::entityTypeManager()->getStorage('menu_link_content')->load($id);
        if (!$menu_link->hasTranslation($otherLang)) {
          $node = Node::load($nid);
          if (isset($node) && !is_null($node)) {
            if ($node->hasTranslation($otherLang)) {
              $title = $node->getTranslation($otherLang)->getTitle();
              $menu_link->addTranslation($otherLang, ['title' => $title]);
              $menu_link->save();
              if ($menu_link->getMenuName() == 'sidebar') {
                // Only return ids from the 'sidebar' menu link.
                $menu_link_ids[] = $id;
                static::addToLog($id, TRUE);
              }
            }
          }
        }
      }
    }
    return $menu_link_ids;
  }

  /**
   * Self explanatory, find parent item of a node by nid.
   */
  public static function findParentOfNid($nid, $menu_name, &$parentUuid, &$parentUuidClean) {
    static::addToLog(__function__);
    if (is_null($menu_name) || empty($menu_name)) {
      // Makes this function PHP 8.0 compatible.
      $menu_name = 'sidebar';
    }
    $parentMenuLink = NULL;

    $menu = \Drupal::entityTypeManager()->getStorage('menu_link_content')
      ->loadByProperties(['menu_name' => $menu_name]);

    $linkNodeId = '';
    foreach ($menu as $item) {
      $route = '';
      if ($item->getUrlObject()->isRouted()) {
        $route = $item->getUrlObject()->getRouteName();
      }
      if ('entity.node.canonical' == $route && $item->getUrlObject()->isRouted()) {
        $params = $item->getUrlObject()->getRouteParameters();
        $linkNodeId = $params['node'];

        if ($linkNodeId == $nid) {
          $parentMenuLinkId = $item->getParentId();
          static::addToLog(__function__ . ' parentId=' . $parentMenuLinkId);
          $storage = \Drupal::entityTypeManager()->getStorage('menu_link_content');
          $newUuid = str_replace('menu_link_content:', '', $parentMenuLinkId);
          $parentLink = $storage->loadByProperties([
            'uuid' => $newUuid,
          ]);
          $parentLink = reset($parentLink);
          $route = '';
          if ($item->getUrlObject()->isRouted()) {
            $route = $item->getUrlObject()->getRouteName();
          }
          if (isset($parentLink) && !empty($parentLink) && 'entity.node.canonical' == $route && $item->getUrlObject()->isRouted()) {
            $parentParams = $parentLink->getUrlObject()->getRouteParameters();
            $parentLinkNodeId = $parentParams['node'];
            if (is_numeric($parentLinkNodeId)) {
              $parentUuid = $parentMenuLinkId;
              $parentUuidClean = $newUuid;
              return $parentLinkNodeId;
            }
          }
          else {
            $parentLinkNodeId = '';
          }
        }
      }
    } // End of foreach.
    return FALSE;
  }

  /**
   * Retrieve the latest revision if it is a draft.
   *
   * $nid (int)
   *   Node id.
   * $vid (int)
   *   Revision id by reference.
   */
  public static function getLatestRevisionOnlyIfDraft($nid, &$vid) {
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $otherLang = 'fr';
    if ($lang == 'fr') {
      $otherLang = 'en';
    }
    $latestRevisionResult = \Drupal::entityTypeManager()->getStorage('node')->getQuery()
      ->accessCheck(FALSE)
      ->latestRevision()
      ->condition('nid', $nid, '=')
      ->execute();
    if (count($latestRevisionResult)) {
      $node_revision_id = key($latestRevisionResult);
      if ($node_revision_id == $vid) {
        // There is no pending revision, the current revision is the latest.
        return FALSE;
      }
      $vid = $node_revision_id;
      $latestRevision = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($node_revision_id);
      if ($latestRevision->language()->getId() != $lang) {
        $latestRevision = $latestRevision->getTranslation($lang);
      }
      $moderation_state = $latestRevision->get('moderation_state')->getString();
      if ($moderation_state == 'draft') {
        return $latestRevision;
      }
    }
    return FALSE;
  }

  /**
   * Generates an unpublished hash link to access unpublished content.
   */
  public static function getHashTag($entity, $lang) {
    $tokenUrl = '';
    $manager = \Drupal::service('access_unpublished.access_token_manager');
    $tokens = '';
    $tokens = $manager->getAccessTokensByEntity($entity, 'active');
    $keys = array_map(function (AccessToken $token) {
      return $token->get('value')->value;
    }, $tokens);
    if (empty($keys) || count($keys) < 1) {
      $sevenDays = 604800;
      // Create tokens for the entity.
      $token = AccessToken::create([
        'entity_type' => $entity->getEntityType()->id(),
        'entity_id' => $entity->id(),
        'expire' => \Drupal::time()->getRequestTime() + $sevenDays,
      ]);
      $token->save();
      $keys = [$token->get('value')->value];
    }
    $countKeys = count($keys);
    $hashToken = '';
    if ($countKeys > 0) {
      $hashToken = [];
      foreach ($keys as $key) {
        $hashToken[] = $key;
      }
      if (isset($hashToken[$countKeys - 1])) {
        $hashToken = $hashToken[$countKeys - 1];
      }
      else {
        $hashToken = '';
      }
    }
    if (isset($hashToken) && strlen($hashToken) > 5) {
      $accessTokenManager = \Drupal::service('access_unpublished.access_token_manager');
      $token = $accessTokenManager->getActiveAccessToken($entity);
      if ($token) {
        $absolute = FALSE;
        $tokenUrl = $accessTokenManager->getAccessTokenUrl($token, $lang, $absolute);
      }
    }
    return $tokenUrl;
  }

  /**
   * Retrieve the latest revision if possible.
   *
   * $nid (int)
   *   Node id.
   * $vid (int)
   *   Revision id by reference.
   */
  public static function getLatestRevision($nid, &$vid) {
    $lang = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $otherLang = 'fr';
    if ($lang == 'fr') {
      $otherLang = 'en';
    }
    $latestRevisionResult = \Drupal::entityTypeManager()->getStorage('node')->getQuery()
      ->accessCheck(FALSE)
      ->latestRevision()
      ->condition('nid', $nid, '=')
      ->execute();
    if (count($latestRevisionResult)) {
      $node_revision_id = key($latestRevisionResult);
      if ($node_revision_id == $vid) {
        // There is no pending revision, the current revision is the latest.
        return FALSE;
      }
      $vid = $node_revision_id;
      $latestRevision = \Drupal::entityTypeManager()->getStorage('node')->loadRevision($node_revision_id);
      if ($latestRevision->language()->getId() != $lang) {
        $latestRevision = $latestRevision->getTranslation($lang);
      }
      $moderation_state = $latestRevision->get('moderation_state')->getString();
      return $latestRevision;
    }
    return FALSE;
  }

  /**
   * Used by the special title and large mode for inserting a topic summary on internal pages for AAFC.
   */
  public static function getSampleTopicImageUuidAndEntityId(&$uuid, &$entity_id) {
    // static::addToLog(__function__);
    $database = \Drupal::database();
    $sql = "select fid, uuid from file_managed where uri like :filename_pattern";
    $result = $database->query($sql, [':filename_pattern' => '%pecial_title520x200.png']);
    $fid = 0;
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        if (!isset($row['fid']) || is_null($row['fid'])) {
          return FALSE;
        }
        $uuid = $row['uuid'];
        $fid = $row['fid'];
      }
    }
    $sql = "select entity_id from media__image where image_target_id = :fid";
    $result = $database->query($sql, [':fid' => $fid]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        if (!isset($row['entity_id']) || is_null($row['entity_id'])) {
          return FALSE;
        }
        $entity_id = $row['entity_id'];
      }
    }
    $sql = "select uuid from media where mid = :entity_id";
    $result = $database->query($sql, [':entity_id' => $entity_id]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        if (!isset($row['uuid']) || is_null($row['uuid'])) {
          return FALSE;
        }
        $uuid = $row['uuid'];
      }
    }
    return TRUE;
  }


  /**
   * Used for example campaign images but this method is generic can be used elsewhere.
   */
  public static function getCampaignImageUuidAndEntityId(&$uuid, &$entity_id, $filename_pattern) {
    if (empty($filename_pattern)) {
      return FALSE;
    }
    $filename_pattern = '%' . $filename_pattern;
    static::addToLog(__function__);
    static::addToLog($filename_pattern . ' search');
    $database = \Drupal::database();
    $sql = "select fid, uuid from file_managed where uri like :filename_pattern";
    $result = $database->query($sql, [':filename_pattern' => $filename_pattern]);
    $fid = 0;
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        if (!isset($row['fid']) || is_null($row['fid'])) {
          return FALSE;
        }
        $uuid = $row['uuid'];
        $fid = $row['fid'];
      }
    }
    $sql = "select entity_id from media__image where image_target_id = :fid";
    $result = $database->query($sql, [':fid' => $fid]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        if (!isset($row['entity_id']) || is_null($row['entity_id'])) {
          return FALSE;
        }
        $entity_id = $row['entity_id'];
      }
    }
    $sql = "select uuid from media where mid = :entity_id";
    $result = $database->query($sql, [':entity_id' => $entity_id]);
    if ($result) {
      while ($row = $result->fetchAssoc()) {
        if (!isset($row['uuid']) || is_null($row['uuid'])) {
          return FALSE;
        }
        $uuid = $row['uuid'];
      }
    }
    if (empty($uuid) || empty($fid) || empty($entity_id)) {
      return FALSE;
    }
    return TRUE;
  }

}
