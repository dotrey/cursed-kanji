import StateMachineState from "./StateMachineState.js";
import Game from "../Game.js";
import KanjiState from "./KanjiState.js";

/**
 * In this state the user failed to enter the correct romaji within time.
 */
export default class FailedState extends StateMachineState {

    private duration : number = 2000;
    private elapsedTime : number = 0;

    enter(game : Game) {
        game.status.phase = "failed";
    }

    update(game : Game, ts : number, dt : number) : StateMachineState {
        this.elapsedTime += dt;

        if (this.elapsedTime > this.duration) {
            return new KanjiState();
        }

        return null;
    }

}