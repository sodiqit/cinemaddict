import { FilmInfo } from '../components/film-card';

export interface IController {
  getData(): FilmInfo[]
}
