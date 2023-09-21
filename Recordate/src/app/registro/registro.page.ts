import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UtilService } from '../services/util.service';




@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit  {
  //crear user y sus atributos
  user={
  nombre: '',
  apellidos :'',
  email:'',
  password :'',
  confirmarPassword: ''

}
  public alertButtons = [
    {
      text: 'OK', 
      heandler : () => {
      }
    }
  ]
  aceptaTerminos = false;
  
  constructor(private alertController: AlertController, private utilsvc: UtilService) {}

  ngOnInit() {
  }

  async PresentAlert(){
    const alert = await this.alertController.create ({
      header: 'Te haz registrado exitosamente. Ahora coloca tu correo y contraseña',
      buttons: this.alertButtons,
    });
    await alert.present();
  }




  validarFormulario(): boolean {
    // Validar que todos los campos estén completos
    if (this.user.nombre === '' || this.user.apellidos === '' || this.user.email === '' || this.user.password === '' || this.user.confirmarPassword === '') {
      return false;
    }

    // Validar que la contraseña y la confirmación de contraseña coincidan
    if (this.user.password !== this.user.confirmarPassword) {
      return false;
    }
    //validar que la contraseña no sea menor de 7 caracteres
    if (this.user.password.length <7){
      return false;
    }
    // Validar que el correo termine con hotmail yahoo o gmail
    if (!/.(gmail|yahoo|hotmail)./.test(this.user.email)) {
      return false;
      }
    if(!this.aceptaTerminos){
      return false;
    }

    // Devolver true si el formulario es válido
    //guardar datos en el localstorage
    //localStorage.setItem('user',JSON.stringify(this.user));
    this.utilsvc.setElementInLocalStorage('user',this.user);

    return true;
  }

  
}











