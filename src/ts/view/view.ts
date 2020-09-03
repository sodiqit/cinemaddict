import { bind } from 'bind-decorator';
import { IView, PageNodesMap, ViewFilm } from './view-interface';
import { IController } from '../controller/controller-interface';
import { FilmCard } from '../components/film-card/film-card';
import { FilmPopup } from '../components/film-popup';
import { Filters } from '../components/filters';
import { Observable } from '../utils/observable';
import { constants } from '../utils/constants';
import * as Formatter from '../utils/formatter';

class View extends Observable implements IView {
  private controller: IController;

  private pageNodesMap: PageNodesMap;

  private films: ViewFilm[];

  private counter: number;

  private filters!: Filters;

  constructor(controller: IController) {
    super();
    this.controller = controller;
    this.pageNodesMap = {
      filmListContainer: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.FILMS_CONTAINER}`)!,
      mostCommentedContainer: document.querySelectorAll(`.${constants.CLASSES.MAIN_PAGE.FILMS_EXTRA} .${constants.CLASSES.MAIN_PAGE.FILMS_CONTAINER}`)[1]!,
      topRatedContainer: document.querySelectorAll(`.${constants.CLASSES.MAIN_PAGE.FILMS_EXTRA} .${constants.CLASSES.MAIN_PAGE.FILMS_CONTAINER}`)[0]!,
      showMoreButton: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.SHOW_BUTTON}`)!,
      sort: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.SORT}`)!,
      filters: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.FILTERS}`)!,
      navigationContainer: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.NAVIGATION_CONTAINER}`)!,
      profileRating: document.querySelector(`.${constants.CLASSES.MAIN_PAGE.PROFILE_RATING}`)!,
    };

    this.films = [];
    this.counter = 0;
    this.pageNodesMap.filmListContainer.innerHTML = 'Loading...';
    this.pageNodesMap.showMoreButton.addEventListener('click', this.showMoreHandler);
  }

  @bind
  private showMoreHandler(): void {
    this.renderFilms(5);

    if (this.counter >= this.films.length) {
      this.counter = 0;
      this.pageNodesMap.showMoreButton.remove();
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
  }

  private renderFilms(count: number): void {
    if (this.films.length === 0) {
      this.cacheCards();
    }

    this.counter += count;

    const fragment = document.createDocumentFragment();

    for (let i = this.counter - count; i <= this.counter - 1; i += 1) {
      if (this.films[i]) {
        const { element } = this.films[i].film.card;
        fragment.appendChild(element);
      }
    }

    this.pageNodesMap.filmListContainer.appendChild(fragment);
  }

  private renderFilters(): void {
    this.filters = new Filters(this);
    this.pageNodesMap.filters.appendChild(this.filters.element);
  }

  private clearNodes(): void {
    this.pageNodesMap.filmListContainer.innerHTML = '';
    this.pageNodesMap.filters.innerHTML = '';
  }

  @bind
  public updateFilmCard(id: string): void {
    const films = this.controller.getData();
    const needFilm = films.filter((film) => film.id === id)[0];
    const formattedFilm = Formatter.formatDataForFilmCard(needFilm);
    const needFilmCard = this.films.filter((film) => film.id === id)[0].film.card;
    const needFilmPopup = this.films.filter((film) => film.id === id)[0].film.popup;

    if (needFilm && needFilmCard) {
      needFilmCard.updateInfo(formattedFilm);
      needFilmPopup.updateInfo(needFilm);
      this.filters.update();
    }
  }

  @bind
  public renderError(): void {
    this.pageNodesMap.filmListContainer.innerHTML = 'There are no movies in our database.';
  }

  @bind
  public render(): void {
    this.clearNodes();
    this.renderFilms(5);
    this.renderFilters();
  }

  @bind
  public getFilms(): ViewFilm[] {
    return this.films;
  }
}

export { View, IView };
