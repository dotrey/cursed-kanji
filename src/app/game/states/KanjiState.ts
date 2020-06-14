import StateMachineState from "./StateMachineState.js";
import Game from "../Game.js";
import FailedState from "./FailedState.js";

/**
 * In this state a kanji is shown and the game waits for the player to 
 * enter the correct romaji.
 */
export default class KanjiState extends StateMachineState {

    private timelimit : number = 30;
    private elapsedTime : number = 0;

    enter(game : Game) {
        // TODO select a word
        game.input.clearProposal();
        game.status.kanji = "&#x3042;"

        game.status.phase = "kanji";
    }

    update(game : Game, ts : number, dt : number) : StateMachineState {
        this.elapsedTime += dt;

        if (this.elapsedTime < this.timelimit * 1000) {
            game.status.timelimit = this.timelimit;
            game.status.elapsedSeconds = Math.round(this.elapsedTime / 100) / 10;
            game.status.remainingSeconds = Math.round((this.timelimit - game.status.elapsedSeconds) * 10) / 10;
            game.status.elapsedTime = this.elapsedTime / (this.timelimit * 1000);
            game.status.remainingTime = 1 - game.status.elapsedTime;
        }else{
            // time limit exceeded
            return new FailedState();
        }

        return null;
    }

}