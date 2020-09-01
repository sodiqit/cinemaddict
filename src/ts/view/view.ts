import { bind } from 'bind-decorator';
import { IObservable, Observable } from '../utils/observable';
import { IController } from '../controller/controller-interface';
import { FilmCard } from '../components/film-card';
import { FilmPopup } from '../components/film-popup';
import { constants } from '../utils/constants';

interface IView extends IObservable {
  render(): void,
  renderError(): void,
}

type PageNodesMap = {
  filmListContainer: Element,
  mostCommentedContainer: Element,
  topRatedContainer: Element,
  showMoreButton: Element,
  sort: Element,
  filters: Element,
  navigationContainer: Element,
  profileRating: Element,
};

type ViewFilm = {
  film: {
    card: FilmCard,
    popup: FilmPopup,
  },
  id: string,
};

class View extends Observable implements IView {
  private controller: IController;

  private pageNodesMap: PageNodesMap;

  private films: ViewFilm[];

  private counter: number;

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
      this.pageNodesMap.showMoreButton.removeEventListener('click', this.showMoreHandler);
      this.pageNodesMap.showMoreButton.remove();
    }
  }

  @bind
  removePopup(id: string): void {
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

  private cacheCards() {
    const films = this.controller.getData();

    films.forEach((film) => {
      const { id } = film;
      const filmCard = new FilmCard(film);
      filmCard.subscribe(this.renderPopup, 'showPopup');
      const filmPopup = new FilmPopup(film);
      filmPopup.subscribe(this.removePopup, 'closePopup');
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

  @bind
  public renderError(): void {
    this.pageNodesMap.filmListContainer.innerHTML = 'There are no movies in our database.';
  }

  @bind
  public render(): void {
    this.pageNodesMap.filmListContainer.innerHTML = '';
    this.renderFilms(5);
  }
}

export { View, IView };
