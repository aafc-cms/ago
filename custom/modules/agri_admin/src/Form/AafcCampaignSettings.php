<?php

namespace Drupal\agri_admin\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure AAFC Agri Admin settings for this site.
 */
class AafcCampaignSettings extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'agri_admin_settings_aafc';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['agri_admin.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['campaign_footer_branding'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable campaign branding links in the lower footer globally on all campaign pages in both languages'),
      '#description' => $this->t('When campaign mode is enabled if this option is enabled the bottom most branding footer links will show up.'),
      '#default_value' => $this->config('agri_admin.settings')->get('campaign_footer_branding'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if (!is_bool((bool) $form_state->getValue('campaign_footer_branding'))) {
      $form_state->setErrorByName('campaign_footer_branding', $this->t('The value is not correct.'));
    }
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('agri_admin.settings')
      ->set('campaign_footer_branding', $form_state->getValue('campaign_footer_branding'))
      ->save();
    parent::submitForm($form, $form_state);
  }

}
