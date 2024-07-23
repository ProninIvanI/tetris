import '../scss/app.scss';

import { InitGame } from './InitGame';
import { GameLogic } from './GameLogic';

const game = new InitGame();
game.InitNewGame();

const gameLogic = new GameLogic(game.width, game.height);
gameLogic.processGame();
