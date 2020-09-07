import { FilmInfo, FiltersType } from '../model/model-interface';

export interface IController {
  getData(): FilmInfo[],
  getFilterCount(filterType: FiltersType): number,
}
