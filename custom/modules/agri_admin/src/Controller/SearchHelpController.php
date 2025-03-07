<?php

namespace Drupal\agri_admin\Controller;

use Symfony\Component\HttpFoundation\Response;

/**
 * Provides a controller for the search help page.
 */
class SearchHelpController {

  /**
   * Returns a simple response with "Empty".
   */
  public function helpPage() {
    return new Response('Empty');
  }

}

