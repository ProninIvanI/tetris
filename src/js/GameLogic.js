import { Figures } from './Figures';
import { Field } from './Field';

export class GameLogic {
  constructor(width, height) {
    this.height = height + 4; // увеличиваю на 4, чтобы вставлять в эту область фигуры, но она не будет отбражаться
    this.width = width;
    this.figures = new Figures();
    this.field = new Field(this.width, this.height);
  }

  processGame() {
    let flagCreateNewFigure = true;

    const timerId = setInterval(() => {
      if (this.checkEndGameCondition()) {
        if (flagCreateNewFigure) {
          this.figures.figure = this.figures.takeRandomFigure();
          this.figures.coordinateAbscissa = 3;
          this.figures.coordinateOrdinate = this.figures.calculationOrdinateFigure(this.figures.figure.matrix);
          this.insertFigureOnField(
            this.figures.figure.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa
          );
          flagCreateNewFigure = false;
        }
        if (
          this.checkOpportunityMoveDownFigure(
            this.figures.figure.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa
          )
        ) {
          this.moveFigure(
            this.figures.figure.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa,
            this.figures.figure.color,
            1,
            0
          );
        } else {
          this.insertFigureInArray(
            this.figures.figure.matrix,
            this.figures.coordinateOrdinate,
            this.figures.coordinateAbscissa
          );
          flagCreateNewFigure = true;
        }
      } else {
        clearInterval(timerId);
      }
    }, 200);

    document.addEventListener('keydown', (event) => {
      this.workWithPressKey(
        event.code,
        this.figures.figure.matrix,
        this.figures.coordinateOrdinate,
        this.figures.coordinateAbscissa,
        this.figures.figure.color
      );
    });
  }

  paintFigureOnField(matrix, y, x, color) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          const cell = document.getElementById('str' + (y + i - 4) + 'cell' + (x + j));
          if (y + i > 3) {
            cell.style.backgroundColor = color;
          }
        }
      }
    }
  }

  insertFigureInArray(matrix, y, x) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          this.field.arrayField[y + i][x + j] = 2;
        }
      }
    }
  }

  calculationOrdinateFigure(figureMatrix) {
    return 4 - figureMatrix.length;
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
    let flag = true;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        // проверяю, что у меня в матрице элемента я работаю именно с крайним
        if (
          (matrix[i][j] === 1 && i + 1 < matrix.length && matrix[i + 1][j] === 0) ||
          (matrix[i][j] === 1 && i + 1 === matrix.length)
        ) {
          // проверяю что крайний элемент матрицы имеет возможность упасть
          if (y + i + 1 >= this.field.arrayField.length || this.field.arrayField[y + i + 1][x + j] !== 0) {
            flag = false;
          }
        }
      }
    }
    return flag;
  }

  // метод проверки условия конца игры, при окончании должно вернуть true
  checkEndGameCondition() {
    if (this.field.arrayField[3].indexOf(2) === -1) {
      return true;
    }
    return false;
  }

  workWithPressKey(key, matrix, y, x, color) {
    if (key === 'ArrowRight' && this.checkOpportunityMoveHorizontalFigure(matrix, y, x, 1)) {
      this.moveFigure(matrix, y, x, color, 0, 1);
    } else if (key === 'ArrowLeft' && this.checkOpportunityMoveHorizontalFigure(matrix, y, x, -1)) {
      this.moveFigure(matrix, y, x, color, 0, -1);
    } else if (key === 'Space' && this.checkOpportunityTurnFigure(matrix, y, x)) {
      this.turnFigure(matrix, y, x, color);
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
    let flag = true;
    if (changeX < 0 && x + this.searchFirstLeftNonEmptyElement(matrix) + changeX < 0) {
      flag = false;
    } else if (
      changeX > 0 &&
      x + this.searchFirstRightNonEmptyElement(matrix) + changeX >= this.field.arrayField[0].length
    ) {
      flag = false;
    }
    if (this.checkForOverlapFigure(matrix, y, x, changeX) !== true) {
      flag = false;
    }
    return flag;
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
    let flag = true;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1 && this.field.arrayField[y + i][x + j + changeX] === 2) {
          flag = false;
        }
      }
    }
    return flag;
  }

  turnFigure(matrix, y, x, color) {
    this.deleteFigureFromField(matrix, y, x);
    this.paintFigureOnField(matrix, y, x, '');
    this.figures.figure.matrix = this.turnMatrix(matrix);
    this.insertFigureOnField(this.figures.figure.matrix, y, x);
    this.paintFigureOnField(this.figures.figure.matrix, y, x, color);
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
    let flag = true;
    const _ = require('lodash');
    let cloneMatrix = _.cloneDeep(matrix);
    cloneMatrix = this.turnMatrix(cloneMatrix);
    if (
      this.searchFirstLeftNonEmptyElement(cloneMatrix) + x < 0 ||
      this.searchFirstRightNonEmptyElement(cloneMatrix) + x >= this.field.arrayField[0].length ||
      this.checkForOverlapFigure(cloneMatrix, y, x, 0) !== true
    ) {
      flag = false;
    }
    return flag;
  }
}
