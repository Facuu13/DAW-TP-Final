var M;
class Main implements EventListenerObject{

    handleEvent(object: Event): void {
    }
}
window.addEventListener("load",  ()=> {

    var elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal, null);

    let main: Main = new Main();

});