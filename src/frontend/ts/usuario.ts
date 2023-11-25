class Usuario extends Persona{

    private rol: string;
    private password: string;

    constructor(nombre: string, apellido: string, email:string, rol:string, password:string){
        super(nombre,apellido,email);
        this.rol = rol;
        this.password = password;
    }

    mostrar():string{
        return `${this.info_completa()} - Rol: ${this.rol}\n`;
    }

    obtenerRol():string{
        return `${this.rol}`; 
    }

}