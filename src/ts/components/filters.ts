import { IView, ViewFilm } from '../view/view-interface';
import { createNode } from '../utils/create-node';
import { constants } from '../utils/constants';

type FiltersType = 'watchlist' | 'history' | 'favorite';

export class Filters {
  private view: IView;

  private node!: DocumentFragment;

  constructor(view: IView) {
    this.view = view;
    this.createMarkup();
  }

  private filterFilms(filterType: FiltersType): ViewFilm[] {
    const names = {
      watchlist: 'inWatchList' as const,
      history: 'itWatched' as const,
      favorite: 'itFavorite' as const,
    };

    const films = this.view.getFilms();

    return films.filter((viewFilm) => viewFilm.film.card[names[filterType]]);
  }

  private createMarkup(): void {
    const fragment = document.createDocumentFragment();

    const template = `
      <a href="#all" data-type="all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" data-type="watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${this.filterFilms('watchlist').length}</span></a>
      <a href="#history" data-type="history" class="main-navigation__item">History <span class="main-navigation__item-count">${this.filterFilms('history').length}</span></a>
      <a href="#favorites" data-type="favorite" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${this.filterFilms('favorite').length}</span></a>
    `;

    const node = createNode('div', {
      classNames: [constants.CLASSES.MAIN_PAGE.FILTERS_CONTAINER],
    });

    node.innerHTML = template;

    const stat = createNode('a', {
      classNames: [constants.CLASSES.MAIN_PAGE.STATS],
    });
    stat.textContent = 'Stats';

    fragment.appendChild(node);
    fragment.appendChild(stat);

    this.node = fragment;
  }

  public get element(): DocumentFragment {
    return this.node;
  }
}
