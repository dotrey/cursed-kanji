import GameInput from "./GameInput.js";
import GameStatus from "./GameStatus.js";
import SimpleLoop from "./SimpleLoop.js";
import StateMachine from "./states/StateMachine.js";
import InitialState from "./states/InitialState.js";
import { render } from "../ui/views/GameView.js";
export default class Game {
    constructor(wordPool) {
        this.wordPool = wordPool;
        this.setup();
    }
    setup() {
        this.input = new GameInput();
        this.status = new GameStatus();
        this.loop = new SimpleLoop();
        this.stateMachine = new StateMachine(this, new InitialState());
        this.input.attach((proposedText) => {
            this.status.proposedText = proposedText;
        });
        this.loop.attach(this.stateMachine.update.bind(this.stateMachine));
        this.loop.attach((ts, dt) => {
            render();
        });
    }
    start() {
        this.wordPool.clear();
        this.wordPool.fill().then(() => {
            this.loop.start();
        });
    }
    stop() {
        this.loop.stop();
        this.stateMachine.setState(new InitialState());
    }
    pause() {
        this.loop.pause();
    }
    resume() {
        this.loop.resume();
    }
}
//# sourceMappingURL=Game.js.map