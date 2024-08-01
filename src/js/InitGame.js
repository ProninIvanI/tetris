import { Area } from './Area';
import { GameLogic } from './GameLogic';
import { Score } from './Score';
import { EventBus } from './EventBus';

export class InitGame {
  constructor() {
    this.width = 10;
    this.height = 20;
  }

  InitNewGame() {
    const score = new Score();
    const eventBus = new EventBus();

    const field = new Area(this.width, this.height, score, eventBus);
    field.createPage();

    const gameLogic = new GameLogic(this.width, this.height, score, eventBus);
    gameLogic.startGame();
  }
}
