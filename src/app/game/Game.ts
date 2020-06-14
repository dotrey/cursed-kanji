import GameInput from "./GameInput.js";
import GameStatus from "./GameStatus.js";
import SimpleLoop from "./SimpleLoop.js";
import StateMachine from "./states/StateMachine.js";
import InitialState from "./states/InitialState.js";
import { render } from "../ui/views/GameView.js";
import WordPool from "../library/WordPool.js";
import LibraryWord from "../library/LibraryWord.js";

export default class Game {

    input : GameInput;
    status : GameStatus;
    loop : SimpleLoop;
    stateMachine : StateMachine;
    wordPool : WordPool

    constructor(wordPool : WordPool) {
        this.wordPool = wordPool;
        this.setup();
    }

    private setup() {
        
        this.input = new GameInput();
        this.status = new GameStatus();
        this.loop = new SimpleLoop();
        this.stateMachine = new StateMachine(this, new InitialState());

        // listen to player input
        this.input.attach((proposedText : string) => {
            this.status.proposedText = proposedText;
        });

        // attach the statemachine to the loop
        this.loop.attach(this.stateMachine.update.bind(this.stateMachine));

        // our "renderer" -> trigger a redraw in mithril
        this.loop.attach((ts : number, dt : number) => {
            render();
        });
    }

    nextWord() {
        this.wordPool.next().then((word : LibraryWord) => {

        });
    }

    checkProposal(proposedText : string) {
        if (!this.wordPool.current()) {
            return false;
        }
        return this.wordPool.current().romaji.indexOf(proposedText) > -1;
    }

    start() {
        this.wordPool.fill().then(() => {
            this.loop.start();
        });
    }

    stop() {
        this.loop.stop();
        this.stateMachine.setState(new InitialState());
    }
}