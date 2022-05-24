<?php

namespace Drupal\wxt_overrides\Plugin\WebformHandler;

use Drupal\webform\Plugin\WebformHandler\EmailWebformHandler;
use Drupal\webform\WebformSubmissionInterface;

/**
 * Emails a webform submission.
 *
 * @WebformHandler(
 *   id = "gcweb_report_a_problem_email handler",
 *   label = @Translation("GCWeb Report A Problem Email Handler"),
 *   category = @Translation("Notification"),
 *   description = @Translation("Do not send a report-a-problem email to the general email account when the form is under attack."),
 *   cardinality = \Drupal\webform\Plugin\WebformHandlerInterface::CARDINALITY_UNLIMITED,
 *   results = \Drupal\webform\Plugin\WebformHandlerInterface::RESULTS_PROCESSED,
 * )
 */
class GCWebReportProblemEmailWebformHandler extends EmailWebformHandler {

  /**
   *
   */
  public function sendMessage(WebformSubmissionInterface $webform_submission, array $message) {
    // Get the submission answers.
    $webformId = $webform_submission->getWebform()->id();
    if ($webformId == 'gcweb_report_a_problem') {
      // serial id match Admin UI submission #
      $submissionId = $webform_submission->serial();
      $submissionInfo = 'submission #' . $submissionId;
      $p1 = $webform_submission->getElementData('problem1');
      $p2 = $webform_submission->getElementData('problem2');
      $p3 = $webform_submission->getElementData('problem3');
      $p4 = $webform_submission->getElementData('problem4');
      $p5 = $webform_submission->getElementData('problem5');
      $p6 = $webform_submission->getElementData('problem6');
      $p7 = $webform_submission->getElementData('problem7');
      $p8 = $webform_submission->getElementData('problem8');
      $p9 = $webform_submission->getElementData('problem9');
      $p10 = $webform_submission->getElementData('problem10');
      $p11 = $webform_submission->getElementData('problem11');
      $p12 = $webform_submission->getElementData('problem12');
      if (isset($p1) && isset($p2) && isset($p3) && isset($p4) && isset($p5) &&
        isset($p6) && isset($p7) && isset($p8) && isset($p9) && isset($p10) &&
        isset($p11) && isset($p12)) {
        if ($p1 == 0 && $p2 == 0 && $p3 == 0 && $p4 == 0 && $p5 == 0 &&
          $p6 == 0 && $p7 == 0 && $p8 == 0 && $p9 == 0 && $p10 == 0 &&
          $p11 == 0 && $p12 == 0) {
          $warningMsg = 'The email handler stops a potential threat from Report a Problem webform(' . $submissionInfo . ').';
          \Drupal::logger('webform-email-handler')->warning($warningMsg);
          $message['to_mail'] = NULL;
          return;
        }
        else {
          $logMsg = 'The email handler sends a report-a-problem email to ' . $message['to_mail'] . '(' . $submissionInfo . ').';
          \Drupal::logger('webform-email-handler')->notice($logMsg);
          return parent::sendMessage($webform_submission, $message);
        }
      }
      else {
        // An Error Case: We log an error.
        $errorMsg = 'It is an error case from Report a Problem webform(' . $submissionInfo . ').';
        \Drupal::logger('webform-email-handler')->error($errorMsg);
        $message['to_mail'] = NULL;
        return;
      }
    }
    else {
      // An Error Case: Wrong Webform email handler.
      $errorMsg = 'The Admin user configures a wrong webform email handler (' . $submissionInfo . ').';
      \Drupal::logger('webform-email-handler')->error($errorMsg);
      $message['to_mail'] = NULL;
      return;
    }
  }
}