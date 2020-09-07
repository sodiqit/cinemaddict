import { IObservable } from '../utils/observable';
import { FilmCard } from '../components/film-card/film-card';
import { FilmPopup } from '../components/film-popup';

interface IView extends IObservable {
  updateFilmCard(id: string): void,
  render(): void,
  renderError(): void,
  getFilms(): ViewFilm[],
  getFilteredFilms(): ViewFilm[],
  setFilteredFilms(films: ViewFilm[]): void,
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

export { IView, PageNodesMap, ViewFilm };
