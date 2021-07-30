import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import Movimiento from './interface/movimiento';

declare var google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'laLeoPrueba';
  public incio = { lat: 19.3860151, lng: -99.1592511 };
  public fin = { lat: 19.4336754, lng: -99.156178 };
  public movimientos: Movimiento[] = [];
  public map: any;
  public pasoActual: Movimiento[] = [{ status: 'Orden creada', hora: '13:17:26', fecha: '04-05-2021' }];
  public actual: Movimiento = { status: 'Orden creada', hora: '13:17:26', fecha: '04-05-2021' };
  private markers: any[] = [];

  constructor() {
    this.movimientos = [
      { status: 'Buscando mensajero cercano', hora: '13:17:28', fecha: '04-05-2021' },
      { status: 'Orden en proceso', hora: '13:18:35', fecha: '04-05-2021' },
      { status: 'Punto de origen A: En proceso', hora: '13:29:00', fecha: '04-05-2021' },
      { status: 'Punto de origen A: Finalizado', hora: '13:32:17', fecha: '04-05-2021' },
      { status: 'Punto de entrega B: En proceso', hora: '13:53:18', fecha: '04-05-2021' },
      { status: 'Punto de entrega B: Finalizado', hora: '14:01:29', fecha: '04-05-2021' },
      { status: 'Orden finalizada', hora: '14:01:29', fecha: '04-05-2021' }
    ];
    let a  = 0;
    interval(3180).pipe( take(this.movimientos.length) ).subscribe(() => {
      console.log(this.movimientos[a])
      this.pasoActual.push(this.movimientos[a]);
      this.actual = this.movimientos[a];
      a++;
    })
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: 19.401391, lng: -99.149175},
      zoom: 12,
    });

    const inicio = new google.maps.LatLng(this.incio.lng,this.incio.lat);
    const fin = new google.maps.LatLng(this.fin.lng,this.fin.lat);
    console.log(inicio)
    const servicioDireccion = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer();
    const peticion = {
      origin:'19.3860151, -99.1592511',
      destination: '19.4336754, -99.156178',
      travelMode: google.maps.DirectionsTravelMode.DRIVING,
    };
    servicioDireccion.route(peticion, (response: any, status: any) => {

      console.log(response);
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(this.map);
        this.procesoEntrega(response);
      }
      else {
          alert("Directions Request failed:" +status);
      }
    });
  }

  ngOnInit(): void{
    this.initMap();
  }

  private procesoEntrega = (rutas: any): void => {
    let i = 0;
    const puntos: any[] = rutas.routes[0].overview_path;
    interval(300).pipe( take(puntos.length) ).subscribe( () => {
      this.hideMarkers();
      const mark = new google.maps.Marker({
        position: puntos[i],
        map: this.map,
        title: "Hello World!",
      });
      this.markers.push(mark);
      i++;
    })
  }

  private hideMarkers = (): void => {
    this.setMapOnAll();
  }


  private setMapOnAll = (): void => {
    this.markers.forEach( mark =>  mark.setMap(null));
  }

}
