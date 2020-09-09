import { bind } from 'bind-decorator';
import {
  IModel,
  FilmInfo,
  FiltersType,
  SortType,
} from './model-interface';
import { Observable } from '../utils/observable';
import { getFilmData } from '../utils/mock/mock-film-data';

export class Model extends Observable implements IModel {
  private films!: FilmInfo[];

  private filteredFilms!: FilmInfo[];

  private activeFilter!: FiltersType;

  constructor() {
    super();
    this.fetchData().then(() => {
      this.filterFilms('all');
      this.notify('dataLoaded');
    }).catch(() => this.notify('errorLoaded'));
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
  public filterFilms(filterType: FiltersType, needUpdate = true): FilmInfo[] {
    const names = {
      watchlist: 'inWatchList' as const,
      history: 'itWatched' as const,
      favorite: 'itFavorite' as const,
      all: '' as const,
    };

    let filteredFilms = [];

    if (filterType === 'all') {
      filteredFilms = this.films;
    } else {
      filteredFilms = this.films.filter((film) => film[names[filterType]]);
    }

    if (needUpdate) {
      this.activeFilter = filterType;
      this.filteredFilms = filteredFilms;
      this.notify('filmsFiltered', filteredFilms.map((film) => film.id));
    }

    return filteredFilms;
  }

  @bind
  public sortFilms(sortType: SortType, needNotify = true): FilmInfo[] {
    const type = sortType === 'date' ? 'releaseDate' : 'rating';

    let sortedFilms = [];

    if (sortType === 'default') {
      sortedFilms = this.filteredFilms;
    } else {
      sortedFilms = this.filteredFilms.slice().sort((a, b) => {
        if (type === 'releaseDate') {
          const rightDate = new Date(b[type]).getTime();
          const leftDate = new Date(a[type]).getTime();
          return rightDate - leftDate;
        }

        return +b[type] - (+a[type]);
      });
    }

    if (needNotify) {
      this.notify('filmsSorted', sortedFilms.map((film) => film.id));
    }

    return sortedFilms;
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
      this.filteredFilms = this.filterFilms(this.activeFilter, false);
      this.notify('filmUpdated', id);
    }
  }
}
