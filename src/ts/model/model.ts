import { bind } from 'bind-decorator';
import { IModel, FilmInfo, FiltersType } from './model-interface';
import { Observable } from '../utils/observable';
import { getFilmData } from '../utils/mock/mock-film-data';

export class Model extends Observable implements IModel {
  private films!: FilmInfo[];

  private filteredFilms!: string[];

  constructor() {
    super();
    this.fetchData().then(() => this.notify('dataLoaded')).catch(() => this.notify('errorLoaded'));
  }

  private fetchData(): Promise<FilmInfo[] | void> {
    return getFilmData(15).then((films) => {
      this.films = films;
    });
  }

  public getData(): FilmInfo[] {
    return this.films;
  }

  public getFilterCount(filterType: FiltersType): number {
    return this.filterFilms(filterType, false).length;
  }

  @bind
  public filterFilms(filterType: FiltersType, needUpdate = true): string[] {
    const names = {
      watchlist: 'inWatchList' as const,
      history: 'itWatched' as const,
      favorite: 'itFavorite' as const,
      all: '' as const,
    };

    let filmsId = [];

    if (filterType === 'all') {
      filmsId = this.films.map((film) => film.id);
    } else {
      filmsId = this.films.filter((film) => film[names[filterType]]).map((film) => film.id);
    }

    if (needUpdate) {
      this.filteredFilms = filmsId;
      this.notify('filmsFiltered', filmsId);
    }

    return filmsId;
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
}
