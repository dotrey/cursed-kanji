const m = window.m || undefined;

const TestView = {
    view() {
        return m("div", "hello world");
    }
};

const RomajiBoardView = {
    orientation: "",
    layout: "aiueo",
    layouts: {
        "aiueo": {
            vocal: "aiueo",
            consonant: "kshtcnfmyrwgzjdbpy"
        },
        "aiueo-bz": {
            vocal: "aiueo",
            consonant: "bcdfghjkmynprstwyz",
        },
        "a-z": {
            vocal: "aeiou",
            consonant: "bcdfghjkmynprstwyz"
        }
    },
    oncreate(vnode) {
        vnode.attrs.game.input.registerRomajiBoard("game-romajiboard");
        this.layout = vnode.attrs.settings.romajiBoardLayout;
        this.orientation = vnode.attrs.settings.romajiBoardOrientation;
    },
    view() {
        return m(".romajiboard" +
            (this.orientation ? "." : "") + this.orientation, {
            "id": "game-romajiboard"
        }, [
            this.buildVocalPanel(),
            this.buildConsonantPanel()
        ]);
    },
    buildVocalPanel() {
        const keys = this.getVocals();
        return m(".romajiboard-scrollrow", m(".romajiboard-panel", {}, keys.map((k) => {
            return this.buildKey(k);
        })));
    },
    buildConsonantPanel() {
        const panels = this.getConsonants();
        return m(".romajiboard-scrollrow", {
            "data-scrollable": "1",
            "style": "top: var(--panel-height);"
        }, [
            panels.map((keys, i) => {
                return m(".romajiboard-panel", {
                    "style": "left: " + (i * 100) + "vw;"
                }, keys.map((key) => {
                    return this.buildKey(key);
                }));
            })
        ]);
    },
    buildKey(key) {
        return m(".romajiboard-key", {
            "data-key": key
        }, key);
    },
    getVocals() {
        return this.layouts[this.layout].vocal.split("");
    },
    getConsonants() {
        let r = [];
        let remaining = this.layouts[this.layout].consonant;
        while (remaining.length > 0) {
            let part = remaining.substr(0, Math.min(5, remaining.length));
            remaining = remaining.substr(part.length);
            let tmp = part.split("");
            while (tmp.length < 5) {
                tmp.push("");
            }
            r.push(tmp);
        }
        return r;
    }
};

const RomajiProposalView = {
    oncreate(vnode) {
        vnode.attrs.game.input.registerRomajiProposal("game-romaji-proposal");
    },
    view(vnode) {
        return m(".romaji-proposal", {
            "id": "game-romaji-proposal"
        }, [
            m(".romaji-proposal-text", {
                onupdate: function (vnode) {
                    if (vnode.dom.scrollWidth > vnode.dom.offsetWidth) {
                        let currentSize = parseInt(vnode.dom.style.fontSize || 100);
                        let resize = (function (e, size) {
                            return function () {
                                size--;
                                e.style.fontSize = size + "%";
                                if (e.scrollWidth > e.offsetWidth && size > 1) {
                                    window.requestAnimationFrame(resize);
                                }
                            };
                        })(vnode.dom, currentSize);
                        resize();
                    }
                    else {
                        let currentSize = parseInt(vnode.dom.style.fontSize || 100);
                        vnode.dom.style.fontSize = currentSize + "%";
                    }
                }
            }, vnode.attrs.game.status.proposedText),
            m(".romaji-proposal-undo", m.trust("&larr;")),
            m(".romaji-proposal-clear", m.trust("&times;"))
        ]);
    }
};

const KanjiCardView = {
    lastKanji: "",
    view(vnode) {
        let phase = vnode.attrs.game.status.phase;
        let seconds = "" + vnode.attrs.game.status.remainingSeconds;
        if (seconds.indexOf(".") < 0) {
            seconds += ".0";
        }
        return [
            m(".kanjicard.phase-" + phase, {
                onclick: () => {
                    window.location.hash = "#!/game/detail";
                }
            }, [
                m(".kanjicard-word", {
                    onupdate: function (vnode) {
                        if (vnode.dom.innerText !== KanjiCardView.lastKanji) {
                            let scale = 1;
                            if (vnode.dom.offsetWidth > vnode.dom.parentNode.offsetWidth) {
                                scale = vnode.dom.parentNode.offsetWidth / vnode.dom.offsetWidth;
                            }
                            vnode.dom.setAttribute("style", "--scale:" + scale);
                            KanjiCardView.lastKanji = vnode.dom.innerText;
                        }
                    }
                }, m.trust(vnode.attrs.game.status.kanji)),
                m(".kanjicard-timer", seconds),
                m(".kanjicard-details", "tap for details"),
            ]),
            m(".kanjicard-solution.phase-" + phase, [
                vnode.attrs.game.status.word ?
                    m.trust(vnode.attrs.game.status.word.romaji.reduce((a, c) => {
                        if (a) {
                            a += "<br>";
                        }
                        return a + c;
                    }), "") :
                    ""
            ])
        ];
    }
};

const Vivus = window.Vivus || undefined;

const KanjiDetailView = {
    lastKanjiVG: "",
    kanjiSymbols: [],
    svgLoader: null,
    oncreate(vnode) {
        KanjiDetailView.svgLoader = vnode.attrs.svgLoader;
    },
    view(vnode) {
        let word = vnode.attrs.game.status.word;
        if (!word) {
            return null;
        }
        return m(".kanjidetail " + (vnode.attrs.hidden ? "hidden" : ""), [
            m(".kanjidetail-close", {
                onclick: function () {
                    window.history.back();
                }
            }, m.trust("&#x2715;")),
            m(".kanjidetail-grid", [
                m("svg.kanjidetail-symbol", {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 109 109",
                    id: "kanjidetail-svg",
                    onclick: function () {
                        if (this.classList.contains("hide-stroke-order")) {
                            return;
                        }
                        this.classList.add("hide-stroke-order");
                        new Vivus(this, {
                            type: "oneByOne",
                            start: "autostart",
                            duration: 180,
                            selfDestroy: true
                        }, () => {
                            this.classList.remove("hide-stroke-order");
                        });
                    }
                }),
                this.buildSymbols(word),
                m(".kanjidetail-spacer.s1"),
                this.buildWord(word),
                m(".kanjidetail-spacer.s2"),
                this.buildReadingOn(word),
                this.buildReadingKun(word),
                m(".kanjidetail-spacer.s3"),
                this.buildMeaning(word)
            ])
        ]);
    },
    buildSymbols(word) {
        let me = this;
        this.kanjiSymbols = word.id.split(";");
        return m(".kanjidetail-symbols", {
            onupdate: function (vnode) {
                if (vnode.dom.getAttribute("data-word-id") !== word.id && vnode.dom.firstElementChild) {
                    me.selectSymbol(vnode.dom.firstElementChild, me.kanjiSymbols[0]);
                    vnode.dom.setAttribute("data-word-id", word.id);
                }
            }
        }, [
            this.kanjiSymbols.map((symbol) => {
                return m("span", {
                    onclick: function () {
                        me.selectSymbol(this, symbol);
                    }
                }, m.trust("&#x" + symbol + ";"));
            })
        ]);
    },
    selectSymbol(element, symbolId) {
        if (symbolId !== this.lastKanjiVG) {
            this.svgLoader.loadInto(symbolId, document.getElementById("kanjidetail-svg"));
            this.lastKanjiVG = symbolId;
            element.parentElement.querySelectorAll("span").forEach((e) => {
                e.classList.remove("selected");
            });
            element.classList.add("selected");
        }
    },
    buildWord(word) {
        let tmp = word.id.split(";");
        let kanji = "";
        for (const t of tmp) {
            kanji += "&#x" + t + ";";
        }
        return m(".kanjidetail-text.word", m.trust(kanji));
    },
    buildReadingOn(word) {
        return m(".kanjidetail-text.reading-on", [
            m("b", "on reading:"),
            m("br"),
            word.reading.on.join(", ") || m.trust("&minus;")
        ]);
    },
    buildReadingKun(word) {
        return m(".kanjidetail-text.reading-kun", [
            m("b", "kun reading:"),
            m("br"),
            word.reading.kun.join(", ") || m.trust("&minus;")
        ]);
    },
    buildMeaning(word) {
        return m(".kanjidetail-text.meaning", [
            m("b", "meaning:"),
            m("br"),
            m.trust(word.meaning.join("<br>") || "&minus;")
        ]);
    }
};

