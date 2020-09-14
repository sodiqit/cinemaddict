import { IObservable } from '../utils/observable';

type SortType = 'default' | 'date' | 'rating';

type Comment = {
  author: string,
  date: string,
  text: string,
  emoji: string,
  id: number,
};

type FilmInfo = {
  id: string,
  title: string,
  alternativeTitle: string,
  rating: string,
  ageRating: number,
  duration: number,
  releaseDate: string,
  country: string,
  directors: string[],
  actors: string[],
  writers: string[],
  genre: string[],
  img: string,
  description: string,
  inWatchList: boolean,
  itWatched: boolean,
  itFavorite: boolean,
  comments: Comment[],
};

type FiltersType = 'watchlist' | 'history' | 'favorite' | 'all';

interface IModel extends IObservable {
  getData(): FilmInfo[],
  getFilterFilms(filterType: FiltersType): FilmInfo[],
  getSortedFilms(filterType: SortType | 'comments'): FilmInfo[],
  updateFilm(info: { id: string, name: string, value: boolean }): void,
  filterFilms(filterType: FiltersType, needUpdate: boolean): FilmInfo[],
  sortFilms(sortType: SortType | 'comments'): FilmInfo[],
}

export {
  Comment,
  FilmInfo,
  FiltersType,
  SortType,
  IModel,
};
