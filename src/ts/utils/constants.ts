export const constants = {
  CLASSES: {
    FILTERS: {
      ITEM: 'main-navigation__item',
      COUNTER: 'main-navigation__item-count',
      ACTIVE: 'main-navigation__item--active',
    },
    MAIN_PAGE: {
      FILMS_CONTAINER: 'films-list__container',
      FILMS_EXTRA: 'films-list--extra',
      SHOW_BUTTON: 'films-list__show-more',
      SORT: 'sort',
      SORT_BUTTON: 'sort__button',
      SORT_ACTIVE: 'sort__button--active',
      STATS: 'main-navigation__additional',
      FILTERS: 'main-navigation',
      FILTERS_CONTAINER: 'main-navigation__items',
      NAVIGATION_CONTAINER: 'main-navigation',
      PROFILE_RATING: 'profile__rating',
      FILMS_QUANTITY: 'footer__statistics',
    },
    FILM_POPUP: {
      TITLE: 'film-details__title',
      ALTERNATIVE_TITLE: 'film-details__title-original',
      RATING: 'film-details__total-rating',
      INFO_CELL: 'film-details__cell',
      DESCRIPTION: 'film-details__film-description',
      CHECKBOX: 'film-details__control-input',
      AGE_RATING: 'film-details__age',
      COMMENTS_COUNT: 'film-details__comments-count',
      COMMENTS_LIST: 'film-details__comments-list',
      NEW_COMMENT: 'film-details__new-comment',
      CLOSE_BUTTON: 'film-details__close-btn',
      CONTROLLS: 'film-details__controls',
      WATCHED: 'film-details #watched',
      WATCHLIST: 'film-details #watchlist',
      FAVORITE: 'film-details #favorite',
    },
    ACTIVE_CLASS: 'film-card__controls-item--active',
  },
  FILTERS_TYPE: {
    all: 'all' as const,
    watchlist: 'inWatchList' as const,
    history: 'itWatched' as const,
    favorite: 'itFavorite' as const,
  },
  PROFILE_STATUS: {
    NOVICE: 'Novice',
    FAN: 'Fan',
    MOVIE_BUFF: 'Movie Buff',
  },
};
