import StateMachineState from "./StateMachineState.js";
import FailedState from "./FailedState.js";
import SuccessState from "./SuccessState.js";
export default class KanjiState extends StateMachineState {
    constructor() {
        super(...arguments);
        this.timelimit = 15;
        this.elapsedTime = 0;
    }
    enter(game) {
        game.status.kanji = "";
        game.wordPool.next().then((word) => {
            game.input.clearProposal();
            game.status.phase = "kanji";
            let tmp = word.id.split(";");
            let kanji = "";
            for (const t of tmp) {
                kanji += "&#x" + t + ";";
            }
            game.status.kanji = kanji;
            game.status.word = word;
        });
    }
    update(game, ts, dt) {
        if (!game.status.kanji) {
            return null;
        }
        this.elapsedTime += dt;
        if (this.checkProposal(game)) {
            game.wordPool.markCurrentWordCorrect();
            return new SuccessState();
        }
        if (this.elapsedTime < this.timelimit * 1000) {
            game.status.timelimit = this.timelimit;
            game.status.elapsedSeconds = Math.round(this.elapsedTime / 100) / 10;
            game.status.remainingSeconds = Math.round((this.timelimit - game.status.elapsedSeconds) * 10) / 10;
            game.status.elapsedTime = this.elapsedTime / (this.timelimit * 1000);
            game.status.remainingTime = 1 - game.status.elapsedTime;
        }
        else {
            game.wordPool.markCurrentWordWrong();
            return new FailedState();
        }
        return null;
    }
    checkProposal(game) {
        if (!game.wordPool.current() || !game.status.proposedText) {
            return false;
        }
        return game.wordPool.current().romaji.indexOf(game.status.proposedText) > -1;
    }
}
//# sourceMappingURL=KanjiState.js.map