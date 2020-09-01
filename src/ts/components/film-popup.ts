import { bind } from 'bind-decorator';
import { FilmInfo } from './film-card';
import { createNode } from '../utils/create-node';
import { constants } from '../utils/constants';
import { Observable } from '../utils/observable';
import * as Formatter from '../utils/formatter';

class FilmPopup extends Observable {
  private filmInfo: FilmInfo;

  private node!: HTMLElement;

  constructor(filmInfo: FilmInfo) {
    super();
    this.filmInfo = filmInfo;

    this.createMarkup();
  }

  @bind
  private closePopupHandler(): void {
    this.notify('closePopup', this.id);
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

    this.node.querySelector(`.${constants.CLASSES.FILM_POPUP.CLOSE_BUTTON}`)?.addEventListener('click', this.closePopupHandler);
  }

  get element(): HTMLElement {
    return this.node;
  }

  get id(): string {
    return this.filmInfo.id;
  }
}

export { FilmPopup };
