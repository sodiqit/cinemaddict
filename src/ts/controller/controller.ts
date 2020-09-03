import { bind } from 'bind-decorator';
import { FilmInfo, IModel } from '../model/model-interface';
import { Model } from '../model/model';
import { View, IView } from '../view/view';
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
