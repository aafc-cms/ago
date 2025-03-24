<?php

namespace Drupal\wxt_overrides\Plugin\Filter;

use Drupal\filter\FilterProcessResult;
use Drupal\filter\Plugin\FilterBase;

/**
 * Fixes split <span> + <a> tags caused by CKEditor5.
 *
 * @Filter(
 *   id = "span_link_fix_filter",
 *   title = @Translation("Fix CKEditor5 split span/link issue"),
 *   description = @Translation("Merges text/link into one span to fix GC Steps."),
 *   type = Drupal\filter\Plugin\FilterInterface::TYPE_TRANSFORM_IRREVERSIBLE,
 *   weight = 100,
 *   provider = "wxt_overrides",
 *   settings = {}
 * )
 */
class SpanLinkFixFilter extends FilterBase {

  /**
   * {@inheritdoc}
   */
  public function process($text, $langcode) {
    $pattern = '#<span class="list-group-item">([^<]+)</span>\s*<a([^>]+)><span class="list-group-item">([^<]+)</span></a>#i';

    $text = preg_replace_callback($pattern, function ($matches) {
      $before_text = $matches[1];         // The text in the first span
      $link_attrs = $matches[2];          // All attributes in the <a>
      $link_text = $matches[3];           // The text inside the second span

      return '<span class="list-group-item">' . $before_text . '<a' . $link_attrs . '>' . $link_text . '</a></span>';
    }, $text);

    return new FilterProcessResult($text);
  }

}
