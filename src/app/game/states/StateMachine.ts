import StateMachineState from "./StateMachineState.js";
import Game from "../Game.js";

export default class StateMachine {

    private currentState : StateMachineState;
    private game : Game;

    constructor(game : Game, initialState : StateMachineState) {
        this.game = game;
        this.currentState = initialState;
    }

    setState(state : StateMachineState) {
        this.currentState = state;
    }

    update(ts : number, dt : number) {
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