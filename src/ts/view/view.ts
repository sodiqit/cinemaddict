import { bind } from 'bind-decorator';
import { IView, PageNodesMap, ViewFilm } from './view-interface';
import { IController } from '../controller/controller-interface';
import { FiltersType, SortType } from '../model/model-interface';
import { FilmCard } from '../components/film-card/film-card';
import { FilmPopup } from '../components/film-popup';
import { Sort } from '../components/sort';
import { Filters } from '../components/filters';
import { Observable } from '../utils/observable';
import { constants } from '../utils/constants';
import * as Formatter from '../utils/formatter';

class View extends Observable implements IView {
  private controller: IController;

  private pageNodesMap!: PageNodesMap;

  private films: ViewFilm[];

  private counter: number;

  private filters!: Filters;

  private sort!: Sort;

  private filteredFilms!: ViewFilm[];

  constructor(controller: IController) {
    super();
    this.controller = controller;
    this.cacheNodeMap();
    this.films = [];
    this.counter = 0;
    this.init();
  }

  private init(): void {
    this.pageNodesMap.filmListContainer.innerHTML = '<h2 class="films-list__title">Loading...</h2>';
    this.pageNodesMap.showMoreButton.addEventListener('click', this.showMoreHandler);
  }

  private cacheNodeMap(): void {
    const [topRatedContainer, mostCommentedContainer] = Array.from(document.querySelectorAll(`.${constants.CLASSES.MAIN_PAGE.FILMS_EXTRA} .${constants.CLASSES.MAIN_PAGE.FILMS_CONTAINER}`))!;
    const [topRatedTitle, mostCommentedTitle] = Array.from(document.querySelectorAll(`.${constants.CLASSES.MAIN_PAGE.FILMS_EXTRA} .${constants.CLASSES.MAIN_PAGE.FILMS_TITLE}`))!;
    const [topRated, mostCommented] = Array.from(document.querySelectorAll(`.${constants.CLASSES.MAIN_PAGE.FILMS_EXTRA}`))!;

    this.pageNodesMap = {
      filmListContainer: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.FILMS_CONTAINER}`)!,
      mostCommented: {
        mainNode: mostCommented,
        title: mostCommentedTitle,
        container: mostCommentedContainer,
      },
      topRated: {
        mainNode: topRated,
        title: topRatedTitle,
        container: topRatedContainer,
      },
      showMoreButton: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.SHOW_BUTTON}`)!,
      sort: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.SORT}`)!,
      filters: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.FILTERS}`)!,
      navigationContainer: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.NAVIGATION_CONTAINER}`)!,
      profileRating: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.PROFILE_RATING}`)!,
      filmsQuantity: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.FILMS_QUANTITY} p`)!,
    };
  }

  @bind
  private showMoreHandler(): void {
    this.renderFilms(5);

    if (this.counter >= this.filteredFilms.length) {
      this.counter = 0;
      const button = this.pageNodesMap.showMoreButton as HTMLElement;
      button.style.display = 'none';
    }
  }

  @bind
  private removePopup(id: string): void {
    const needFilm = this.films.filter((film) => film.id === id)[0];

    if (needFilm) {
      const { element } = needFilm.film.popup;
      element.style.animationDuration = '0.7s';
      element.style.animationName = 'hide';
      element.style.animationFillMode = 'forwards';
      element.style.transform = 'translate(3000px)';
      setTimeout(() => {
        element.remove();
      }, 700);
    }
  }

  @bind
  private renderPopup(id: string): void {
    const needFilm = this.films.filter((film) => film.id === id)[0];

    if (needFilm) {
      const { element } = needFilm.film.popup;
      element.style.animationDuration = '0.7s';
      element.style.animationName = 'show';
      element.style.animationFillMode = 'forwards';
      element.style.transform = 'translate(3000px)';
      document.body.appendChild(element);
    }
  }

  @bind
  private provideControllInfo(info: { id: string, name: string, value: boolean }): void {
    this.notify('controllUpdated', info);
  }

  @bind
  private provideFilterType(filterType: FiltersType): void {
    this.notify('filterClicked', filterType);
  }

  @bind
  private provideSortType(sortType: SortType): void {
    this.notify('sortClicked', sortType);
  }

  private cacheCards() {
    const films = this.controller.getData();

    films.forEach((film) => {
      const { id } = film;
      const formattedFilm = Formatter.formatDataForFilmCard(film);
      const filmCard = new FilmCard(formattedFilm);

      filmCard.subscribe(this.renderPopup, 'showPopup');
      filmCard.subscribe(this.provideControllInfo, 'controllUpdated');

      const filmPopup = new FilmPopup(film);
      filmPopup.subscribe(this.removePopup, 'closePopup');
      filmPopup.subscribe(this.provideControllInfo, 'controllUpdated');

      const viewFilm = {
        film: {
          card: filmCard,
          popup: filmPopup,
        },
        id: id.toString(),
      };

      this.films.push(viewFilm);
    });

    this.filteredFilms = this.films;
  }

  private renderFilms(count: number): void {
    this.counter += count;

    const fragment = document.createDocumentFragment();

    for (let i = this.counter - count; i <= this.counter - 1; i += 1) {
      if (this.filteredFilms[i]) {
        const { element } = this.filteredFilms[i].film.card;
        fragment.appendChild(element);
      }
    }

    this.pageNodesMap.filmListContainer.appendChild(fragment);
  }

  private renderFilters(): void {
    this.filters = new Filters(this);
    this.filters.subscribe(this.provideFilterType, 'filterClicked');
    this.filters.subscribe(this.sort.resetSort, 'filterClicked');
    this.pageNodesMap.filters.appendChild(this.filters.element);
  }

  private renderExtraFilms(extraType: 'rated' | 'commented'): void {
    const sortNames = {
      rated: 'rating' as const,
      commented: 'comments' as const,
    };
    const { container } = this.pageNodesMap[(extraType === 'rated' ? 'topRated' : 'mostCommented')];
    container.innerHTML = '';
    const [firstFilm, secondFilm] = this.controller.getSortedFilms(sortNames[extraType]);
    const sortedFilms = [] as ViewFilm[];

    this.films.forEach((viewFilm) => {
      if (viewFilm.id === firstFilm.id) {
        sortedFilms[0] = viewFilm;
      }
      if (viewFilm.id === secondFilm.id) {
        sortedFilms[1] = viewFilm;
      }
    });

    const fragment = document.createDocumentFragment();

    sortedFilms.forEach((viewFilm) => {
      const { element } = viewFilm.film.card;
      fragment.appendChild(element);
    });

    container.appendChild(fragment);
  }

  private createSort(): void {
    this.sort = new Sort(this);
    this.sort.subscribe(this.provideSortType, 'sortClicked');
  }

  private clearNodes(): void {
    this.pageNodesMap.filmListContainer.innerHTML = '';
    this.pageNodesMap.filters.innerHTML = '';
  }

  public getFiltersCount(filterType: FiltersType): number {
    return this.controller.getFilterFilms(filterType).length;
  }

  @bind
  public updateProfile(profileName: string): void {
    this.pageNodesMap.profileRating.textContent = profileName;
  }

  @bind
  public updateFilmCard(id: string): void {
    const filtersNameSpace = constants.FILTERS_TYPE;
    const films = this.controller.getData();
    const needFilm = films.filter((film) => film.id === id)[0];
    const formattedFilm = Formatter.formatDataForFilmCard(needFilm);
    const needFilmCard = this.films.filter((film) => film.id === id)[0].film.card;
    const needFilmPopup = this.films.filter((film) => film.id === id)[0].film.popup;

    if (needFilm && needFilmCard) {
      needFilmCard.updateInfo(formattedFilm);
      needFilmPopup.updateInfo(needFilm);
      this.filters.update();

      if (needFilmCard[filtersNameSpace[this.filters.activeFilterType]] === false) {
        needFilmCard.element.remove();
        this.renderFilms(1);
      }
    }
  }

  @bind
  public renderError(): void {
    this.pageNodesMap.filmListContainer.innerHTML = '<h2 class="films-list__title">There are no movies in our database.</h2>';
  }

  @bind
  public renderFilteredFilms(filmsId: string[]): void {
    const needFilms = [] as ViewFilm[];

    this.films.forEach((viewFilm) => {
      if (filmsId.includes(viewFilm.id)) {
        needFilms[filmsId.indexOf(viewFilm.id)] = viewFilm;
      }
    });

    this.filteredFilms = needFilms;
    const button = this.pageNodesMap.showMoreButton as HTMLElement;
    button.style.display = 'block';
    this.counter = 0;
    this.pageNodesMap.filmListContainer.innerHTML = '';
    this.renderFilms(5);
  }

  @bind
  public render(): void {
    if (this.films.length === 0) {
      this.cacheCards();
    }
    this.clearNodes();
    this.createSort();
    this.renderFilters();
    this.renderFilms(5);
    this.renderExtraFilms('rated');
    this.renderExtraFilms('commented');
    this.pageNodesMap.filmsQuantity.textContent = `${this.films.length} movies inside`;
  }

  @bind
  public getFilms(): ViewFilm[] {
    return this.films;
  }
}

export { View, IView };
