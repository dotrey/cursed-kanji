import LibraryBookFileStructure from "./files/LibraryBookFileStructure.js";
import LibraryWord from "./LibraryWord.js";
import LibraryIndexBookFileStructure from "./files/LibraryIndexBookFileStructure.js";
import ColorConverter from "../../util/ColorConverter.js";

export default class LibraryBook implements LibraryBookFileStructure, LibraryIndexBookFileStructure {
    id : string = "";
    name : string = "";
    file : string = "";
    group : string = "";
    words : LibraryWord[];
    // This will be initialized from the index and will become useless once the
    // actual book content is loaded.
    _wordCount : number = 0;

    get wordCount() : number {
        return this.words ? this.words.length : this._wordCount;
    }

    private _color : string = "";
    get color() : string {
        if (!this._color) {
            // the color is based off of the book's id
            let value : string = this.id;

            let hue = 0;
            let lightness = 50;
            let saturation = 50;
            // loop over the input and assign the current characters value to hls
            for (var i = 0, ic = value.length; i < ic; i++) {
                switch (i % 3) {
                    case 0:
                        hue = (hue + value.charCodeAt(i) * i) % 360;
                        break;
                    case 1:
                        lightness = (lightness + value.charCodeAt(i) * i) % 100;
                        break;
                    case 2:
                        saturation = (saturation + value.charCodeAt(i) * i) % 100;
                        break;
                }
            }

            // clamp lightness between 20% and 70%
            lightness = Math.max(20, Math.min(70, lightness));

            // clamp saturation between 50% and 100%
            saturation = Math.max(50, Math.min(100, saturation));

            var rgb = ColorConverter.hslToRgb(hue / 360, saturation / 100, lightness / 100);

            this._color = "#" + (rgb.r < 16 ? "0" : "") + rgb.r.toString(16)
                        + (rgb.g < 16 ? "0" : "") + rgb.g.toString(16)
                        + (rgb.b < 16 ? "0" : "") + rgb.b.toString(16);
        }
        
        return this._color;
    }
}