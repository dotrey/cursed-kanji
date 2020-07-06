import StateMachineState from "./StateMachineState.js";
import KanjiState from "./KanjiState.js";
export default class InitialState extends StateMachineState {
    enter(game) {
        game.status.phase = "init";
    }
    update(game, ts, dt) {
        return new KanjiState();
    }
}
//# sourceMappingURL=InitialState.js.map