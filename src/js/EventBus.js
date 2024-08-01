export class EventBus {
  constructor() {
    this.eventObject = {};
  }

  subscribe(eventName, callback) {
    if (!this.eventObject[eventName]) {
      this.eventObject[eventName] = [];
    }
    this.eventObject[eventName].push(callback);
  }

  publish(eventName, data = {}) {
    const callbackList = this.eventObject[eventName];

    for (const callback of callbackList) {
      callback(data);
    }
  }
}
