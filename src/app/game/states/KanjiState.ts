import StateMachineState from "./StateMachineState.js";
import Game from "../Game.js";
import FailedState from "./FailedState.js";
import SuccessState from "./SuccessState.js";
import LibraryWord from "../../library/LibraryWord.js";

/**
 * In this state a kanji is shown and the game waits for the player to 
 * enter the correct romaji.
 */
export default class KanjiState extends StateMachineState {

    private timelimit : number = 15;
    private elapsedTime : number = 0;

    enter(game : Game) {
        game.status.kanji = ""
        game.wordPool.next().then((word : LibraryWord) => {
            game.input.clearProposal();
            game.status.phase = "kanji";
            let tmp : string[] = word.id.split(";");
            let kanji : string = "";
            for(const t of tmp) {
                kanji += "&#x" + t + ";";
            }
            game.status.kanji = kanji;
            game.status.word = word;
        });
    }

    update(game : Game, ts : number, dt : number) : StateMachineState {
        if (!game.status.kanji) {
            // no kanji set, probably waiting for pool
            // -> let game run, but don't increase elapsed time
            return null;
        }

        this.elapsedTime += dt;

        if (this.checkProposal(game)) {
            // player successfully entered the correct romaji
            game.wordPool.markCurrentWordCorrect();
            return new SuccessState();
        }

        if (this.elapsedTime < this.timelimit * 1000) {
            game.status.timelimit = this.timelimit;
            game.status.elapsedSeconds = Math.round(this.elapsedTime / 100) / 10;
            game.status.remainingSeconds = Math.round((this.timelimit - game.status.elapsedSeconds) * 10) / 10;
            game.status.elapsedTime = this.elapsedTime / (this.timelimit * 1000);
            game.status.remainingTime = 1 - game.status.elapsedTime;
        }else{
            // time limit exceeded
            game.wordPool.markCurrentWordWrong();
            return new FailedState();
        }

        return null;
    }

    private checkProposal(game : Game) {
        if (!game.wordPool.current() || !game.status.proposedText) {
            return false;
        }
        return game.wordPool.current().romaji.indexOf(game.status.proposedText) > -1;
    }

}