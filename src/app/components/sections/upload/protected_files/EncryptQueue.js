class EncryptQueue {
  constructor() {
    console.log('Hello');
    this.queue = [];
    this.running = false;
    this.canIrun = true;
    this.allCanceled = false;
  }

  add(file, setInProgress, setEncrypted) {
    this.allCanceled = false;

    const cb = function () {
      new Promise((resolve, reject) => {
        if (this.allCanceled) reject('All the encrypt events were cancelled!');

        setInProgress(true);

        /* Encrypt here */
        setTimeout(() => {
          console.log(`Archivo ${file} ya encriptado!`);

          if (this.allCanceled)
            reject('All the encrypt events were cancelled!');

          setInProgress(false);

          if (this.allCanceled)
            reject('All the encrypt events were cancelled!');

          setEncrypted(true);

          resolve();
        }, 1500);
      })
        .then(() => this.dequeue())
        .catch(error => console.log(error));
    }.bind(this);

    this.queue.push({ key: file, cb });

    if (!this.running) this.dequeue();

    return this;
  }

  cancel(file) {
    this.canIrun = false;
    let canceled = false;

    let index =
      this.queue.indexOf(this.queue.filter(q => q.key === file)[0]) ?? -1;

    if (index !== -1) {
      this.queue.splice(index, 1);
      canceled = true;
    }

    this.canIrun = true;
    if (!this.running) this.dequeue();
    return canceled;
  }

  cancelAll() {
    this.canIrun = false;
    this.queue = [];
    this.allCanceled = true;
    this.running = false;
    this.canIrun = true;
  }

  dequeue() {
    if (!this.canIrun) return;

    this.running = this.queue.shift();

    if (this.running) this.running.cb();

    return this.running;
  }
}

export { EncryptQueue };
