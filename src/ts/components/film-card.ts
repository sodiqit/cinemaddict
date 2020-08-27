import { createNode } from '../utils/create-node';

type FilmInfo = {
  title: string,
  rating: number,
  year: number,
  duration: number,
  genre: string[],
  img: string,
  commentsCount: number,
  description: string,
};

const formateTime = (time: number): string => {
  const hours = Math.floor(time / 60);
  if (hours >= 1) {
    return `${hours}h ${time - hours * 60}m`;
  }
  return `${time}m`;
};

const formateGenres = (genres: string[]): string => {
  const genreCopy = genres.slice();
  const firstGenre = genreCopy[0];
  const newFirstGenre = `${firstGenre[0].toUpperCase()}${firstGenre.slice(1)}`;

  genreCopy.shift();
  genreCopy.unshift(newFirstGenre);

  return genreCopy.join(', ');
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
    } = this.info;

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
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
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
