import { Figures } from './Figures';
import { Field } from './Field';
import cloneDeep from 'lodash/cloneDeep';
import { invisiblePartArrayField } from './Constants';
import { meanOfTheFixedFigure } from './Constants';

export class GameLogic {
  constructor(width, height, score, eventBus) {
    this.height = height + 4; // увеличиваю на 4, чтобы вставлять в эту область фигуры, но она не будет отбражаться
    this.width = width;
    this.score = score;
    this.eventBus = eventBus;
    this.figures = new Figures();
    this.field = new Field(this.width, this.height);
    this.timerId = null;
  }

  startGame() {
    this.processGame();
    this.addEventKeyDown();
    this.subscribeOnRestartGame();
  }

  processGame() {
    let isCreateNewFigure = true;
    let isCreateStartFigure = true;

    this.timerId = setInterval(() => {
      if (this.checkEndGameCondition()) {
        if (isCreateNewFigure) {
          if (isCreateStartFigure) {
            this.figures.figureCurrent = this.figures.takeRandomFigure();
            this.figures.figureNext = this.figures.takeRandomFigure();
            isCreateStartFigure = false;
            this.eventBus.publish('updateNextFigure', this.figures.figureNext);
          } else {
            this.figures.figureCurrent = this.figures.figureNext;
            this.figures.figureNext = this.figures.takeRandomFigure();
            this.eventBus.publish('updateNextFigure', this.figures.figureNext);
          }
          this.figures.coordinateAbscissa = this.width / 2 - Math.round(this.figures.figureCurrent.matrix.length / 2);
          this.figures.coordinateOrdinate = this.figures.calculationOrdinateFigure(this.figures.figureCurrent.matrix);
          this.insertFigureOnField(
            this.figures.figureCurrent.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa
          );
          isCreateNewFigure = false;
        }
        if (
          this.checkOpportunityMoveDownFigure(
            this.figures.figureCurrent.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa
          )
        ) {
          this.moveFigure(
            this.figures.figureCurrent.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa,
            this.figures.figureCurrent.color,
            1,
            0
          );
        } else {
          this.insertFigureInArrayFigure(
            this.figures.figureCurrent.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa
          );
          isCreateNewFigure = true;
          this.deleteCollectedRow(this.field.arrayField);
        }
      } else {
        clearInterval(this.timerId);
        this.eventBus.publish('showMessageAboutEndGame');
      }
    }, 200);
  }

