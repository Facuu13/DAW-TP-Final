class Persona{
    private nombre: string;
    private apellido: string;
    private email: string;

    constructor(nombre: string, apellido: string, email: string){
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
    }

    info_completa():string{
        return `Nombre: ${this.nombre} - Apellido: ${this.apellido} - Email:${this.email}`;
    }

    obtenerNombre():string{
        return `${this.nombre}`
    }

    obtenerApellido():string{
        return `${this.apellido}`
    }

    obtenerEmail():string{
        return `${this.email}`
    }
}