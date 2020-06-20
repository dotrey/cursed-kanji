import LibraryWord from "../library/LibraryWord";

export default class GameStatus {
    // The current phase of the game:
    // init -> not started
    // kanji -> a kanji is shown, waiting for player to propose correct romaji
    // failed -> player failed to propose correct romaji within time
    // success -> player successfully proposed romaji
    phase : "init" | "kanji" | "failed" | "success" = "init";

    // The text entered by the player
    proposedText : string = "";

    // The kanji shown (actually, this can contain multiple symbols)
    kanji : string = "";
    // The word object 
    word : LibraryWord;

    // Each kanji will be shown for at max timelimit seconds
    timelimit : number = 0;
    // Counting the elapsed time in seconds, rounded to 1 digit
    elapsedSeconds : number = 0;
    // Counting the elapsed time as a percentage (0-1)
    elapsedTime : number = 0;
    // The remaining time in seconds, rounded to 1 digit
    remainingSeconds : number = 0;
    // The remaining time as percentage (0-1)
    remainingTime : number = 0;
}