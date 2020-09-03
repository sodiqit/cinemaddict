import { FilmInfo } from '../model/model-interface';

export interface IController {
  getData(): FilmInfo[]
}
