import iconRestart  from '../images/restart.svg'
import { bufferSizeField } from './Constants';
import { invisiblePartArrayField } from './Constants';

export class Area {
  constructor(width, height, score, eventBus) {
    this.height = height;
    this.width = width;
    this.score = score;
    this.eventBus = eventBus;
  }

  createPage() {
    this.createArea();
    this.createAreaField();
    this.createAreaFunctionality();
    this.subscribeOnEventCleanField();
    this.subscribeOnEvenPaintFigure();
    this.subscribeOnEventDeleteRowOnField();
  }

  createArea() {
    const area = document.createElement('div');
    area.id = 'area';
    area.className = 'area';
    document.body.append(area);
  }

  createAreaField() {
    const areaField = document.createElement('div');
    areaField.id = 'areaField';
    areaField.className = 'areaField';
    const area = document.getElementById('area');
    area.appendChild(areaField);
    this.createField(this.height, this.width);
  }

  createAreaFunctionality() {
    const areaFunctionality = document.createElement('div');
    areaFunctionality.id = 'areaFunctionality';
    areaFunctionality.className = 'areaFunctionality';
    const area = document.getElementById('area');
    area.appendChild(areaFunctionality);
    this.createAreaWithGameInforamation();
    this.createAreaButton();
  }

  createAreaWithGameInforamation() {
    const gameInformation = document.createElement('div');
    gameInformation.id = 'gameInformation';
    gameInformation.className = 'gameInformation';
    const areaFunctionality = document.getElementById('areaFunctionality');
    areaFunctionality.appendChild(gameInformation);
    this.createAreaScore();
    this.createLabelNextFigure();
    this.createAreaNextFigureContainer();
    this.createAreaNextFigure();

    this.eventBus.subscribe('showMessageAboutEndGame', () => {
      this.createContainerMessage();
    });
  }

  createAreaButton() {
    const areaButton = document.createElement('div');
    areaButton.id = 'areaButton';
    areaButton.className = 'areaButton';
    const areaFunctionality = document.getElementById('areaFunctionality');
    areaFunctionality.appendChild(areaButton);
    this.createButtonRestart();
  }

  createButtonRestart() {
    const buttonRestart = document.createElement('button');
    buttonRestart.id = 'buttonRestart';
    buttonRestart.className = 'buttonRestart';
    buttonRestart.onclick = () => {
      this.eventBus.publish('restartGame');
      buttonRestart.blur();
    }
    const areaButton = document.getElementById('areaButton');
    areaButton.appendChild(buttonRestart);
    this.addButtonRestartSvg()
  }

  addButtonRestartSvg() {
    const svgRestart = document.createElement('img');
    svgRestart.id = 'svgRestart';
    svgRestart.className = 'svgRestart';
    svgRestart.src = iconRestart;
    const buttonRestart = document.getElementById('buttonRestart');
    buttonRestart.appendChild(svgRestart);
  }

  createAreaScore() {
    const areaScore = document.createElement('div');
    areaScore.id = 'areaScore';
    areaScore.className = 'areaScore';
    areaScore.textContent = 'счёт: ' + this.score.score;
    const gameInformation = document.getElementById('gameInformation');
    gameInformation.appendChild(areaScore);

    this.eventBus.subscribe('updateScore', () => {
      this.displayChangeScore();
    });
  }

  createLabelNextFigure() {
    const labelNextFigure = document.createElement('div');
    labelNextFigure.id = 'labelNextFigure';
    labelNextFigure.className = 'labelNextFigure';
    labelNextFigure.textContent = 'Следущая фигура';
    const gameInformation = document.getElementById('gameInformation');
    gameInformation.appendChild(labelNextFigure);
  }
  createAreaNextFigureContainer() {
    const areaNextFigureContainer = document.createElement('div');
    areaNextFigureContainer.id = 'areaNextFigureContainer';
    areaNextFigureContainer.className = 'areaNextFigureContainer';
    const gameInformation = document.getElementById('gameInformation');
    gameInformation.appendChild(areaNextFigureContainer);
  }

