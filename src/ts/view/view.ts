import { IObservable, Observable } from '../utils/observable';
import { IController } from '../controller/controller-interface';

interface IView extends IObservable {
  render(): void,
}

class View extends Observable implements IView {
  private controller: IController;

  constructor(controller: IController) {
    super();
    this.controller = controller;
  }

  public render(): void {
    console.log(this.controller);
  }
}

export { View, IView };
