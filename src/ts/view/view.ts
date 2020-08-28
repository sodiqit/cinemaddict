import { bind } from 'bind-decorator';
import { IObservable, Observable } from '../utils/observable';
import { IController } from '../controller/controller-interface';
import { FilmCard } from '../components/film-card';
import { constants } from '../utils/constants';

interface IView extends IObservable {
  render(): void,
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
  }

  private cacheCards() {
    const films = this.controller.getData();

    films.forEach((film) => {
      const filmCard = new FilmCard(film);

      this.filmCards.push(filmCard);
    });
  }

  private renderFilms(): void {
    this.pageNodesMap.filmListContainer.innerHTML = '';
    if (this.filmCards.length === 0) {
      this.cacheCards();
    }

    const fragment = document.createDocumentFragment();

    this.filmCards.forEach((filmCard) => {
      fragment.appendChild(filmCard.element);
    });

    this.pageNodesMap.filmListContainer.appendChild(fragment);
  }

  @bind
  public render(): void {
    this.renderFilms();
  }
}

export { View, IView };
