import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface IMarker {
  title: string,
  latLngArr: Array<number>
}

const arr: IMarker[] = [
  { latLngArr: [60.021214, 30.330461], title: '1st point' },
  { latLngArr: [60.011337, 30.346234], title: '2st point' }
]

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  arr: IMarker[] = []
  private _items$ = new BehaviorSubject(arr);

  constructor() {
    this.arr = [...arr]
  }

  get items$(): Observable<IMarker[]> {
    return this._items$;
  }

  addNewMarker(marker: { title: string, lat: number, lng: number }): Observable<IMarker> {
    const newMarker = { latLngArr: [+marker.lat, +marker.lng], title: marker.title }
    this.arr.push(newMarker)
    this._items$.next([...this.arr])
    return of(newMarker)
  }
}
