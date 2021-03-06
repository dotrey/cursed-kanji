import m from "../Mithril.js";
import Library from "../../library/Library.js";
import LibraryBook from "../../library/LibraryBook.js";

const MainView : any = {
    corruption : <number> 0,

    oninit(vnode : any) {
        vnode.attrs.cursed.library.loadIndex().then(() => {
            m.redraw();
        });
    },

    view(vnode : any) {
        return m(".container.main", [
            this.buildSettingsButton(),
            this.buildLibrary(vnode),
            this.buildGameLength(),
            this.buildGameStart(vnode)
        ]);
    },

    buildSettingsButton() {
        return m(".settings-button", {
            onclick : () => {
                window.location.hash = "#!/settings";
            }
        });
    },

    buildLibrary(vnode : any) {
        return m(".library", {
            onclick : () => {
                window.location.hash = "#!/library";
            }
        },[
            this.buildLibraryShelf(vnode),
            this.buildLibraryShelfButton()
        ])
    },

    buildLibraryShelf(vnode : any) {
        let library : Library = vnode.attrs.cursed.library as Library
        let books : any[] = [];
        if (library.index) {
            let totalCount : number = 0;
            for(let book of library.index.books) {
                totalCount += book.wordCount
            }
            let avgCount = totalCount / library.index.books.length;
            for(let book of library.index.books) {
                books.push(this.buildLibraryShelfBook(book, avgCount, !library.isBookEnabled(book.id)));
            }
        }
        return m(".library-shelf", books);
    },

    buildLibraryShelfBook(book : LibraryBook, avgWordCount : number, hidden : boolean) {
        if (avgWordCount === 0) {
            avgWordCount = 1;
        }
        let heightVariance : number = book.wordCount / avgWordCount - 1;
        // clamp to -1/1
        heightVariance = Math.min(1, Math.max(-1, heightVariance));
        let invisibleCss : string = "";
        if (hidden) {
            invisibleCss = "visibility: hidden;"
        }
        return m(".library-shelf-book",         
            m("div", {
                "style" : "background:" + book.color + ";"+
                    "height: calc(var(--book-height) + var(--book-height-variance) * " + heightVariance + ");"+
                    invisibleCss
            })
        );
    },

    buildLibraryShelfButton() {
        return m(".library-shelf-button", "select lessons");
    },

    buildGameLength() {
        return m(".game-length");
    },

    buildGameStart(vnode : any) {        
        let library : Library = vnode.attrs.cursed.library as Library
        library.cardbox.corruption().then((v : number) => {
            this.corruption = Math.floor(v * 100);
        })
        return m(".game-start", {
                onclick : () => {
                    window.location.hash = "#!/game";
                }
            }, [
                "start game",
                m(".game-corruption", "Corruption: " + this.corruption + "%")
            ]);
    }
}

export default MainView;