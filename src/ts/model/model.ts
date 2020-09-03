import { bind } from 'bind-decorator';
import { IModel, FilmInfo } from './model-interface';
import { Observable } from '../utils/observable';
import { getFilmData } from '../utils/mock/mock-film-data';

class Model extends Observable implements IModel {
  private films!: FilmInfo[];

  constructor() {
    super();
    this.fetchData().then(() => this.notify('dataLoaded')).catch(() => this.notify('errorLoaded'));
  }

  private fetchData(): Promise<FilmInfo[] | void> {
    return getFilmData(15).then((films) => {
      this.films = films;
    });
  }

  @bind
  public updateFilm(info: { id: string, name: string, value: boolean }): void {
    const {
      id,
      name,
      value,
    } = info;
    const needFilm = this.films.filter((film) => film.id === id)[0];

    if (needFilm) {
      needFilm[name] = value;
      this.notify('filmUpdated', id);
    }
  }

  public getData(): FilmInfo[] {
    return this.films;
  }
}

export { Model };
