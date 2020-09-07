import { IObservable } from '../utils/observable';
import { FilmCard } from '../components/film-card/film-card';
import { FilmPopup } from '../components/film-popup';
import { FiltersType } from '../model/model-interface';

interface IView extends IObservable {
  updateFilmCard(id: string): void,
  render(): void,
  renderFilteredFilms(films: string[]): void,
  renderError(): void,
  getFilms(): ViewFilm[],
  getFiltersCount(filtersType: FiltersType): number,
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
