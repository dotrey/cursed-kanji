export default class StateMachine {
    constructor(game, initialState) {
        this.game = game;
        this.currentState = initialState;
    }
    setState(state) {
        this.currentState = state;
    }
    update(ts, dt) {
        if (!this.currentState) {
            return;
        }
        const state = this.currentState.update(this.game, ts, dt);
        if (state) {
            this.currentState.leave(this.game);
            this.currentState = state;
            this.currentState.enter(this.game);
        }
    }
}
//# sourceMappingURL=StateMachine.js.map