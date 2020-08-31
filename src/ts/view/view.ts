import { bind } from 'bind-decorator';
import { IObservable, Observable } from '../utils/observable';
import { IController } from '../controller/controller-interface';
import { FilmCard } from '../components/film-card';
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

class View extends Observable implements IView {
  private controller: IController;

  private pageNodesMap: PageNodesMap;

  private filmCards: FilmCard[];

  private counter: number;

  constructor(controller: IController) {
    super();
    this.controller = controller;
    this.pageNodesMap = {
      filmListContainer: document.querySelector(`.${constants.CLASSES.FILMS_CONTAINER}`)!,
      mostCommentedContainer: document.querySelectorAll(`.${constants.CLASSES.FILMS_EXTRA} .${constants.CLASSES.FILMS_CONTAINER}`)[1]!,
      topRatedContainer: document.querySelectorAll(`.${constants.CLASSES.FILMS_EXTRA} .${constants.CLASSES.FILMS_CONTAINER}`)[0]!,
      showMoreButton: document.querySelector(`.${constants.CLASSES.SHOW_BUTTON}`)!,
      sort: document.querySelector(`.${constants.CLASSES.SORT}`)!,
      filters: document.querySelector(`.${constants.CLASSES.FILTERS}`)!,
      navigationContainer: document.querySelector(`.${constants.CLASSES.NAVIGATION_CONTAINER}`)!,
      profileRating: document.querySelector(`.${constants.CLASSES.PROFILE_RATING}`)!,
    };

    this.filmCards = [];
    this.counter = 0;
    this.pageNodesMap.filmListContainer.innerHTML = 'Loading...';
    this.pageNodesMap.showMoreButton.addEventListener('click', this.showMoreHandler);
  }

  @bind
  private showMoreHandler(): void {
    this.renderFilms(5);

    if (this.counter >= this.filmCards.length) {
      this.pageNodesMap.showMoreButton.removeEventListener('click', this.showMoreHandler);
      this.pageNodesMap.showMoreButton.remove();
    }
  }

  private cacheCards() {
    const films = this.controller.getData();

    films.forEach((film) => {
      const filmCard = new FilmCard(film);

      this.filmCards.push(filmCard);
    });
  }

  private renderFilms(count = 5): void {
    if (this.filmCards.length === 0) {
      this.cacheCards();
    }

    this.counter += count;

    const fragment = document.createDocumentFragment();

    for (let i = this.counter - count; i <= this.counter - 1; i += 1) {
      if (this.filmCards[i]) {
        const { element } = this.filmCards[i];
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
    this.renderFilms();
  }
}

export { View, IView };
