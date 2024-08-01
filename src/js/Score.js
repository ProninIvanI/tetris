export class Score {
  constructor() {
    this.score = 0;
  }

  makeScorePerRow(countRow) {
    this.score += 10 * countRow + 2.5 * countRow * countRow + 2.5 * countRow;
  }
}
