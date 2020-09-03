import { FilmInfo, IModel } from '../model/model-interface';
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
  }

  getData(): FilmInfo[] {
    return this.model.getData();
  }
}
