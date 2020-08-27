import { createNode } from '../utils/create-node';
import { formateTime, formateGenres } from '../utils/formatter';

type FilmInfo = {
  title: string,
  rating: number,
  year: number,
  duration: number,
  genre: string[],
  img: string,
  commentsCount: number,
  description: string,
  inWatchList: boolean,
  itWatched: boolean,
  itFavorite: boolean,
};

class FilmCard {
  private info: FilmInfo;

  private node!: HTMLElement;

  constructor(info: FilmInfo) {
    this.info = info;

    this.createMarkup();
  }

  createMarkup(): void {
    const {
      title,
      rating,
      year,
      duration,
      genre,
      img,
      commentsCount,
      description,
      itWatched,
      itFavorite,
      inWatchList,
    } = this.info;

    const buttonActiveClass = 'film-card__controls-item--active';

    const template = `
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${formateTime(duration)}</span>
        <span class="film-card__genre">${formateGenres(genre)}</span>
      </p>
      <img src="${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist
        ${inWatchList ? buttonActiveClass : ''}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched
        ${itWatched ? buttonActiveClass : ''}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite
        ${itFavorite ? buttonActiveClass : ''}">Mark as favorite</button>
      </form>
    `;

    const filmCard = createNode('article', {
      classNames: ['film-card'],
    });

    filmCard.innerHTML = template;

    this.node = filmCard;
  }

  public get element(): HTMLElement {
    return this.node;
  }
}

export { FilmCard, FilmInfo };
