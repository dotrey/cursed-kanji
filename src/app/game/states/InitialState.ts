import StateMachineState from "./StateMachineState.js";
import Game from "../Game.js";
import KanjiState from "./KanjiState.js";

/**
 * The InitialState will always return a new KanjiState on the next update.
 */
export default class InitialState extends StateMachineState {

    enter(game : Game) {
        game.status.phase = "init";
    }

    update(game : Game, ts : number, dt : number) : StateMachineState {
        return new KanjiState();
    }

}