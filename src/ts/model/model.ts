import { getFilmData } from '../utils/mock/mock-film-data';
import { FilmInfo } from '../components/film-card';

interface IModel {
  getData(): Promise<FilmInfo[] | void>,
}

class Model implements IModel {
  private data!: FilmInfo[];

  constructor() {
    this.getData().then(() => this.data).catch((err) => new Error(err));
  }

  getData(): Promise<FilmInfo[] | void> {
    return getFilmData(15).then((data) => {
      this.data = data;
    });
  }
}

export { Model, IModel };
