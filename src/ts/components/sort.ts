import { bind } from 'bind-decorator';
import { IView } from '../view/view-interface';
import { SortType } from '../model/model-interface';
import { Observable } from '../utils/observable';
import { constants } from '../utils/constants';

type SortNodeMap = {
  default: Element,
  date: Element,
  rating: Element,
};

class Sort extends Observable {
  private view: IView;

  private nodeMap!: SortNodeMap;

  private activeSortType: SortType;

  constructor(view: IView) {
    super();
    this.view = view;
    this.activeSortType = 'default';
    this.cacheNodeMap();
    document.querySelector(`.${constants.CLASSES.MAIN_PAGE.SORT}`)?.addEventListener('click', this.sortButtonHandler);
  }

  private cacheNodeMap(): void {
    const sortButtons = document.querySelectorAll(`.${constants.CLASSES.MAIN_PAGE.SORT} a`)!;
    this.nodeMap = {
      default: sortButtons[0],
      date: sortButtons[1],
      rating: sortButtons[2],
    };
  }

  @bind
  private sortButtonHandler(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;

    if (!target.classList.contains(constants.CLASSES.MAIN_PAGE.SORT_BUTTON)) {
      return;
    }

    const sortType = target.dataset.type as SortType;

    this.switchActiveSort(sortType);

    this.notify('sortClicked', sortType);
  }

  private switchActiveSort(sortType: SortType): void {
    this.activeSortType = sortType;
    Object.keys(this.nodeMap).forEach((key) => {
      const keyName = key as SortType;
      const item = this.nodeMap[keyName];

      if (keyName === sortType) {
        item.classList.add(constants.CLASSES.MAIN_PAGE.SORT_ACTIVE);
      } else {
        item.classList.remove(constants.CLASSES.MAIN_PAGE.SORT_ACTIVE);
      }
    });
  }

  @bind
  public resetSort(): void {
    this.switchActiveSort('default');
  }
}

export {
  Sort,
  SortType,
};
