export default class SvgLoader {

    basePath : string = "./assets/kanjivg/";

    async loadInto(unicode : string, target : SVGElement) : Promise<boolean> {
        unicode = unicode.toLowerCase();
        while (unicode.length < 5) {
            unicode = "0" + unicode;
        }
        if (target.getAttribute("data-kanji") === unicode) {
            return true;
        }

        const response = await fetch(this.basePath + unicode + ".svg");
        let svg : string = await response.text();

        svg = svg.replace(/([\s\S]*?<svg[^>]*?>)([\s\S]*?)(<\/svg>)/, "$2");
        console.log(svg);

        target.innerHTML = svg;
        target.setAttribute("data-kanji", unicode);

        return true;
    }

}