const GameView = {
    detailOverlay: false,
    oncreate(vnode) {
        vnode.attrs.game.start();
    },
    onremove(vnode) {
        vnode.attrs.game.stop();
    },
    onupdate(vnode) {
        let detail = this.detailOverlay;
        this.detailOverlay = vnode.attrs.overlay === "/detail";
        if (this.detailOverlay !== detail) {
            if (this.detailOverlay) {
                vnode.attrs.game.pause();
                m.redraw();
            }
            else {
                vnode.attrs.game.resume();
            }
        }
    },
    view(vnode) {
        return m(".container.game", {
            style: "--bottom-space:" + vnode.attrs.settings.romajiBoardOffsetBottom + "vw;"
        }, [
            m(".game-back-button", {
                onclick: function () {
                    window.history.back();
                },
                style: this.detailOverlay ? "display: none;" : ""
            }),
            m(KanjiCardView, {
                game: vnode.attrs.game
            }),
            m(RomajiProposalView, {
                game: vnode.attrs.game
            }),
            m(RomajiBoardView, {
                game: vnode.attrs.game,
                settings: vnode.attrs.settings
            }),
            m(KanjiDetailView, {
                game: vnode.attrs.game,
                svgLoader: vnode.attrs.svgLoader,
                hidden: !this.detailOverlay
            })
        ]);
    }
};
const render = function () {
    m.redraw();
};

const MainView = {
    oninit(vnode) {
        vnode.attrs.cursed.library.loadIndex().then(() => {
            m.redraw();
        });
    },
    view(vnode) {
        return m(".container.main", [
            this.buildSettingsButton(),
            this.buildLibrary(vnode),
            this.buildGameLength(),
            this.buildGameStart(vnode)
        ]);
    },
    buildSettingsButton() {
        return m(".settings-button", {
            onclick: () => {
                window.location.hash = "#!/settings";
            }
        });
    },
    buildLibrary(vnode) {
        return m(".library", {
            onclick: () => {
                window.location.hash = "#!/library";
            }
        }, [
            this.buildLibraryShelf(vnode),
            this.buildLibraryShelfButton()
        ]);
    },
    buildLibraryShelf(vnode) {
        let library = vnode.attrs.cursed.library;
        let books = [];
        if (library.index) {
            let totalCount = 0;
            for (let book of library.index.books) {
                totalCount += book.wordCount;
            }
            let avgCount = totalCount / library.index.books.length;
            for (let book of library.index.books) {
                books.push(this.buildLibraryShelfBook(book, avgCount, !library.isBookEnabled(book.id)));
            }
        }
        return m(".library-shelf", books);
    },
    buildLibraryShelfBook(book, avgWordCount, hidden) {
        if (avgWordCount === 0) {
            avgWordCount = 1;
        }
        let heightVariance = book.wordCount / avgWordCount - 1;
        heightVariance = Math.min(1, Math.max(-1, heightVariance));
        let invisibleCss = "";
        if (hidden) {
            invisibleCss = "visibility: hidden;";
        }
        return m(".library-shelf-book", m("div", {
            "style": "background:" + book.color + ";" +
                "height: calc(var(--book-height) + var(--book-height-variance) * " + heightVariance + ");" +
                invisibleCss
        }));
    },
    buildLibraryShelfButton() {
        return m(".library-shelf-button", "select lessons");
    },
    buildGameLength() {
        return m(".game-length");
    },
    buildGameStart(vnode) {
        let library = vnode.attrs.cursed.library;
        let corruption = Math.floor(library.cardbox.corruption() * 1000) / 10;
        return m(".game-start", {
            onclick: () => {
                window.location.hash = "#!/game";
            }
        }, [
            "start game",
            m(".game-corruption", "Corruption: " + corruption + "%")
        ]);
    }
};

const LibraryView = {
    oninit(vnode) {
        let library = vnode.attrs.library;
        if (!library.index) {
            library.loadIndex().then(() => {
                m.redraw();
            });
        }
    },
    view(vnode) {
        let library = vnode.attrs.library;
        return m(".container.library", [
            this.buildHeader(),
            this.buildBooks(library)
        ]);
    },
    buildHeader() {
        return m(".library-header", [
            "Library",
            this.buildHeaderBackButton()
        ]);
    },
    buildHeaderBackButton() {
        return m(".library-header-back-button", {
            onclick: () => {
                window.history.back();
            }
        });
    },
    buildBooks(library) {
        if (!library || !library.index) {
            return null;
        }
        let groups = [];
        for (let group in library.index.groups) {
            if (library.index.booksOfGroup(group).length) {
                groups.push(this.buildBookGroup(group, library));
            }
        }
        return m(".library-books", groups);
    },
    buildBookGroup(group, library) {
        let checkboxOptions = {
            "type": "checkbox",
            onchange: function () {
                if (this.checked) {
                    library.enableBookGroup(group);
                }
                else {
                    library.disableBookGroup(group);
                }
                m.redraw();
            }
        };
        if (library.isBookGroupEnabled(group)) {
            checkboxOptions["checked"] = true;
        }
        return m(".library-book-group", [
            m("label.library-book-group-title", [
                m("input", checkboxOptions),
                library.index.groups[group] || "unknown group"
            ]),
            library.index.booksOfGroup(group).map((bookId) => {
                return this.buildBook(library.index.book(bookId), library);
            })
        ]);
    },
    buildBook(book, library) {
        if (!book) {
            return null;
        }
        let checkboxOptions = {
            "type": "checkbox",
            onchange: function () {
                if (this.checked) {
                    library.enableBook(book.id);
                }
                else {
                    library.disableBook(book.id);
                }
            }
        };
        if (library.isBookEnabled(book.id)) {
            checkboxOptions["checked"] = true;
        }
        return m(".library-book", {
            "style": "border-left-color: " + book.color + ";"
        }, [
            m("label.library-book-title", [
                m("input", checkboxOptions),
                book.name,
                (library.isBookSealed(book.id) ?
                    m(".library-book-seal")
                    : null)
            ])
        ]);
    }
};

