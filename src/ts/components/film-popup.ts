import { bind } from 'bind-decorator';
import { FilmInfo } from '../model/model-interface';
import { createNode } from '../utils/create-node';
import { constants } from '../utils/constants';
import { Observable } from '../utils/observable';
import * as Formatter from '../utils/formatter';

type NodeMap = {
  closeButton: Element,
  controlls: Element,
  itWatched: HTMLInputElement,
  itFavorite: HTMLInputElement,
  inWatchList: HTMLInputElement,
};

class FilmPopup extends Observable {
  private filmInfo: FilmInfo;

  private node!: HTMLElement;

  private nodeMap!: NodeMap;

  constructor(filmInfo: FilmInfo) {
    super();
    this.filmInfo = filmInfo;

    this.createMarkup();
  }

  @bind
  private closePopupHandler(): void {
    this.notify('closePopup', this.id);
  }

  @bind
  private controllHandler(e: Event): void {
    e.preventDefault();

    const names = {
      watchlist: 'inWatchList' as const,
      favorite: 'itFavorite' as const,
      watched: 'itWatched' as const,
    };

    const target = e.target as HTMLElement;
    if (!target.classList.contains('film-details__control-label')) {
      return;
    }

    const id = target.getAttribute('for') as 'watchlist' | 'favorite' | 'watched';
    const input = this.nodeMap[names[id]];

    const controllInfo = {
      id: this.id,
      name: names[id],
      value: !input.checked,
    };

    this.notify('controllUpdated', controllInfo);
  }

  private createMarkup(): void {
    const {
      img,
      ageRating,
      rating,
      title,
      alternativeTitle,
      directors,
      actors,
      writers,
      duration,
      releaseDate,
      country,
      genre,
      description,
      inWatchList,
      itWatched,
      itFavorite,
      comments,
    } = this.filmInfo;

    this.node = createNode('section', {
      classNames: ['film-details'],
    });

    const template = `
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src=${img} alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tbody><tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${directors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${Formatter.formatTime(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                    ${genre.map((el) => `<span class="film-details__genre">${el[0].toUpperCase()}${el.slice(1)}</span>`).join()}
                  </td>
                </tr>
              </tbody></table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${inWatchList ? 'checked' : ''}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${itWatched ? 'checked' : ''}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${itFavorite ? 'checked' : ''}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${comments.map((comment) => `
                <li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                    <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
                  </span>
                  <div>
                    <p class="film-details__comment-text">${comment.text}</p>
                    <p class="film-details__comment-info">
                      <span class="film-details__comment-author">${comment.author}</span>
                      <span class="film-details__comment-day">${Formatter.formatDate(comment.date)}</span>
                      <button class="film-details__comment-delete">Delete</button>
                    </p>
                  </div>
                </li>
              `).join('')}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`;

    this.node.innerHTML = template;

    if (!this.nodeMap) {
      this.nodeMap = {
        closeButton: this.node.querySelector(`.${constants.CLASSES.FILM_POPUP.CLOSE_BUTTON}`)!,
        controlls: this.node.querySelector(`.${constants.CLASSES.FILM_POPUP.CONTROLLS}`)!,
        inWatchList: this.node.querySelector(`.${constants.CLASSES.FILM_POPUP.WATCHLIST}`) as HTMLInputElement,
        itFavorite: this.node.querySelector(`.${constants.CLASSES.FILM_POPUP.FAVORITE}`) as HTMLInputElement,
        itWatched: this.node.querySelector(`.${constants.CLASSES.FILM_POPUP.WATCHED}`) as HTMLInputElement,
      };
    }

    this.nodeMap.closeButton.addEventListener('click', this.closePopupHandler);
    this.nodeMap.controlls.addEventListener('click', this.controllHandler);
  }

  private updateMarkup(): void {
    const {
      inWatchList,
      itWatched,
      itFavorite,
    } = this.filmInfo;

    this.nodeMap.inWatchList.checked = inWatchList;
    this.nodeMap.itFavorite.checked = itFavorite;
    this.nodeMap.itWatched.checked = itWatched;
  }

  public updateInfo(newFilmInfo: Partial<FilmInfo>): void {
    const oldFilmInfo = this.filmInfo;

    this.filmInfo = { ...oldFilmInfo, ...newFilmInfo };
    this.updateMarkup();
  }

  get element(): HTMLElement {
    return this.node;
  }

  get id(): string {
    return this.filmInfo.id;
  }
}

export { FilmPopup };
