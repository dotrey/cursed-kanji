import StateMachineState from "./StateMachineState.js";
import KanjiState from "./KanjiState.js";
export default class FailedState extends StateMachineState {
    constructor() {
        super(...arguments);
        this.duration = 2000;
        this.elapsedTime = 0;
    }
    enter(game) {
        game.status.phase = "failed";
    }
    update(game, ts, dt) {
        this.elapsedTime += dt;
        if (this.elapsedTime > this.duration) {
            return new KanjiState();
        }
        return null;
    }
}
//# sourceMappingURL=FailedState.js.map