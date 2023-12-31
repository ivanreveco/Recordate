import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { ModalController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.scss'],
})
export class BarraComponent implements OnInit {
  newUser: User = {
    uid: '',
    name: '',
    lastName: '',
    password: '',
    email: '',
  };

  uid = '';
  capturedImage: string | null = null; // Variable para almacenar la URL de la imagen capturada

  constructor(
    public auth: FirebaseService,
    private db: UtilsService,
    private modalController: ModalController,
    private alertController : AlertController
  ) {
    this.auth.getAuthState().subscribe(res => {
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        this.loadImageFromLocalStorage(this.uid); // Cargar imagen desde el localStorage específico del usuario al iniciar
      }
    });
  }

  async TakeImage() {
    try {
      const photo = await this.db.takePicture('Selecciona una imagen o sacar una foto');
      this.capturedImage = photo.dataUrl; // Asigna la URL de la imagen capturada a la variable
      localStorage.setItem(`capturedImage_${this.uid}`, this.capturedImage); // Guardar en el localStorage del usuario
      // Otras acciones con la URL de la imagen capturada si es necesario
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  loadImageFromLocalStorage(uid: string) {
    const savedImage = localStorage.getItem(`capturedImage_${uid}`);
    if (savedImage) {
      this.capturedImage = savedImage; // Cargar la imagen desde el localStorage específico del usuario
    }
  }

  changeImage() {
    if (this.capturedImage) {
      this.TakeImage(); // Si hay una imagen existente, se llama a la función para cambiar la imagen al hacer clic en ella
    }
  }
  

  ngOnInit() {}

  getUserInfo(uid: string) {
    const path = 'Users';
    this.db.getDoc<User>(path, uid).subscribe(res => {
      if (res !== undefined) {
        this.newUser = res;
      }
    });
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  deleteImage() {
    // Elimina la imagen capturada y actualiza la variable y el localStorage
    this.capturedImage = null;
    localStorage.removeItem(`capturedImage_${this.uid}`);
  }


  async confirmarCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Acciones al cancelar (opcional)
          },
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.cerrarSesion(); // Llamada a la función para cerrar sesión
          },
        },
      ],
    });
  
    await alert.present();
  }

  async cerrarSesion() {
    await this.auth.singOut();
    this.dismiss();
  }
}
