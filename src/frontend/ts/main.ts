var M;
class Main implements EventListenerObject{

    constructor() {
        this.agregarDevices();
    }

    private agregarDevices(){
        console.log("hola")
        let xmlRequest = new XMLHttpRequest();
        xmlRequest.onreadystatechange = ()=> {
            if(xmlRequest.readyState == 4){
                if(xmlRequest.status == 200){
                    console.log(xmlRequest.responseText, xmlRequest.readyState);
                    let respusta = xmlRequest.responseText;
                    let datos: Array<Device> = JSON.parse(respusta);
                    let div = document.getElementById("listaDisp");
                    for (let d of datos){
                        // Asigna 'checked' a isChecked si d.state es verdadero, de lo contrario, asigna una cadena vacía.
                        const isChecked = d.state ? 'checked' : '';
                        // Generamos un ID único para el dispositivo
                        const deviceId = `device_${d.id}`;
                        let type: string;
                        if(d.type == 1){
                            type = `
                            <div class="switch">
                                <label>
                                    Off
                                    <input type="checkbox" ${isChecked}>
                                    <span class="lever"></span>
                                    On
                                </label>
                            </div>`
                        }else if (d.type == 2){
                            type = `  <form action="#">
                            <p class="range-field">
                                <input type="range" id="test5" min="0" max="100" />
                            </p>
                            </form>`
                        }

                        div.innerHTML += `<div class="col s12 m6 l4 id=${deviceId}">
                        <h5>${d.name}</h5>
                        <p>${d.description}</p>
                        ${type}
                        </div>`
                    }
                }
                    
            }
        
        }
        xmlRequest.open("GET","http://localhost:8000/devices",true); //lo ponemos en true para que se ejecute de forma asincrona
        xmlRequest.send();
    }

    handleEvent(object: Event): void {
        let elemento = <HTMLElement> object.target;
        
    }


}
window.addEventListener("load",  ()=> {

    var elemsModal = document.querySelectorAll('.modal');
    M.Modal.init(elemsModal, null);

    let main: Main = new Main();


});