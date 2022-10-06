import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as L from "leaflet";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() set items(_items) {
    this._items = _items.map((x: any) => new L.Marker(x.latLngArr, { title: x.title }));
  }

  get items(): L.Marker[] {
    return this._items;
  }

  private map!: L.Map;
  private _items: L.Marker[] = [];

  private initMap(): void {
    this.map = L.map('map', {
      zoom: 12
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 10,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this._items.map(x => this.addNewMarker(x))

    tiles.addTo(this.map);
  }

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initMap()
    this.drawLines()
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let change = changes[propName];

      if (change.firstChange) {
        return
      }

      this._items.map(x => this.addNewMarker(x))

      this.drawLines()
    }
  }

  addNewMarker(marker: L.Marker) {
    //console.warn(marker)
    const newMarker = marker
      .addTo(this.map)
      .bindPopup(`<h3>${marker?.options?.title}</h3><div> ${marker?.getLatLng()}</div>`);
  }

  drawLines() {
    const MK = this._items.map((x: L.Marker) => x.getLatLng())
    const polyline = L.polyline(MK, { color: 'blue' }).addTo(this.map);

    this.map.fitBounds(polyline.getBounds());
  }

}
