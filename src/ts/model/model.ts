import { IObservable, Observable } from '../utils/observable';
import { getFilmData } from '../utils/mock/mock-film-data';
import { FilmInfo } from '../components/film-card';

interface IModel extends IObservable {
  fetchData(): Promise<FilmInfo[] | void>,
  getData(): FilmInfo[],
}

class Model extends Observable implements IModel {
  private data!: FilmInfo[];

  constructor() {
    super();
    this.fetchData().then(() => this.notify('dataLoaded')).catch(() => this.notify('errorLoad'));
  }

  fetchData(): Promise<FilmInfo[] | void> {
    return getFilmData(15).then((films) => {
      this.data = films;
    });
  }

  getData(): FilmInfo[] {
    return this.data;
  }
}

export { Model, IModel };
