import { bind } from 'bind-decorator';
import { FilmInfo } from '../components/film-card';
import { Model, IModel } from '../model/model';
import { View, IView } from '../view/view';
import { IController } from './controller-interface';

export class Controller implements IController {
  private model: IModel;

  private view: IView;

  constructor() {
    this.model = new Model();
    this.view = new View(this);

    this.model.subscribe(this.goodCall, 'dataLoaded');
  }

  @bind
  goodCall(): void {
    console.log('good load', this.getData());
    this.view.render();
  }

  getData(): FilmInfo[] {
    return this.model.getData();
  }
}
