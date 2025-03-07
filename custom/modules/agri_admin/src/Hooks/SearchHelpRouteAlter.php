<?php

namespace Drupal\agri_admin\Hooks;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\Route;
use Drupal\Core\Logger\LoggerChannelFactoryInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Alters routes to conditionally add 'search.view_help_search'.
 */
final class SearchHelpRouteAlter extends RouteSubscriberBase {

  /**
   * The logger service.
   *
   * @var \Drupal\Core\Logger\LoggerChannelInterface
   */
  protected $logger;

  /**
   * Constructor.
   */
  public function __construct(LoggerChannelFactoryInterface $logger_factory) {
    $this->logger = $logger_factory->get('agri_admin');
  }

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    $this->logger->notice('alterRoutes() executed.');

    // Check if the route exists within the collection itself.
    if (!$collection->get('search.view_help_search')) {
      $this->logger->notice('Adding search.view_help_search route.');

      $route = new Route(
        '/search/help',
        [
          '_controller' => '\Drupal\agri_admin\Controller\SearchHelpController::helpPage',
          '_title' => 'Search Help',
        ],
        [
          '_permission' => 'access content',
        ]
      );

      // Add the new route to the collection.
      $collection->add('search.view_help_search', $route);
      $this->logger->notice('Route search.view_help_search has been added.');
    }
    else {
      $this->logger->notice('search.view_help_search route already exists.');
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents(): array {
    return parent::getSubscribedEvents();
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('logger.factory')
    );
  }
}

