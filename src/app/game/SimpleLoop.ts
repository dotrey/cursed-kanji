export default class SimpleLoop {

    private engine = {
        lastTs : <number> 0,
        running : <boolean> false,
        updating : <boolean> true
    };

    private updateListeners : ((ts : number, dt : number) => void)[] = [];

    attach(callback : (ts : number, dt : number) => void) {
        if (this.updateListeners.indexOf(callback) < 0) {
            this.updateListeners.push(callback);
        }
    }

    detach(callback : (ts : number, dt : number) => void) {
        const i : number = this.updateListeners.indexOf(callback);
        if (i > -1) {
            this.updateListeners.splice(i, 1);
        }
    }

    public start() {
        this.engine.lastTs = 0;
        this.engine.running = true;
        this.engine.updating = true;
        this.requestFrame();
    }

    public stop() {
        this.engine.running = false;
    }

    public pause() {
        this.engine.updating = false;
    }

    public resume() {
        this.engine.updating = true;
    }

    private update(ts : number) {
        // get the time since the last update
        const deltaT : number = ts - (this.engine.lastTs || ts);

        if (this.engine.updating && this.engine.running) {
            for(const listener of this.updateListeners) {
                listener(ts, deltaT);
            }
        }

        this.engine.lastTs = ts;
        if (this.engine.running) {
            this.requestFrame();
        }
    }

    private requestFrame() {
        window.requestAnimationFrame(this.update.bind(this));
    }
}