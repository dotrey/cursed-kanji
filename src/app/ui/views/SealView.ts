import m from "../Mithril.js";

const SealView : any = {

    view(vnode : any) {
        return m(".container", [
            m(".seal", {
                onclick : function() {
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
                id : "break-seal-dialog",
                class : "dialogbox centered dark"
            }, "Touch the seal to break it...")
        ]);
    }
}
export default SealView;