  paintFigureOnField(matrix, y, x, color) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          const moveY = y + i;
          const moveX = x + j;
          this.eventBus.publish('paintFigure', {colorCell: color, MoveY: moveY, MoveX: moveX});
        }
      }
    }
  }

  insertFigureInArrayFigure(matrix, y, x) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          this.field.arrayField[y + i][x + j] = meanOfTheFixedFigure;
        }
      }
    }
  }

  insertFigureOnField(matrix, y, x) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          this.field.arrayField[y + i][x + j] = matrix[i][j];
        }
      }
    }
  }

  deleteFigureFromField(matrix, y, x) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          this.field.arrayField[y + i][x + j] = 0;
        }
      }
    }
  }

  checkOpportunityMoveDownFigure(matrix, y, x) {
    let isOpportunityMove = true;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        // проверяю, что у меня в матрице элемента я работаю именно с крайним
        if (
          (matrix[i][j] === 1 && i + 1 < matrix.length && matrix[i + 1][j] === 0) ||
          (matrix[i][j] === 1 && i + 1 === matrix.length)
        ) {
          // проверяю что крайний элемент матрицы имеет возможность упасть
          if (y + i + 1 >= this.field.arrayField.length || this.field.arrayField[y + i + 1][x + j] !== 0) {
            isOpportunityMove = false;
          }
        }
      }
    }
    return isOpportunityMove;
  }

  // метод проверки условия конца игры, при окончании должно вернуть true
  checkEndGameCondition() {
    let isEndGame = false;
    if (this.field.arrayField[invisiblePartArrayField].indexOf(meanOfTheFixedFigure) === -1) {
      isEndGame = true;
    }
    return isEndGame;
  }

  workWithPressKey(key, matrix, y, x, color) {
    if (key === 'ArrowRight' && this.checkOpportunityMoveHorizontalFigure(matrix, y, x, 1)) {
      this.moveFigure(matrix, y, x, color, 0, 1);
    } else if (key === 'ArrowLeft' && this.checkOpportunityMoveHorizontalFigure(matrix, y, x, -1)) {
      this.moveFigure(matrix, y, x, color, 0, -1);
    } else if (key === 'Space' && this.checkOpportunityTurnFigure(matrix, y, x)) {
      this.turnFigure(matrix, y, x, color);
      console.log(this.field.arrayField );
    } else if (key === 'ArrowDown' && this.checkOpportunityMoveDownFigure(matrix, y, x)) {
      this.moveFigure(matrix, y, x, color, 1, 0);
    }
  }

  moveFigure(matrix, y, x, color, changeY, changeX) {
    this.deleteFigureFromField(matrix, y, x);
    this.paintFigureOnField(matrix, y, x, '');
    y += changeY; // изменяю координаты для фигуры, но локально только для этого метода
    x += changeX;
    this.figures.coordinateOrdinate = y; // глоабально изменяю координаты, кладу данные в поле класса
    this.figures.coordinateAbscissa = x;
    this.insertFigureOnField(matrix, y, x);
    this.paintFigureOnField(matrix, y, x, color);
  }

  checkOpportunityMoveHorizontalFigure(matrix, y, x, changeX) {
    let isOpportunityMove = true;
    if (changeX < 0 && x + this.searchFirstLeftNonEmptyElement(matrix) + changeX < 0) {
      isOpportunityMove = false;
    } else if (
      changeX > 0 &&
      x + this.searchFirstRightNonEmptyElement(matrix) + changeX >= this.field.arrayField[0].length
    ) {
      isOpportunityMove = false;
    }
    if (this.checkForOverlapFigure(matrix, y, x, changeX) !== true) {
      isOpportunityMove = false;
    }
    return isOpportunityMove;
  }

  searchFirstLeftNonEmptyElement(matrix) {
    for (let j = 0; j < matrix[0].length; j++) {
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][j] === 1) {
          return j;
        }
      }
    }
  }

  searchFirstRightNonEmptyElement(matrix) {
    for (let j = matrix[0].length - 1; j >= 0; j--) {
      for (let i = matrix.length - 1; i >= 0; i--) {
        if (matrix[i][j] === 1) {
          return j;
        }
      }
    }
  }

  checkForOverlapFigure(matrix, y, x, changeX) {
    let isOverlap = true;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1 && this.field.arrayField[y + i][x + j + changeX] === meanOfTheFixedFigure) {
          isOverlap = false;
        }
      }
    }
    return isOverlap;
  }

  turnFigure(matrix, y, x, color) {
    this.deleteFigureFromField(matrix, y, x);
    this.paintFigureOnField(matrix, y, x, '');
    matrix = this.turnMatrix(matrix);
    this.insertFigureOnField(this.figures.figureCurrent.matrix, y, x);
    this.paintFigureOnField(this.figures.figureCurrent.matrix, y, x, color);
  }

  turnMatrix(matrix) {
    matrix = this.matrixTranpose(matrix);
    return this.matrixReflection(matrix);
  }

  matrixTranpose(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i; j < matrix[i].length; j++) {
        [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
      }
    }
    return matrix;
  }

  matrixReflection(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < Math.floor(matrix[i].length / 2); j++) {
        [matrix[i][j], matrix[i][matrix.length - 1 - j]] = [matrix[i][matrix.length - 1 - j], matrix[i][j]];
      }
    }
    return matrix;
  }

  checkOpportunityTurnFigure(matrix, y, x) {
    let isOpportunityTurn = true;
    let cloneMatrix = cloneDeep(matrix);
    cloneMatrix = this.turnMatrix(cloneMatrix);
    if (
      this.searchFirstLeftNonEmptyElement(cloneMatrix) + x < 0 ||
      this.searchFirstRightNonEmptyElement(cloneMatrix) + x >= this.field.arrayField[0].length ||
      this.checkForOverlapFigure(cloneMatrix, y, x, 0) !== true
    ) {
      isOpportunityTurn = false;
    }
    return isOpportunityTurn;
  }

  checkCollectedString(matrix) {
    let index = -1;
    for (let i = 0; i < matrix.length; i++) {
      let count = 0;
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === meanOfTheFixedFigure) {
          count += 1;
        }
      }
      if (count === this.width) {
        index = i;
      }
    }
    return index;
  }

  deleteCollectedRow(matrix) {
    let isDelete = true;
    let countRowDeleted = 0;
    while (isDelete) {
      let indexString = this.checkCollectedString(matrix);
      if (indexString === -1) {
        isDelete = false;
      } else {
        this.arrayOffsetWhenDeleteRow(matrix, indexString);
        countRowDeleted += 1;
      }
    }
    this.score.makeScorePerRow(countRowDeleted);
    this.eventBus.publish('updateScore');
  }

  arrayOffsetWhenDeleteRow(matrix, index) {
    for (let i = index; i > 4; i--) {
      if (this.checkRowOnEmpty(matrix, index)) {
        for (let j = 0; j < matrix[i].length; j++) {
          matrix[i][j] = matrix[i - 1][j];
          this.eventBus.publish('deleteRowOnField', {row: i, column: j});
        }
      }
    }
  }

  checkRowOnEmpty(matrix, i) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== 0) {
        return true;
      }
    }
    return false;
  }

  subscribeOnRestartGame() {
    this.eventBus.subscribe('restartGame', () => {
      this.restartGame();
      clearInterval(this.timerId);
      this.processGame();
    });
  }

  restartGame() {
    this.field.cleanArrayField();
    this.eventBus.publish('cleanField');
    this.score.score = 0;
    this.eventBus.publish('updateScore');
  }

  addEventKeyDown() {
    document.addEventListener('keydown', (event) => {
      this.workWithPressKey(
        event.code,
        this.figures.figureCurrent.matrix,
        this.figures.coordinateOrdinate,
        this.figures.coordinateAbscissa,
        this.figures.figureCurrent.color
      );
    });
  }
}
