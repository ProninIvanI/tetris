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
    let figure;
    let coordinateAbscissaFigure;
    let coordinateOrdinateFigure;

    const timerId = setInterval(() => {
      if (this.checkEndGameCondition()) {
        if (flagCreateNewFigure) {
          figure = this.takeRandomFigure();
          coordinateAbscissaFigure = 3;
          coordinateOrdinateFigure = this.calculationOrdinateFigure(figure.matrix);
          this.insertFigureOnField(figure.matrix, coordinateOrdinateFigure, coordinateAbscissaFigure);
          flagCreateNewFigure = false;
        }
        if (this.checkOpportunityMoveFigure(figure.matrix, coordinateOrdinateFigure, coordinateAbscissaFigure)) {
          this.deleteFigureFromField(figure.matrix, coordinateOrdinateFigure, coordinateAbscissaFigure);
          this.paintFigureOnField(figure.matrix, coordinateOrdinateFigure, coordinateAbscissaFigure, '');
          coordinateOrdinateFigure += 1;
          this.insertFigureOnField(figure.matrix, coordinateOrdinateFigure, coordinateAbscissaFigure);
          this.paintFigureOnField(figure.matrix, coordinateOrdinateFigure, coordinateAbscissaFigure, figure.color);
        } else {
          this.insertFigureInArray(figure.matrix, coordinateOrdinateFigure, coordinateAbscissaFigure);
          flagCreateNewFigure = true;
        }
      } else {
        clearInterval(timerId);
      }
    }, 200);
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

  checkOpportunityMoveFigure(matrix, y, x) {
    let flag = true;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        // проверяю, что у меня в матрице элемента я работаю именно с крайним
        if (
          (matrix[i][j] === 1 && i + 1 < matrix.length && matrix[i + 1][j] === 0)
          || (matrix[i][j] === 1 && i + 1 === matrix.length)
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

  takeRandomFigure() {
    const index = Math.floor(Math.random() * 7);
    // const index = 3
    return this.figures.getFigureByIndex(index);
  }
}