  createAreaNextFigure() {
    const areaNextFigure = document.createElement('div');
    areaNextFigure.id = 'areaNextFigure';
    areaNextFigure.className = 'areaNextFigure';
    const areaNextFigureContainer = document.getElementById('areaNextFigureContainer');
    areaNextFigureContainer.appendChild(areaNextFigure);

    this.eventBus.subscribe('updateNextFigure', (figure) => {
      this.removeFieldForNextFigure();
      this.createFieldForNextFigure(figure.matrix);
      this.paintNextFigure(figure.matrix, figure.color);
    });
  }

  removeFieldForNextFigure() {
    const areaNextFigure = document.getElementById('areaNextFigure');
    areaNextFigure.innerHTML = '';
  }



  createFieldForNextFigure(matrix) {
    const areaNextFigure = document.getElementById('areaNextFigure');
    for (let i = 0; i < matrix.length; i++) {
      const strDiv = document.createElement('div');
      strDiv.id = 'strDivNextFigure' + i;
      strDiv.className = 'strDivNextFigure';
      areaNextFigure.appendChild(strDiv);
      for (let j = 0; j < matrix[i].length; j++) {
        const cell = document.createElement('div');
        if (matrix[i][j] === 1) {
          cell.id = 'str' + i + 'cell' + j + 'NextFigureColor';
          cell.className = 'collumnFieldNextFigureColor';
        } else {
          cell.id = 'str' + i + 'cell' + j + 'NextFigureColorless';
          cell.className = 'collumnFieldNextFigureColorless';
        }
        strDiv.appendChild(cell);
      }
    }
  }

  paintNextFigure(matrix, color) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 1) {
          const cell = document.getElementById('str' + i + 'cell' + j + 'NextFigureColor');
          cell.style.backgroundColor = color;
        }
      }
    }
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

  displayChangeScore() {
    const areaScore = document.getElementById('areaScore');
    areaScore.textContent = 'счёт: ' + this.score.score;
  }

  createContainerMessage() {
    const containerMessage = document.createElement('div');
    containerMessage.id = 'containerMessage';
    containerMessage.className = 'containerMessage';
    const gameInformation = document.getElementById('gameInformation');
    gameInformation.appendChild(containerMessage);
    this.createAreaMessageAboutEndGameContainer();
  }

  createAreaMessageAboutEndGameContainer() {
    const containerMessageAboutEndGame = document.createElement('div');
    containerMessageAboutEndGame.id = 'containerMessageAboutEndGame';
    containerMessageAboutEndGame.className = 'containerMessageAboutEndGame';
    const containerMessage = document.getElementById('containerMessage');
    containerMessage.appendChild(containerMessageAboutEndGame);
    this.createMessageAboutEndGame();
  }

  createMessageAboutEndGame() {
    const messageAboutEndGame = document.createElement('div');
    messageAboutEndGame.id = 'messageAboutEndGame';
    messageAboutEndGame.className = 'messageAboutEndGame';
    messageAboutEndGame.textContent = 'Вы проиграли!';
    const containerMessageAboutEndGame = document.getElementById('containerMessageAboutEndGame');
    containerMessageAboutEndGame.appendChild(messageAboutEndGame);
  }

  subscribeOnEventCleanField() {
    this.eventBus.subscribe('cleanField', () => {
      this.cleanField();
      this.deleteMessageAboutEndGame();
    });
  }

  cleanField() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const cell = document.getElementById('str' + i + 'cell' + j);
        cell.style.backgroundColor = '';
      }
    }
  }

  deleteMessageAboutEndGame() {
    const containerMessage = document.getElementById('containerMessage');
    if (containerMessage !== null) {
      containerMessage.innerHTML = ""
      containerMessage.remove();
    }
  }

  subscribeOnEvenPaintFigure() {
    this.eventBus.subscribe('paintFigure', (data) => {
      const cell = document.getElementById('str' + (data.MoveY - bufferSizeField) + 'cell' + (data.MoveX));
      if (data.MoveY > invisiblePartArrayField) {
        cell.style.backgroundColor = data.colorCell;
      }
    });
  }

  subscribeOnEventDeleteRowOnField() {
    this.eventBus.subscribe('deleteRowOnField', (data) => {
      console.log(bufferSizeField);
      const cell = document.getElementById('str' + (data.row - bufferSizeField) + 'cell' + data.column);
      const cellHigher = document.getElementById('str' + (data.row - bufferSizeField - 1) + 'cell' + data.column);
      cell.style.backgroundColor = cellHigher.style.backgroundColor;
    });
  }
}
