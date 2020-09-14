import { FilmInfo, FiltersType, SortType } from '../model/model-interface';

export interface IController {
  getData(): FilmInfo[],
  getFilterFilms(filterType: FiltersType): FilmInfo[],
  getSortedFilms(sortType: SortType | 'comments'): FilmInfo[],
}
