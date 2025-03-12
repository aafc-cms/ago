/**
 * @file
 * DataTable customizations for AAFC.
 */

(function (Drupal, once) {
  Drupal.behaviors.removeAriaPressed = {
    attach: function (context, settings) {
      $(document).on("wb-ready.wb-tables wb-updated.wb-tables", function (event) {
        var table = $(event.target);

        // Ensure the pagination element exists
        once('remove-aria-pressed', '.dataTables_paginate .pagination', context).forEach((pagination) => {
          pagination.querySelectorAll('.paginate_button').forEach((button) => {
            button.removeAttribute('aria-pressed');
          });
        });
      });
    }
  };
})(Drupal, once);

