import { bind } from 'bind-decorator';
import { IView, ViewFilm } from '../view/view-interface';
import { Observable } from '../utils/observable';
import { constants } from '../utils/constants';

type SortNodeMap = {
  default: Element,
  date: Element,
  rating: Element,
};

type SortType = 'default' | 'date' | 'rating';

export class Sort extends Observable {
  private view: IView;

  private nodeMap!: SortNodeMap;

  constructor(view: IView) {
    super();
    this.view = view;
    this.cacheNodeMap();
    document.querySelector(`.${constants.CLASSES.MAIN_PAGE.SORT}`)?.addEventListener('click', this.sortButtonHandler);
  }

  private cacheNodeMap(): void {
    const sortButtons = document.querySelectorAll(`.${constants.CLASSES.MAIN_PAGE.SORT} a`)!;
    this.nodeMap = {
      default: sortButtons[0],
      date: sortButtons[1],
      rating: sortButtons[2],
    };
  }

  private sortFilms(sortType: SortType): ViewFilm[] {
    const type = sortType === 'date' ? 'date' : 'rating';
    const films = this.view.getFilteredFilms();
    if (sortType === 'default') {
      return films.sort(() => Math.random() - 0.5);
    }

    return films.sort((a, b) => b.film.card[type] - a.film.card[type]);
  }

  @bind
  private sortButtonHandler(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (!target.classList.contains(constants.CLASSES.MAIN_PAGE.SORT_BUTTON)) {
      return;
    }

    const sortType = target.dataset.type as SortType;

    const sortedFilms = this.sortFilms(sortType);

    this.switchActiveSort(sortType);

    this.notify('sortClicked', {
      films: sortedFilms,
      isFilterClick: false,
    });
  }

  public switchActiveSort(sortType: SortType): void {
    Object.keys(this.nodeMap).forEach((key) => {
      const keyName = key as SortType;
      const item = this.nodeMap[keyName];

      if (keyName === sortType) {
        item.classList.add(constants.CLASSES.MAIN_PAGE.SORT_ACTIVE);
      } else {
        item.classList.remove(constants.CLASSES.MAIN_PAGE.SORT_ACTIVE);
      }
    });
  }
}
