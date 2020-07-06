export default class SimpleLoop {
    constructor() {
        this.engine = {
            lastTs: 0,
            running: false,
            updating: true
        };
        this.updateListeners = [];
    }
    attach(callback) {
        if (this.updateListeners.indexOf(callback) < 0) {
            this.updateListeners.push(callback);
        }
    }
    detach(callback) {
        const i = this.updateListeners.indexOf(callback);
        if (i > -1) {
            this.updateListeners.splice(i, 1);
        }
    }
    start() {
        this.engine.lastTs = 0;
        this.engine.running = true;
        this.engine.updating = true;
        this.requestFrame();
    }
    stop() {
        this.engine.running = false;
    }
    pause() {
        this.engine.updating = false;
    }
    resume() {
        this.engine.updating = true;
    }
    update(ts) {
        const deltaT = ts - (this.engine.lastTs || ts);
        if (this.engine.updating && this.engine.running) {
            for (const listener of this.updateListeners) {
                listener(ts, deltaT);
            }
        }
        this.engine.lastTs = ts;
        if (this.engine.running) {
            this.requestFrame();
        }
    }
    requestFrame() {
        window.requestAnimationFrame(this.update.bind(this));
    }
}
//# sourceMappingURL=SimpleLoop.js.map