const SettingsView = {
    settings: null,
    oninit(vnode) {
        this.settings = vnode.attrs.settings;
    },
    view(vnode) {
        return m(".container.settings", [
            this.buildHeader(),
            this.buildSettings()
        ]);
    },
    buildHeader() {
        return m(".settings-header", [
            "Settings",
            this.buildHeaderBackButton()
        ]);
    },
    buildHeaderBackButton() {
        return m(".settings-header-back-button", {
            onclick: () => {
                window.history.back();
            }
        });
    },
    buildSettings() {
        return m(".settings", [
            this.buildGameSettings(),
            this.buildAbout()
        ]);
    },
    buildGameSettings() {
        return m(".settings-group", [
            m(".settings-group-title", "Game Settings"),
            m(".settings-button.more", {
                onclick: function () {
                    window.location.hash = "#!/settings/keyboard";
                }
            }, "Keyboard Settings")
        ]);
    },
    buildAbout() {
        return m(".settings-group", [
            m(".settings-group-title", "About"),
            m(".settings-button.more", {
                onclick: function () {
                    window.location.hash = "#!/settings/credits";
                }
            }, "Credits"),
            m(".settings-footer-text", "version " + CursedKanji.version)
        ]);
    }
};

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class SvgLoader {
    constructor() {
        this.basePath = "./assets/kanjivg/";
    }
    loadInto(unicode, target) {
        return __awaiter(this, void 0, void 0, function* () {
            unicode = unicode.toLowerCase();
            while (unicode.length < 5) {
                unicode = "0" + unicode;
            }
            if (target.getAttribute("data-kanji") === unicode) {
                return true;
            }
            const response = yield fetch(this.basePath + unicode + ".svg");
            let svg = yield response.text();
            svg = svg.replace(/([\s\S]*?<svg[^>]*?>)([\s\S]*?)(<\/svg>)/, "$2");
            target.innerHTML = svg;
            target.setAttribute("data-kanji", unicode);
            return true;
        });
    }
}

const KeyboardSettingsView = {
    settings: null,
    oninit(vnode) {
        this.settings = vnode.attrs.settings;
    },
    oncreate() {
        this.updateRomajiBoard();
    },
    view(vnode) {
        return m(".container.settings", [
            this.buildHeader(),
            this.buildSettings()
        ]);
    },
    buildHeader() {
        return m(".settings-header", [
            "Settings: Keyboard",
            m(".settings-header-back-button", {
                onclick: () => {
                    window.history.back();
                }
            })
        ]);
    },
    buildSettings() {
        return m(".settings", [
            this.buildRomajiBoardLayout(),
            this.buildRomajiBoardPosition(),
            this.buildRomajiBoardPreview()
        ]);
    },
    buildRomajiBoardLayout() {
        return m(".settings-group", [
            m(".settings-group-title", "Keyboard Layout"),
            m(".settings-option", [
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardLayout === "aiueo",
                        onchange: () => {
                            this.settings.romajiBoardLayout = "aiueo";
                            this.updateRomajiBoard();
                        }
                    }),
                    "hiragana order"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardLayout === "aiueo-bz",
                        onchange: () => {
                            this.settings.romajiBoardLayout = "aiueo-bz";
                            this.updateRomajiBoard();
                        }
                    }),
                    "hiragana + alphabetical order"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardLayout === "a-z",
                        onchange: () => {
                            this.settings.romajiBoardLayout = "a-z";
                            this.updateRomajiBoard();
                        }
                    }),
                    "alphabetical order"
                ])
            ])
        ]);
    },
    buildRomajiBoardPosition() {
        let me = this;
        return m(".settings-group", {
            style: "margin-bottom: 55vw;"
        }, [
            m(".settings-group-title", "Keyboard Position"),
            m(".settings-option", [
                m("label.settings-option-name", [
                    m("input", {
                        type: "range",
                        min: "0",
                        max: "18",
                        step: "1",
                        value: "" + this.settings.romajiBoardOffsetBottom,
                        oninput: function () {
                            me.settings.romajiBoardOffsetBottom = this.value;
                            me.updateRomajiBoard();
                        }
                    }),
                    "distance bottom: " + this.settings.romajiBoardOffsetBottom
                ])
            ]),
            m(".settings-option", [
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardOrientation === "romaji-board-orientation-left",
                        onchange: () => {
                            this.settings.romajiBoardOrientation = "romaji-board-orientation-left";
                            this.updateRomajiBoard();
                        }
                    }),
                    "left"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardOrientation === "",
                        onchange: () => {
                            this.settings.romajiBoardOrientation = "";
                            this.updateRomajiBoard();
                        }
                    }),
                    "stretch"
                ]),
                m("label.settings-option-name", [
                    m("input", {
                        type: "checkbox",
                        checked: this.settings.romajiBoardOrientation === "romaji-board-orientation-right",
                        onchange: () => {
                            this.settings.romajiBoardOrientation = "romaji-board-orientation-right";
                            this.updateRomajiBoard();
                        }
                    }),
                    "right"
                ])
            ])
        ]);
    },
    buildRomajiBoardPreview() {
        return m(".container.game", {
            style: "position: fixed; top: unset; height: auto; background: none; pointer-events: none; --bottom-space:" + this.settings.romajiBoardOffsetBottom + "vw;"
        }, this.buildRomajiBoardStub());
    },
    buildRomajiBoardStub() {
        return m(RomajiBoardView, {
            settings: this.settings,
            game: {
                input: {
                    registerRomajiBoard() { }
                }
            }
        });
    },
    updateRomajiBoard() {
        let e = document.getElementById("game-romajiboard");
        if (e) {
            let me = this;
            m.mount(e.parentElement, {
                view() {
                    return me.buildRomajiBoardStub();
                }
            });
        }
    }
};

