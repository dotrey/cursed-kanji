import Game from "../Game.js";

export default class StateMachineState {

    /**
     * Will be called when the game enters this state
     * @param game 
     */
    enter(game : Game) {

    }

    /**
     * Will be called when the game leaves this state
     * @param game 
     */
    leave(game : Game) {

    }

    /**
     * Will be called during the regular update loop
     * @param game
     * @param ts 
     * @param dt 
     */
    update(game : Game, ts : number, dt : number) : StateMachineState {
        return null;
    }

}