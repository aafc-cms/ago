<?php

namespace Drupal\agri_admin\Service;

use Drupal\entity_print\FilenameGenerator;
use Drupal\Component\Transliteration\TransliterationInterface;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Drupal\Core\Entity\EntityInterface;

class DecoratedFilenameGenerator extends FilenameGenerator {

  protected $decorated;

  public function __construct(FilenameGenerator $decorated, TransliterationInterface $transliteration, EventDispatcherInterface $event_dispatcher) {
    parent::__construct($transliteration, $event_dispatcher);
    $this->decorated = $decorated;
  }

  /**
   * {@inheritdoc}
   */
  public function generateFilename(array $entities, callable $entity_label_callback = NULL) {
    // Call the original service to generate the default filename.
    $default_filename = $this->decorated->generateFilename($entities, $entity_label_callback);

    // Extract the Program name from the default_filename and set it as the custom_filename.
    $pos1 = stripos($default_filename, '-');
    if($pos1 == 0) {
      return $default_filename;
    }
    $custom_filename = trim(substr($default_filename,0,$pos1));

    $pos1 = stripos($custom_filename, 'Step');
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Applicant guide');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Resources');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'For lenders');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Frequently asked questions');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Contact information');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Annex ');
    }

    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Etape');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Guide du demandeur');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Ressources');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Pour les prêteurs');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Foire aux questions');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Pour nous joindre');
    }
    if($pos1 == 0) {
      $pos1 = stripos($custom_filename, 'Annexe ');
    }

    if($pos1 == 0) {
      return $custom_filename;
    } 
    else {
      $custom_filename = trim(substr($custom_filename,0,$pos1));
      return $custom_filename;
    }
  }
}