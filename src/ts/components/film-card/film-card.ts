import { bind } from 'bind-decorator';
import { FilmCardInfo, NodeMap } from './film-card-interface';
import { Observable } from '../../utils/observable';
import { createNode } from '../../utils/create-node';
import { constants } from '../../utils/constants';
import * as Formatter from '../../utils/formatter';

class FilmCard extends Observable {
  private info: FilmCardInfo;

  private node!: HTMLElement;

  private nodeMap!: NodeMap;

  constructor(info: FilmCardInfo) {
    super();
    this.info = info;

    this.createMarkup();
  }

  @bind
  private showPopupHandler(): void {
    this.notify('showPopup', this.id);
  }

  @bind
  private userControllsHandler(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (!target.classList.contains('button')) {
      return;
    }
    const controllInfo = {
      id: this.id,
      name: target.dataset.type,
      value: target.dataset.active !== 'true',
    };

    this.notify('controllUpdated', controllInfo);
  }

  private createMarkup(): void {
    const {
      title,
      rating,
      releaseDate,
      duration,
      genre,
      img,
      comments,
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
        <span class="film-card__year">${releaseDate.slice(-4)}</span>
        <span class="film-card__duration">${Formatter.formatTime(duration)}</span>
        <span class="film-card__genre">${Formatter.formatGenres(genre)}</span>
      </p>
      <img src="${img}" alt="" class="film-card__poster">
      <p class="film-card__description">${Formatter.formatDesc(description)}</p>
      <a class="film-card__comments">${comments} comments</a>
      <form class="film-card__controls">
        <button data-type="inWatchlist" data-active="${inWatchList ? 'true' : 'false'}" class="film-card__controls-item button film-card__controls-item--add-to-watchlist
        ${inWatchList ? buttonActiveClass : ''}">Add to watchlist</button>
        <button data-type="itWatched" data-active="${itWatched ? 'true' : 'false'}" class="film-card__controls-item button film-card__controls-item--mark-as-watched
        ${itWatched ? buttonActiveClass : ''}">Mark as watched</button>
        <button data-type="itFavorite" data-active="${itFavorite ? 'true' : 'false'}" class="film-card__controls-item button film-card__controls-item--favorite
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
      comments: filmCard.querySelector('.film-card__comments')!,
      genre: filmCard.querySelector('.film-card__genre')!,
      description: filmCard.querySelector('.film-card__description')!,
      inWatchList: filmCard.querySelector('.film-card__controls-item--add-to-watchlist')!,
      itWatched: filmCard.querySelector('.film-card__controls-item--mark-as-watched')!,
      itFavorite: filmCard.querySelector('.film-card__controls-item--favorite')!,
      img: filmCard.querySelector('.film-card__poster') as HTMLImageElement,
      controlls: filmCard.querySelector('.film-card__controls') as HTMLImageElement,
    };

    this.nodeMap.title.addEventListener('click', this.showPopupHandler);
    this.nodeMap.img.addEventListener('click', this.showPopupHandler);
    this.nodeMap.comments.addEventListener('click', this.showPopupHandler);
    this.nodeMap.controlls.addEventListener('click', this.userControllsHandler);

    this.node = filmCard;
  }

  private updateMarkup(): void {
    const buttonActiveClass = constants.CLASSES.ACTIVE_CLASS;

    Object.keys(this.info).forEach((key) => {
      if (key === 'id') {
        return;
      }
      const node = this.nodeMap[key] as HTMLElement;
      const option = this.info[key] as string | boolean | Comment[];
      if (typeof option !== 'boolean' || typeof option !== 'object') {
        node.textContent = option as string;
      }

      if (typeof option === 'boolean' && option === true) {
        node.classList.add(buttonActiveClass);
        node.dataset.active = 'true';
      } else if (typeof option === 'boolean' && option === false) {
        node.classList.remove(buttonActiveClass);
        node.dataset.active = 'false';
      }

      if (key === 'duration') {
        node.textContent = Formatter.formatTime(+option);
      }

      if (key === 'description') {
        node.textContent = Formatter.formatDesc(option as string);
      }

      if (key === 'img') {
        const imgNode = node as HTMLImageElement;
        imgNode.src = option.toString();
      }

      if (key === 'genre') {
        node.textContent = Formatter.formatGenres(option as unknown as string[]);
      }

      if (key === 'comments') {
        const comments = option as Comment[];
        node.textContent = `${comments.length} comments`;
      }
    });
  }

  public get element(): HTMLElement {
    return this.node;
  }

  public get id(): string {
    return this.info.id;
  }

  public updateInfo(newInfo: FilmCardInfo): void {
    const oldInfo = this.info;
    this.info = { ...oldInfo, ...newInfo };
    this.updateMarkup();
  }
}

export { FilmCard, FilmCardInfo };
