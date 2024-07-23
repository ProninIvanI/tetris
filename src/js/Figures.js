export class Figures {
  constructor() {
    this.informationFigures = this.makeFigures();
    this.figure = null;
    this.coordinateAbscissa = null;
    this.coordinateOrdinate = null;
  }

  makeFigures() {
    return {
      I: {
        matrix: [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        color: 'blue',
        number: 0,
      },
      Z: {
        matrix: [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0],
        ],
        color: 'green',
        number: 1,
      },
      O: {
        matrix: [
          [1, 1],
          [1, 1],
        ],
        color: '#ADFF2F', // жёлтый
        number: 2,
      },
      L: {
        matrix: [
          [1, 0, 0],
          [1, 0, 0],
          [1, 1, 0],
        ],
        color: 'orange',
        number: 3,
      },
      J: {
        matrix: [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        color: '#FF69B4', // розовый
        number: 4,
      },
      T: {
        matrix: [
          [1, 1, 1],
          [0, 1, 0],
          [0, 0, 0],
        ],
        color: 'purple',
        number: 5,
      },
      S: {
        matrix: [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0],
        ],
        color: 'red',
        number: 6,
      },
    };
  }

  getFigureByIndex(index) {
    const keyFigure = Object.keys(this.informationFigures).find((key) => this.informationFigures[key].number === index);
    return keyFigure !== undefined ? this.informationFigures[keyFigure] : null;
  }

  takeRandomFigure() {
    const index = Math.floor(Math.random() * 7);
    return this.getFigureByIndex(index);
  }

  calculationOrdinateFigure(figureMatrix) {
    return 4 - figureMatrix.length;
  }
}
