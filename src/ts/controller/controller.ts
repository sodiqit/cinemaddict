import {
  FilmInfo,
  IModel,
  FiltersType,
  SortType,
} from '../model/model-interface';
import { Model } from '../model/model';
import { View } from '../view/view';
import { IView } from '../view/view-interface';
import { IController } from './controller-interface';

export class PageController implements IController {
  private model: IModel;

  private view: IView;

  constructor() {
    this.model = new Model();
    this.view = new View(this);

    this.model.subscribe(this.view.render, 'dataLoaded');
    this.model.subscribe(this.view.renderError, 'errorLoaded');

    this.view.subscribe(this.model.updateFilm, 'controllUpdated');
    this.model.subscribe(this.view.updateFilmCard, 'filmUpdated');

    this.view.subscribe(this.model.filterFilms, 'filterClicked');
    this.model.subscribe(this.view.renderFilteredFilms, 'filmsFiltered');

    this.view.subscribe(this.model.sortFilms, 'sortClicked');
    this.model.subscribe(this.view.renderFilteredFilms, 'filmsSorted');

    this.model.subscribe(this.view.updateProfile, 'profileUpdated');
  }

  getData(): FilmInfo[] {
    return this.model.getData();
  }

  getFilterFilms(filterType: FiltersType): FilmInfo[] {
    return this.model.getFilterFilms(filterType);
  }

  getSortedFilms(sortType: SortType | 'comments'): FilmInfo[] {
    return this.model.getSortedFilms(sortType);
  }
}
