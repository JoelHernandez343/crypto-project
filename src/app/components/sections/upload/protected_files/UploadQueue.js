import { uploadFile } from '../../../../helpers/drive';

class UploadQueue {
  constructor() {
    this.queue = [];
    this.running = false;
  }

  add(file, setUploaded) {
    this.queue.push(() =>
      new Promise(async resolve => {
        setUploaded(await uploadFile(file));
        resolve();
      }).then(() => this.dequeue())
    );

    if (!this.running) this.dequeue();

    return this;
  }

  dequeue() {
    this.running = this.queue.shift();

    if (this.running) this.running();

    return this.running;
  }
}

export { UploadQueue };
