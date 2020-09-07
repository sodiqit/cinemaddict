import { bind } from 'bind-decorator';
import { IView, ViewFilm } from '../view/view-interface';
import { createNode } from '../utils/create-node';
import { constants } from '../utils/constants';
import { Observable } from '../utils/observable';

type FiltersType = 'watchlist' | 'history' | 'favorite' | 'all';

type NodeMap = {
  all: {
    item: Element,
    counter: Element
  },
  watchlist: {
    item: Element,
    counter: Element
  },
  favorite: {
    item: Element,
    counter: Element
  },
  history: {
    item: Element,
    counter: Element
  },
};

class Filters extends Observable {
  private view: IView;

  private node!: DocumentFragment;

  private nodeMap!: NodeMap;

  constructor(view: IView) {
    super();
    this.view = view;
    this.createMarkup();
  }

  @bind
  private filterHandler(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (!target.classList.contains(constants.CLASSES.FILTERS.ITEM)) {
      return;
    }
    const filterType = target.dataset.type as FiltersType;
    const filteredFilms = this.filterFilms(filterType);

    this.switchActiveFilter(filterType);

    this.notify('filterClicked', {
      films: filteredFilms,
      activeFilter: filterType,
    });
  }

  private switchActiveFilter(filterName: FiltersType): void {
    Object.keys(this.nodeMap).forEach((key) => {
      const keyName = key as FiltersType;
      const { item } = this.nodeMap[keyName];

      if (keyName === filterName) {
        item.classList.add(constants.CLASSES.FILTERS.ACTIVE);
      } else {
        item.classList.remove(constants.CLASSES.FILTERS.ACTIVE);
      }
    });
  }

  private filterFilms(filterType: FiltersType): ViewFilm[] {
    const names = {
      watchlist: 'inWatchList' as const,
      history: 'itWatched' as const,
      favorite: 'itFavorite' as const,
    };

    const films = this.view.getFilms();

    if (filterType === 'all') {
      return films;
    }

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

    node.addEventListener('click', this.filterHandler);

    const [all, watchlist, history, favorite] = Array.from(this.node.querySelectorAll(`.${constants.CLASSES.FILTERS.ITEM}`)!);

    this.nodeMap = {
      all: {
        item: all,
        counter: all.querySelector(`.${constants.CLASSES.FILTERS.COUNTER}`)!,
      },
      watchlist: {
        item: watchlist,
        counter: watchlist.querySelector(`.${constants.CLASSES.FILTERS.COUNTER}`)!,
      },
      history: {
        item: history,
        counter: history.querySelector(`.${constants.CLASSES.FILTERS.COUNTER}`)!,
      },
      favorite: {
        item: favorite,
        counter: favorite.querySelector(`.${constants.CLASSES.FILTERS.COUNTER}`)!,
      },
    };
  }

  public get element(): DocumentFragment {
    return this.node;
  }

  public update(): void {
    Object.keys(this.nodeMap).forEach((key) => {
      const keyName = key as FiltersType;
      if (key === 'all') {
        return;
      }
      this.nodeMap[keyName].counter.textContent = this.filterFilms(keyName).length.toString();
    });
  }
}

export {
  Filters,
  FiltersType,
};
