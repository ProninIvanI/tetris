import { Area } from './Area';

export class InitGame {
  constructor() {
    this.width = 10;
    this.height = 20;
  }

  InitNewGame() {
    const field = new Area(this.width, this.height);
    field.createPage();
  }
}
