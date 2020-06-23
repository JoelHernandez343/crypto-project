class QueueMessage {
  constructor() {
    this.queue = [];
    this.setMessageInfo = () => 'Not implemented yet!';
    this.running = false;
  }

  set triggerer(setMessageInfo) {
    this.setMessageInfo = setMessageInfo;
  }

  add(information) {
    this.queue.push(() => {
      new Promise((resolve, reject) => {
        information.display = true;
        information.closeFunction = () =>
          resolve(this.setMessageInfo({ display: false }));
        this.setMessageInfo(information);
      }).then(() => this.dequeue());
    });

    if (!this.running) this.dequeue();

    return this;
  }

  dequeue() {
    this.running = this.queue.shift();
    if (this.running) {
      this.running();
    }

    return this.running;
  }
}

export default QueueMessage;
