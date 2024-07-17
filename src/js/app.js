import '../scss/app.scss';

import { InitGame } from './InitGame';
import { GameLogic } from './GameLogic';

const game = new InitGame();
game.InitNewGame();

const gameLogic = new GameLogic(10, 20); // переписать вызов конструктора у создания игры
gameLogic.processGame();
