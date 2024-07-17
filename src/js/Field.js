export class Field {
  constructor(height, width) {
    this.width = width;
    this.height = height;
    this.arrayField = this.createArrayField();
  }

  createArrayField() {
    const array = new Array(this.width);
    for (let i = 0; i < this.width; i += 1) {
      array[i] = new Array(this.height);
      for (let j = 0; j < this.height; j += 1) {
        array[i][j] = 0;
      }
    }
    return array;
  }
}
