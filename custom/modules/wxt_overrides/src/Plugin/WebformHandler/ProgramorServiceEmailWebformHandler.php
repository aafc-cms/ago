<?php 
namespace Drupal\wxt_overrides\Plugin\WebformHandler;

use Drupal\webform\Plugin\WebformHandler\EmailWebformHandler;
use Drupal\webform\WebformSubmissionInterface;
use Drupal\taxonomy\Entity\Term;

/**
 * Emails a webform submission.
 *
 * @WebformHandler(
 *   id = "programservice_submit_feedback_email",
 *   label = @Translation("Program Or Service Submit_Feedback email"),
 *   category = @Translation("Notification"),
 *   description = @Translation("Sends a webform submit feedback submission to a different email address per Program or Service."),
 *   cardinality = \Drupal\webform\Plugin\WebformHandlerInterface::CARDINALITY_UNLIMITED,
 *   results = \Drupal\webform\Plugin\WebformHandlerInterface::RESULTS_PROCESSED,
 * )
 */
class ProgramorServiceEmailWebformHandler extends EmailWebformHandler {

  public function sendMessage(WebformSubmissionInterface $webform_submission, array $message) {
    //get the PS Id from selection list
    $term_id = $webform_submission->getElementData('programorservice');
    $term = Term::load($term_id);
    //retrieve To email address associated with this Program or Service
    $toemailaddr = $term->get('field_toemailaddress')->value ;
    $message['to_mail'] = $toemailaddr;
    parent::sendMessage($webform_submission, $message);
  }
}