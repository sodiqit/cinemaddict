import { IObservable } from '../utils/observable';

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
  getFilterCount(filterType: FiltersType): number,
  updateFilm(info: { id: string, name: string, value: boolean }): void,
  filterFilms(filterType: FiltersType): void,
}

export {
  Comment,
  FilmInfo,
  FiltersType,
  IModel,
};
