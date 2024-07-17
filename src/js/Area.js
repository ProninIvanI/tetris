export class Area {
  constructor(width, height) {
    this.height = height;
    this.width = width;
  }

  createPage() {
    this.createAreaField();
    this.createField(this.height, this.width);
  }

  createAreaField() {
    const areaField = document.createElement('div');
    areaField.id = 'areaField';
    areaField.className = 'areaField';
    document.body.append(areaField);
  }

  createField(heightField, widthField) {
    const areaField = document.getElementById('areaField');
    for (let i = 0; i < heightField; i += 1) {
      const stringDiv = document.createElement('div');
      stringDiv.id = 'strDiv' + i;
      stringDiv.className = 'stringField';
      areaField.appendChild(stringDiv);
      for (let j = 0; j < widthField; j += 1) {
        const cell = document.createElement('div');
        cell.id = 'str' + i + 'cell' + j;
        cell.className = 'collumnField';
        stringDiv.appendChild(cell);
      }
    }
  }
}
