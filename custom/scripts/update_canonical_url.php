<?php

  $config = \Drupal::config('system.site');
  $front_uri = $config->get('page.front');
  echo "front_uri (home page)=" . $front_uri;
  $nid = str_replace('/node/', '', $front_uri); 
  echo "\n";
  echo "nid=$nid";
  echo "\n";

  $node = \Drupal::entityTypeManager()->getStorage('node')->load($nid);
  $metatags = unserialize($node->get('field_meta_tags')->value);
  if (!isset($metatags['canonical_url'])) {
    echo "ORIG: \nhttps://agriculture.canada.ca" . $node->toUrl()->toString();
  }
  else {
    echo "ORIG: " . $metatags['canonical_url'];
  }
  echo "\n";
  $metatags['canonical_url'] = 'https://agriculture.canada.ca/en';
  echo "NEW:\n";
  echo $metatags['canonical_url'];
  echo "\n";
  $node->set('field_meta_tags', serialize($metatags));
  $node->save();

  $node_fr = $node->getTranslation('fr');
  $metatags_fr = unserialize($node_fr->get('field_meta_tags')->value);
  if (!isset($metatags_fr['canonical_url'])) {
    echo "ORIG FR: \nhttps://agriculture.canada.ca" . $node_fr->toUrl()->toString();
  }
  else {
    echo "ORIG FR: " . $metatags_fr['canonical_url'];
  }
  echo "\n";
  $metatags_fr['canonical_url'] = 'https://agriculture.canada.ca/fr';
  echo "NEW:\n";
  echo $metatags_fr['canonical_url'];
  echo "\n";
  $node_fr->set('field_meta_tags', serialize($metatags_fr));
  $node_fr->save();

