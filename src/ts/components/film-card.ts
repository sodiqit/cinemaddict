import { createNode } from '../utils/create-node';
import { formateTime, formateGenres } from '../utils/formatter';
import { constants } from '../utils/constants';

type FilmInfo = {
  id: number,
  title: string,
  rating: string,
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

type NodeMap = {
  title: Element,
  year: Element,
  rating: Element,
  duration: Element,
  genre: Element,
  img: HTMLImageElement,
  commentsCount: Element,
  inWatchList: Element,
  itWatched: Element,
  itFavorite: Element,
  description: Element,
};

class FilmCard {
  private info: FilmInfo;

  private node!: HTMLElement;

  private nodeMap!: NodeMap;

  constructor(info: FilmInfo) {
    this.info = info;

    this.createMarkup();
  }

  private createMarkup(): void {
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

    const buttonActiveClass = constants.CLASSES.ACTIVE_CLASS;

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

    this.nodeMap = {
      title: filmCard.querySelector('.film-card__title')!,
      rating: filmCard.querySelector('.film-card__rating')!,
      year: filmCard.querySelector('.film-card__year')!,
      duration: filmCard.querySelector('.film-card__duration')!,
      commentsCount: filmCard.querySelector('.film-card__comments')!,
      genre: filmCard.querySelector('.film-card__genre')!,
      description: filmCard.querySelector('.film-card__description')!,
      inWatchList: filmCard.querySelector('.film-card__controls-item--add-to-watchlist')!,
      itWatched: filmCard.querySelector('.film-card__controls-item--mark-as-watched')!,
      itFavorite: filmCard.querySelector('.film-card__controls-item--favorite')!,
      img: filmCard.querySelector('.film-card__poster') as HTMLImageElement,
    };

    this.node = filmCard;
  }

  private updateMarkup(): void {
    const buttonActiveClass = constants.CLASSES.ACTIVE_CLASS;

    Object.keys(this.info).forEach((key) => {
      if (key === 'id') {
        return;
      }
      const node = this.nodeMap[key] as Element;
      const option = this.info[key] as string | boolean;
      if (typeof option !== 'boolean') {
        node.textContent = option;
      } else if (option) {
        node.classList.add(buttonActiveClass);
      } else {
        node.classList.remove(buttonActiveClass);
      }

      if (key === 'duration') {
        node.textContent = formateTime(+option);
      }

      if (key === 'img') {
        const imgNode = node as HTMLImageElement;
        imgNode.src = option.toString();
      }

      if (key === 'genre') {
        node.textContent = formateGenres(option as unknown as string[]);
      }

      if (key === 'commentsCount') {
        node.textContent = `${option.toString()} comments`;
      }
    });
  }

  public get element(): HTMLElement {
    return this.node;
  }

  public get id(): number {
    return this.info.id;
  }

  public updateInfo(newInfo: Partial<FilmInfo>): void {
    const oldInfo = this.info;
    this.info = { ...oldInfo, ...newInfo };
    this.updateMarkup();
  }
}

export { FilmCard, FilmInfo };