const CreditsSettingsView = {
    settings: null,
    oninit(vnode) {
        this.settings = vnode.attrs.settings;
    },
    view(vnode) {
        return m(".container.settings", [
            this.buildHeader(),
            this.buildCredits()
        ]);
    },
    buildHeader() {
        return m(".settings-header", [
            "Credits",
            m(".settings-header-back-button", {
                onclick: () => {
                    window.history.back();
                }
            })
        ]);
    },
    buildCredits() {
        return m(".settings", [
            this.buildKanjiVg(),
            this.buildKanjiDic()
        ]);
    },
    buildKanjiVg() {
        return m(".settings-group", [
            m(".settings-text", [
                m(".title", "KanjiVG"),
                "Website: ",
                m("a", {
                    href: "https://kanjivg.tagaini.net/",
                    target: "_blank",
                    rel: "noopener"
                }, "kanjivg.tagaini.net"),
                m("br"),
                m("br"),
                m.trust("KanjiVG is copyright &copy; Ulrich Apel"),
                m("br"),
                "License: ",
                m("a", {
                    href: "https://creativecommons.org/licenses/by-sa/3.0/",
                    target: "_blank",
                    rel: "noopener"
                }, "CC BY-SA 3.0"),
            ])
        ]);
    },
    buildKanjiDic() {
        return m(".settings-group", [
            m(".settings-text", [
                m(".title", "KANJIDIC"),
                "Website: ",
                m("a", {
                    href: "http://www.edrdg.org/wiki/index.php/KANJIDIC_Project",
                    target: "_blank",
                    rel: "noopener"
                }, "edrdg.org/wiki/index.php/KANJIDIC_Project"),
                m("br"),
                m("br"),
                m.trust("This app uses the KANJIDIC dictionary files. These files are the property of the <a href=\"http://www.edrdg.org/\" target=\"_blank\" rel=\"noopener\">Electronic Dictionary Research and Development Group</a>, and are used in conformance with the Group's <a href=\"\" target=\"_blank\" rel=\"noopener\">license</a>."),
            ])
        ]);
    },
};

const SealView = {
    view(vnode) {
        return m(".container", [
            m(".seal", {
                onclick: function () {
                    let e = document.getElementById("break-seal-dialog");
                    if (e) {
                        e.remove();
                    }
                    this.classList.add("break");
                    window.setTimeout(() => {
                        window.location.hash = "#/";
                    }, 2000);
                }
            }),
            m(".dialogbox", {
                id: "break-seal-dialog",
                class: "dialogbox centered dark"
            }, "Touch the seal to break it...")
        ]);
    }
};

class Ui {
    constructor(cursed) {
        this.cursed = cursed;
        this.setup();
    }
    setup() {
        this.svgLoader = new SvgLoader();
        let me = this;
        m.route(document.body, "/", {
            "/": {
                render: function () {
                    return m(MainView, {
                        cursed: me.cursed
                    });
                }
            },
            "/sealed": {
                render: function () {
                    return m(SealView, {
                        cursed: me.cursed
                    });
                }
            },
            "/settings/keyboard": {
                render: function () {
                    return m(KeyboardSettingsView, {
                        settings: me.cursed.settings
                    });
                }
            },
            "/settings/credits": {
                render: function () {
                    return m(CreditsSettingsView, {
                        settings: me.cursed.settings
                    });
                }
            },
            "/settings": {
                render: function () {
                    return m(SettingsView, {
                        settings: me.cursed.settings
                    });
                }
            },
            "/library": {
                render: function () {
                    return m(LibraryView, {
                        library: me.cursed.library
                    });
                }
            },
            "/game:overlay...": {
                render: function (vnode) {
                    return m(GameView, {
                        overlay: vnode.attrs.overlay,
                        game: me.cursed.game,
                        settings: me.cursed.settings,
                        svgLoader: me.svgLoader
                    });
                }
            },
            "/test": TestView
        });
    }
}

class TouchHandler {
    constructor(element, options = {}) {
        this.element = element;
        this.cssTouchDown = "touched-down";
        this.cssTouchUp = "touched-up";
        this.cssTouchMove = "touched-move";
        this.touchLimit = 1;
        this.cancelTouchUpAfterMove = true;
        this.cancelTouchUpThreshold = 5;
        this.ongoingTouches = [];
        this.applyOptions(options);
        this.attach();
    }
    attach() {
        this.element.addEventListener("touchstart", this.handleTouchStart.bind(this));
        this.element.addEventListener("touchmove", this.handleTouchMove.bind(this));
        this.element.addEventListener("touchend", this.handleTouchEnd.bind(this));
        this.element.addEventListener("touchcancel", this.handleTouchEnd.bind(this));
    }
    handleTouchStart(e) {
        e.preventDefault();
        if (this.ongoingTouches.length >= this.touchLimit) {
            return;
        }
        for (let touch of e.changedTouches) {
            this.ongoingTouches.push(this.copyTouch(touch));
        }
        if (this.ongoingTouches.length) {
            this.element.classList.add(this.cssTouchDown);
            this.element.classList.remove(this.cssTouchUp);
        }
        if (typeof this.onTouchDown === "function") {
            this.onTouchDown(this.element);
        }
    }
    handleTouchMove(e) {
        e.preventDefault();
        for (let touch of e.changedTouches) {
            let i = this.ongoingTouchIndex(touch);
            if (i >= 0) {
                let oldTouch = this.ongoingTouches[i];
                let dx = touch.pageX - oldTouch.pageX;
                let dy = touch.pageY - oldTouch.pageY;
                if (typeof this.onTouchMove === "function") {
                    if (this.onTouchMove(this.element, dx, dy)) {
                        this.ongoingTouches.splice(i, 1);
                    }
                }
            }
        }
    }
    handleTouchEnd(e) {
        e.preventDefault();
        for (let touch of e.changedTouches) {
            let i = this.ongoingTouchIndex(touch);
            if (i > -1) {
                let oldTouch = this.ongoingTouches.splice(i, 1)[0];
                if (this.cancelTouchUpAfterMove) {
                    let dx = touch.pageX - oldTouch.pageX;
                    let dy = touch.pageY - oldTouch.pageY;
                    if (dx * dx + dy * dy >= this.cancelTouchUpThreshold * this.cancelTouchUpThreshold) {
                        continue;
                    }
                }
                if (typeof this.onTouchUp === "function") {
                    this.onTouchUp(this.element);
                }
            }
        }
        if (!this.ongoingTouches.length) {
            this.element.classList.remove(this.cssTouchDown);
            this.element.classList.add(this.cssTouchUp);
        }
    }
    copyTouch(touch) {
        return new Touch(touch);
    }
    ongoingTouchIndex(touch) {
        for (let i = 0, ic = this.ongoingTouches.length; i < ic; i++) {
            if (this.ongoingTouches[i].identifier === touch.identifier) {
                return i;
            }
        }
        return -1;
    }
    applyOptions(options) {
        var _a, _b, _c, _d;
        this.cssTouchDown = ((_a = options["cssTouchDown"]) !== null && _a !== void 0 ? _a : this.cssTouchDown);
        this.cssTouchUp = ((_b = options["cssTouchUp"]) !== null && _b !== void 0 ? _b : this.cssTouchUp);
        this.cssTouchMove = ((_c = options["cssTouchMove"]) !== null && _c !== void 0 ? _c : this.cssTouchMove);
        this.cancelTouchUpAfterMove = typeof options["cancelTouchUpAfterMove"] !== "undefined" ?
            !!options["cancelTouchUpAfterMove"] :
            this.cancelTouchUpAfterMove;
        this.cancelTouchUpThreshold = ((_d = options["cancelTouchUpThreshold"]) !== null && _d !== void 0 ? _d : this.cancelTouchUpThreshold);
        this.onTouchDown = options["onTouchDown"] || null;
        this.onTouchUp = options["onTouchUp"] || null;
        this.onTouchMove = options["onTouchMove"] || null;
    }
}

class GameInput {
    constructor() {
        this.proposedText = "";
        this.maxTextLength = 24;
        this.changeListeners = [];
        this.swipeAfterScreenPercentage = 0.15;
        this.cancelTouchUpAfterScreenPercentage = 0.05;
    }
    registerRomajiProposal(id) {
        let romajiProposal = document.getElementById(id);
        if (!romajiProposal) {
            return;
        }
        this.registerClearProposal(romajiProposal);
        this.registerUndoProposal(romajiProposal);
    }
    registerClearProposal(container) {
        let touchOptions = {
            onTouchUp: (e) => {
                this.clearProposal();
                m.redraw();
            }
        };
        for (let key of container.querySelectorAll(".romaji-proposal-clear")) {
            new TouchHandler(key, touchOptions);
        }
    }
    registerUndoProposal(container) {
        let touchOptions = {
            onTouchUp: (e) => {
                this.undoPropose();
                m.redraw();
            }
        };
        for (let key of container.querySelectorAll(".romaji-proposal-undo")) {
            new TouchHandler(key, touchOptions);
        }
    }
    registerRomajiBoard(id) {
        let romajiBoard = document.getElementById(id);
        if (!romajiBoard) {
            return;
        }
        this.registerKeys(romajiBoard);
        this.registerScrollRow(romajiBoard);
    }
    registerKeys(container) {
        let touchOptions = {
            onTouchUp: (e) => {
                this.propose(e.getAttribute("data-key") || "");
                m.redraw();
            },
            cancelTouchUpThreshold: Math.floor(container.offsetWidth * this.cancelTouchUpAfterScreenPercentage)
        };
        for (let key of container.querySelectorAll(".romajiboard-key")) {
            new TouchHandler(key, touchOptions);
        }
    }
    registerScrollRow(container) {
        let scrollRow = container.querySelector(".romajiboard-scrollrow[data-scrollable]");
        let touchOptions = {
            cancelTouchUpAfterMove: false,
            onTouchMove: (e, dx, dy) => {
                dx *= -1;
                let snap = parseInt(scrollRow.getAttribute("data-scrollsnap") || "0");
                let panelWidth = scrollRow.firstElementChild.offsetWidth;
                scrollRow.scrollLeft = Math.max(0, snap * panelWidth + dx);
                let scrollPercentage = Math.abs(dx / panelWidth);
                if (scrollPercentage >= this.swipeAfterScreenPercentage) {
                    if (dx > 0) {
                        snap++;
                    }
                    else {
                        snap--;
                    }
                    snap = Math.max(0, Math.min(scrollRow.childElementCount - 1, snap));
                    scrollRow.setAttribute("data-scrollsnap", "" + snap);
                    this.scrollTo(scrollRow, snap * panelWidth);
                    return true;
                }
                return false;
            },
            onTouchUp: (e) => {
                let snap = parseInt(scrollRow.getAttribute("data-scrollsnap") || "0");
                let panelWidth = scrollRow.firstElementChild.offsetWidth;
                this.scrollTo(scrollRow, snap * panelWidth);
            }
        };
        new TouchHandler(container, touchOptions);
    }
    clearScrollTimeout(e) {
        let timeout = e.getAttribute("data-scroll-timeout");
        if (timeout) {
            window.clearTimeout(parseInt(timeout));
            e.setAttribute("data-scroll-timeout", "");
        }
    }
    scrollTo(e, target, speed = 10, delay = 5) {
        this.clearScrollTimeout(e);
        this._scrollTo(e, target, speed, delay);
    }
    _scrollTo(e, target, speed = 10, delay = 5) {
        let x = e.scrollLeft;
        e.setAttribute("data-scroll-timeout", "");
        if (Math.abs(target - x) < speed) {
            e.scrollLeft = target;
            this.clearScrollTimeout(e);
        }
        else {
            if (x > target) {
                x -= speed;
            }
            else {
                x += speed;
            }
            e.scrollLeft = x;
            e.setAttribute("data-scroll-timeout", "" + window.setTimeout(() => {
                this._scrollTo(e, target, speed, delay);
            }, delay));
        }
    }
    propose(key) {
        if (this.proposedText.length >= this.maxTextLength) {
            return;
        }
        this.proposedText += key;
        this.notifyChangeListeners();
    }
    clearProposal() {
        this.proposedText = "";
        this.notifyChangeListeners();
    }
    undoPropose() {
        if (this.proposedText.length) {
            this.proposedText = this.proposedText.substr(0, this.proposedText.length - 1);
            this.notifyChangeListeners();
        }
    }
    notifyChangeListeners() {
        for (const listener of this.changeListeners) {
            listener(this.proposedText);
        }
    }
    attach(callback) {
        if (this.changeListeners.indexOf(callback) < 0) {
            this.changeListeners.push(callback);
        }
    }
    detach(callback) {
        const i = this.changeListeners.indexOf(callback);
        if (i > -1) {
            this.changeListeners.splice(i, 1);
        }
    }
}

class GameStatus {
    constructor() {
        this.phase = "init";
        this.proposedText = "";
        this.kanji = "";
        this.timelimit = 0;
        this.elapsedSeconds = 0;
        this.elapsedTime = 0;
        this.remainingSeconds = 0;
        this.remainingTime = 0;
    }
}

class SimpleLoop {
    constructor() {
        this.engine = {
            lastTs: 0,
            running: false,
            updating: true
        };
        this.updateListeners = [];
    }
    attach(callback) {
        if (this.updateListeners.indexOf(callback) < 0) {
            this.updateListeners.push(callback);
        }
    }
    detach(callback) {
        const i = this.updateListeners.indexOf(callback);
        if (i > -1) {
            this.updateListeners.splice(i, 1);
        }
    }
    start() {
        this.engine.lastTs = 0;
        this.engine.running = true;
        this.engine.updating = true;
        this.requestFrame();
    }
    stop() {
        this.engine.running = false;
    }
    pause() {
        this.engine.updating = false;
    }
    resume() {
        this.engine.updating = true;
    }
    update(ts) {
        const deltaT = ts - (this.engine.lastTs || ts);
        if (this.engine.updating && this.engine.running) {
            for (const listener of this.updateListeners) {
                listener(ts, deltaT);
            }
        }
        this.engine.lastTs = ts;
        if (this.engine.running) {
            this.requestFrame();
        }
    }
    requestFrame() {
        window.requestAnimationFrame(this.update.bind(this));
    }
}

class StateMachine {
    constructor(game, initialState) {
        this.game = game;
        this.currentState = initialState;
    }
    setState(state) {
        this.currentState = state;
    }
    update(ts, dt) {
        if (!this.currentState) {
            return;
        }
        const state = this.currentState.update(this.game, ts, dt);
        if (state) {
            this.currentState.leave(this.game);
            this.currentState = state;
            this.currentState.enter(this.game);
        }
    }
}

class StateMachineState {
    enter(game) {
    }
    leave(game) {
    }
    update(game, ts, dt) {
        return null;
    }
}

class FailedState extends StateMachineState {
    constructor() {
        super(...arguments);
        this.duration = 2000;
        this.elapsedTime = 0;
    }
    enter(game) {
        game.status.phase = "failed";
    }
    update(game, ts, dt) {
        this.elapsedTime += dt;
        if (this.elapsedTime > this.duration) {
            return new KanjiState();
        }
        return null;
    }
}

class SuccessState extends StateMachineState {
    constructor() {
        super(...arguments);
        this.duration = 2000;
        this.elapsedTime = 0;
    }
    enter(game) {
        game.status.phase = "success";
    }
    update(game, ts, dt) {
        this.elapsedTime += dt;
        if (this.elapsedTime > this.duration) {
            return new KanjiState();
        }
        return null;
    }
}

class KanjiState extends StateMachineState {
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

class InitialState extends StateMachineState {
    enter(game) {
        game.status.phase = "init";
    }
    update(game, ts, dt) {
        return new KanjiState();
    }
}

class Game {
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
            if (proposedText && this.status.phase !== "kanji") {
                return;
            }
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

class LibraryIndex {
    constructor() {
        this.version = 0;
        this.books = [];
        this.groups = {};
        this.bookMap = {};
        this.groupBookMapping = {};
    }
    book(id) {
        if (typeof this.bookMap[id] !== "undefined") {
            return this.bookMap[id];
        }
        return null;
    }
    booksOfGroup(group) {
        if (typeof this.groupBookMapping[group] !== "undefined") {
            return this.groupBookMapping[group];
        }
        return [];
    }
    refreshMappings() {
        this.refreshBookMapping();
        this.refreshGroupBookMapping();
    }
    refreshBookMapping() {
        this.bookMap = {};
        for (let book of this.books) {
            this.bookMap[book.id] = book;
        }
    }
    refreshGroupBookMapping() {
        for (let book of this.books) {
            if (typeof this.groupBookMapping[book.group] === "undefined") {
                this.groupBookMapping[book.group] = [];
            }
            this.groupBookMapping[book.group].push(book.id);
        }
    }
}

class ColorConverter {
    static hslToRgb(h, s, l) {
        let r, g, b;
        if (s == 0) {
            r = g = b = l;
        }
        else {
            var hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0)
                    t += 1;
                if (t > 1)
                    t -= 1;
                if (t < 1 / 6)
                    return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                    return q;
                if (t < 2 / 3)
                    return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

class LibraryBook {
    constructor() {
        this.id = "";
        this.name = "";
        this.file = "";
        this.group = "";
        this._wordCount = 0;
        this._color = "";
    }
    get wordCount() {
        return this.words ? this.words.length : this._wordCount;
    }
    get color() {
        if (!this._color) {
            let value = this.id;
            let hue = 0;
            let lightness = 50;
            let saturation = 50;
            for (var i = 0, ic = value.length; i < ic; i++) {
                switch (i % 3) {
                    case 0:
                        hue = (hue + value.charCodeAt(i) * i) % 360;
                        break;
                    case 1:
                        lightness = (lightness + value.charCodeAt(i) * i) % 50;
                        break;
                    case 2:
                        saturation = (saturation + value.charCodeAt(i) * i) % 50;
                        break;
                }
            }
            lightness += 20;
            saturation += 50;
            var rgb = ColorConverter.hslToRgb(hue / 360, saturation / 100, lightness / 100);
            this._color = "#" + (rgb.r < 16 ? "0" : "") + rgb.r.toString(16)
                + (rgb.g < 16 ? "0" : "") + rgb.g.toString(16)
                + (rgb.b < 16 ? "0" : "") + rgb.b.toString(16);
        }
        return this._color;
    }
}

var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class LibraryIndexLoader {
    constructor() {
        this.indexFile = "./assets/data/index.json";
    }
    load() {
        return __awaiter$1(this, void 0, void 0, function* () {
            const response = yield fetch(this.indexFile);
            const json = yield response.json();
            let index = Object.assign(new LibraryIndex(), json);
            for (let i = 0, ic = index.books.length; i < ic; i++) {
                index.books[i] = Object.assign(new LibraryBook(), index.books[i]);
            }
            index.refreshMappings();
            return index;
        });
    }
}

var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class LibraryBookLoader {
    constructor() {
        this.basePath = "./assets/data/";
    }
    load(file) {
        return __awaiter$2(this, void 0, void 0, function* () {
            if (file.length && file.substr(0, 1) === "/") {
                file = file.substr(1);
            }
            const response = yield fetch(this.basePath + file);
            const json = yield response.json();
            return Object.assign(new LibraryBook(), json);
        });
    }
}

class ObjectStorage {
    constructor(o, attributes = [], objectId = "") {
        this.prefix = "cursedkanji-1-";
        this.canSave = true;
        this.objectId = "";
        this.attributes = [];
        this.object = o;
        this.attributes = attributes;
        this.objectId = (objectId !== null && objectId !== void 0 ? objectId : "") + "-";
        try {
            this.storage = localStorage;
        }
        catch (e) {
        }
    }
    save() {
        if (!this.canSave) {
            return;
        }
        for (let attr of this.attributes) {
            if (typeof this.object[attr.name] !== "undefined") {
                this.store(attr.name, this.object[attr.name]);
            }
        }
    }
    load() {
        for (let attr of this.attributes) {
            if (typeof this.object[attr.name] !== "undefined") {
                switch (attr.type) {
                    case "string":
                        this.object[attr.name] = this.get(attr.name, attr.defaultValue);
                        break;
                    case "array":
                        this.object[attr.name] = this.getArray(attr.name, attr.defaultValue);
                        break;
                    case "object":
                        this.object[attr.name] = this.getObject(attr.name, attr.defaultValue);
                        break;
                }
            }
        }
    }
    store(key, value) {
        if (!this.storage) {
            return;
        }
        if (typeof value !== "string") {
            value = JSON.stringify(value);
        }
        this.storage.setItem(this.prefix + this.objectId + key, value);
    }
    get(key, defaultValue = "") {
        if (!this.storage) {
            return defaultValue;
        }
        return this.storage.getItem(this.prefix + this.objectId + key) || defaultValue;
    }
    getObject(key, defaultValue = {}) {
        if (!this.storage) {
            return defaultValue;
        }
        let value = this.storage.getItem(this.prefix + this.objectId + key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
    getArray(key, defaultValue = []) {
        if (!this.storage) {
            return defaultValue;
        }
        let value = this.storage.getItem(this.prefix + this.objectId + key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
    get storagePrefix() {
        return this.prefix;
    }
}

class Cardbox {
    constructor() {
        this.slot1 = [];
        this.rawSlot1 = "";
        this.slot2 = [];
        this.rawSlot2 = "";
        this.slot3 = [];
        this.rawSlot3 = "";
        this.slots = [];
        this.improvedToday = [];
        this.storage = new ObjectStorage(this, [
            {
                name: "rawSlot1",
                type: "string",
                defaultValue: ""
            },
            {
                name: "rawSlot2",
                type: "string",
                defaultValue: ""
            },
            {
                name: "rawSlot3",
                type: "string",
                defaultValue: ""
            },
            {
                name: "improvedToday",
                type: "array",
                defaultValue: []
            }
        ], "cardbox");
        this.loadSlots();
    }
    insert(wordId, slot) {
        for (let i = 0; i < 3; i++) {
            if (i + 1 === slot) {
                this.addWordToSlot(wordId, this.slots[i]);
            }
            else {
                this.removeWordFromSlot(wordId, this.slots[i]);
            }
        }
        this.saveSlots();
    }
    moveUp(wordId) {
        if (!this.canImproveWord(wordId)) {
            return;
        }
        const currentSlot = this.whichSlot(wordId);
        if (currentSlot + 1 <= 3) {
            this.insert(wordId, currentSlot + 1);
        }
        this.markWordImproved(wordId);
    }
    moveDown(wordId) {
        this.insert(wordId, 1);
    }
    whichSlot(wordId) {
        for (let i = 0; i < 3; i++) {
            if (this.slots[i].indexOf(wordId) > -1) {
                return i + 1;
            }
        }
        return 0;
    }
    slotDistribution() {
        let n = [0,
            this.slot1.length,
            this.slot2.length,
            this.slot3.length
        ];
        n[0] = n[1] + n[2] + n[3];
        return n;
    }
    corruption() {
        let dist = this.slotDistribution();
        let total = dist[0] + dist[1];
        let corruption = 0;
        if (dist[1] + dist[2] > 0) {
            corruption = total / (dist[1] + dist[1] + dist[2]);
        }
        return corruption;
    }
    canImproveWord(wordId) {
        return this.improvedToday.indexOf(wordId) < 0;
    }
    markWordImproved(wordId) {
        let today = (new Date()).toLocaleDateString();
        if (this.improvedToday.length < 1) {
            this.improvedToday.push(today);
        }
        else if (this.improvedToday[0] !== today) {
            this.improvedToday.length = 0;
            this.improvedToday.push(today);
        }
        this.improvedToday.push(wordId);
        this.storage.save();
    }
    removeWordFromSlot(wordId, slot) {
        let i = slot.indexOf(wordId);
        if (i > -1) {
            slot.splice(i, 1);
        }
    }
    addWordToSlot(wordId, slot) {
        let i = slot.indexOf(wordId);
        if (i < 0) {
            slot.push(wordId);
        }
    }
    loadSlots() {
        this.storage.load();
        this.slot1 = this.deserialize(this.rawSlot1);
        this.slot2 = this.deserialize(this.rawSlot2);
        this.slot3 = this.deserialize(this.rawSlot3);
        this.slots = [
            this.slot1, this.slot2, this.slot3
        ];
    }
    saveSlots() {
        this.rawSlot1 = this.serialize(this.slot1);
        this.rawSlot2 = this.serialize(this.slot2);
        this.rawSlot3 = this.serialize(this.slot3);
        this.storage.save();
    }
    serialize(values) {
        return values.reduce((serialized, value) => {
            if (serialized.length) {
                serialized += ";";
            }
            serialized += value.split(";").reduce((word, charcode) => {
                word += String.fromCharCode(parseInt("0x" + charcode));
                return word;
            }, "");
            return serialized;
        }, "");
    }
    deserialize(value) {
        return value.split(";").map((words) => {
            return words.split("").map((word) => {
                let tmp = word.charCodeAt(0).toString(16);
                while (tmp.length < 5) {
                    tmp = "0" + tmp;
                }
                return tmp;
            }).join(";");
        }).filter((value) => {
            return !!value;
        });
    }
}

var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Library {
    constructor() {
        this.books = {};
        this.enabledBooks = [];
        this.unsealedBooks = [];
        this.storage = new ObjectStorage(this, [
            {
                name: "enabledBooks",
                type: "array",
                defaultValue: []
            },
            {
                name: "unsealedBooks",
                type: "array",
                defaultValue: []
            }
        ], "library");
        this.storage.load();
        this.cardbox = new Cardbox();
    }
    loadIndex() {
        return __awaiter$3(this, void 0, void 0, function* () {
            this.index = yield (new LibraryIndexLoader()).load();
            return true;
        });
    }
    getBook(id) {
        return __awaiter$3(this, void 0, void 0, function* () {
            if (!this.index) {
                yield this.loadIndex();
            }
            if (typeof this.books[id] === "undefined") {
                let metadata = this.index.book(id);
                if (metadata) {
                    this.books[id] = yield (new LibraryBookLoader()).load(metadata.file);
                }
            }
            return this.books[id] || null;
        });
    }
    enabledBookIds() {
        return [...this.enabledBooks];
    }
    enableBook(id) {
        if (this.enabledBooks.indexOf(id) < 0) {
            this.enabledBooks.push(id);
        }
        if (this.isBookSealed(id)) {
            this.unsealBook(id);
        }
        this.storage.save();
    }
    disableBook(id) {
        let i = this.enabledBooks.indexOf(id);
        if (i > -1) {
            this.enabledBooks.splice(i, 1);
        }
        this.storage.save();
    }
    isBookEnabled(id) {
        return this.enabledBooks.indexOf(id) > -1;
    }
    enableBookGroup(group) {
        this.storage.canSave = false;
        for (let bookId of this.index.booksOfGroup(group)) {
            this.enableBook(bookId);
        }
        this.storage.canSave = true;
        this.storage.save();
    }
    disableBookGroup(group) {
        this.storage.canSave = false;
        for (let bookId of this.index.booksOfGroup(group)) {
            this.disableBook(bookId);
        }
        this.storage.canSave = true;
        this.storage.save();
    }
    isBookGroupEnabled(group) {
        for (let bookId of this.index.booksOfGroup(group)) {
            if (!this.isBookEnabled(bookId)) {
                return false;
            }
        }
        return true;
    }
    isBookSealed(id) {
        return this.unsealedBooks.indexOf(id) < 0;
    }
    unsealBook(id) {
        this.unsealedBooks.push(id);
        this.storage.save();
        this.getBook(id).then((book) => {
            for (const word of book.words) {
                if (this.cardbox.whichSlot(word.id) < 1) {
                    this.cardbox.insert(word.id, 1);
                }
            }
        });
    }
}

class LibraryWord {
    constructor() {
        this.id = "";
        this.romaji = [];
        this.reading = { on: [], kun: [] };
        this.meaning = [];
    }
}

var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class WordPool {
    constructor(library) {
        this.library = library;
        this.pool = [];
        this.correctWords = [];
        this.wrongWords = [];
    }
    fill() {
        return __awaiter$4(this, void 0, void 0, function* () {
            let slotCount = [0, 0, 0, 0];
            this.pool.length = 0;
            let wordIdIndexMap = {};
            for (const bookId of this.library.enabledBookIds()) {
                const book = yield this.library.getBook(bookId);
                for (const word of book.words) {
                    if (typeof wordIdIndexMap[word.id] === "undefined") {
                        this.pool.push(word);
                        wordIdIndexMap[word.id] = this.pool.length - 1;
                    }
                    else {
                        let wordCopy = Object.assign(new LibraryWord(), this.pool[wordIdIndexMap[word.id]]);
                        for (const reading of word.reading.kun) {
                            if (wordCopy.reading.kun.indexOf(reading) < 0) {
                                wordCopy.reading.kun.push(reading);
                            }
                        }
                        for (const reading of word.reading.on) {
                            if (wordCopy.reading.on.indexOf(reading) < 0) {
                                wordCopy.reading.on.push(reading);
                            }
                        }
                        for (const meaning of word.meaning) {
                            if (wordCopy.meaning.indexOf(meaning) < 0) {
                                wordCopy.meaning.push(meaning);
                            }
                        }
                        for (const romaji of word.romaji) {
                            if (wordCopy.romaji.indexOf(romaji) < 0) {
                                wordCopy.romaji.push(romaji);
                            }
                        }
                        this.pool[wordIdIndexMap[word.id]] = wordCopy;
                    }
                    let slot = this.library.cardbox.whichSlot(word.id);
                    if (slot < 1) {
                        this.library.cardbox.insert(word.id, 1);
                        slot = 1;
                    }
                    slotCount[slot]++;
                }
            }
            if (!this.pool.length) {
                let word = new LibraryWord();
                word.id = "7121";
                this.pool.push(word);
                window.location.hash = "!/";
                return true;
            }
            this.shuffle();
            if (slotCount[1] > 0 && slotCount[2] > 0) {
                let limit2 = Math.ceil(slotCount[2] / 2);
                let count2 = 0;
                let limit3 = Math.ceil(slotCount[3] / 4);
                let count3 = 0;
                if (slotCount[1] < 1) {
                    limit2 = slotCount[2];
                    limit3 = Math.ceil(slotCount[3] / 2);
                }
                let i = 0;
                while (i < this.pool.length) {
                    let slot = this.library.cardbox.whichSlot(this.pool[i].id);
                    if ((slot === 2 && count2 >= limit2) ||
                        (slot === 3 && count3 >= limit3)) {
                        this.pool.splice(i, 1);
                    }
                    else {
                        if (slot === 2) {
                            count2++;
                        }
                        else if (slot === 3) {
                            count3++;
                        }
                        i++;
                    }
                }
            }
            return true;
        });
    }
    shuffle() {
        for (let i = this.pool.length - 1; i > 0; i--) {
            let n = Math.floor(Math.random() * (i + 1));
            let tmp = this.pool[i];
            this.pool[i] = this.pool[n];
            this.pool[n] = tmp;
        }
    }
    clear() {
        this.pool.length = 0;
        this.activeWord = null;
        this.correctWords.length = 0;
        this.wrongWords.length = 0;
    }
    current() {
        return this.activeWord;
    }
    next() {
        return __awaiter$4(this, void 0, void 0, function* () {
            if (!this.pool.length) {
                yield this.fill();
            }
            const i = Math.floor(Math.random() * this.pool.length);
            this.activeWord = this.pool.splice(i, 1)[0];
            return this.activeWord;
        });
    }
    markCurrentWordCorrect() {
        if (this.activeWord) {
            this.library.cardbox.moveUp(this.activeWord.id);
        }
    }
    markCurrentWordWrong() {
        if (this.activeWord) {
            this.library.cardbox.moveDown(this.activeWord.id);
        }
    }
}

class Settings {
    constructor() {
        this._romajiBoardLayout = "";
        this._romajiBoardOffsetBottom = "0";
        this._romajiBoardOrientaion = "";
        this.storage = new ObjectStorage(this, [
            {
                name: "_romajiBoardLayout",
                type: "string",
                defaultValue: "aiueo-bz"
            },
            {
                name: "_romajiBoardOffsetBottom",
                type: "string",
                defaultValue: "0"
            },
            {
                name: "_romajiBoardOrientaion",
                type: "string",
                defaultValue: ""
            }
        ], "settings");
        this.storage.load();
    }
    get romajiBoardLayout() {
        return this._romajiBoardLayout;
    }
    set romajiBoardLayout(value) {
        this._romajiBoardLayout = value;
        this.storage.save();
    }
    get romajiBoardOffsetBottom() {
        return Number.parseInt(this._romajiBoardOffsetBottom);
    }
    set romajiBoardOffsetBottom(value) {
        this._romajiBoardOffsetBottom = value.toString();
        this.storage.save();
    }
    get romajiBoardOrientation() {
        return this._romajiBoardOrientaion;
    }
    set romajiBoardOrientation(value) {
        this._romajiBoardOrientaion = value;
        this.storage.save();
    }
}

let CursedKanji = (() => {
    class CursedKanji {
        constructor() {
            this.build();
        }
        build() {
            this.library = new Library();
            this.wordPool = new WordPool(this.library);
            this.game = new Game(this.wordPool);
            this.settings = new Settings();
            this.ui = new Ui(this);
        }
    }
    CursedKanji.version = "0.5";
    return CursedKanji;
})();

export default CursedKanji;
