import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of, map, BehaviorSubject, switchMap } from 'rxjs';
import { IMarker, MarkerService } from 'src/app/services/marker.service';

type coordinateT = 'lat' | 'lng';

const testMarkers = [
  { latLngArr: [60.003999, 30.327976], title: '3st point' },
  { latLngArr: [60.011857, 30.323945], title: '4st point' },
  { latLngArr: [60.029875, 30.319850], title: '5st point' },
]

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit {
  markerFormGroup: FormGroup;
  items$: Observable<any>;
  errorMessage: Function = getErrorMsg;
  placeholders = {
    lat: "Latitude",
    lng: 'Longitude',
    title: 'Title'
  }
  testMarkers!: Observable<IMarker[]>
  refresh$ = new BehaviorSubject<boolean>(true);
  addedMarker: string[] = []

  constructor(
    public markerService: MarkerService
  ) {
    this.markerFormGroup = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      lat: new FormControl(null, [Validators.required, coordinateValidation('lat')]),
      lng: new FormControl(null, [Validators.required, coordinateValidation('lng')])
    });

    this.items$ = markerService.items$

    this.testMarkers = this.refresh$.pipe(
      switchMap(_ => of(testMarkers)
        .pipe(
          map(mrks => mrks.filter(m => this.addedMarker.every(title => m.title !== title))),
        )
      )
    )
  }

  ngOnInit(): void { }

  createMarker() {
    const newMarker = this.markerFormGroup.value

    if (this.markerFormGroup.valid) {
      this.addedMarker.push(this.markerFormGroup.value.title)
      this.refresh$.next(true)
      this.markerService.addNewMarker(newMarker)
      this.markerFormGroup.reset()
      this.markerFormGroup.markAsUntouched
    }
  }

  getPlaceholder(controlName: string): string {
    return this.placeholders[controlName as keyof typeof this.placeholders]
  }

  keepOrder = (a: any, b: any) => a

  fillTheForm(marker: IMarker) {
    this.markerFormGroup.setValue({ lat: marker.latLngArr[0], title: marker.title, lng: marker.latLngArr[1] })
  }
}

function coordinateValidation(coordinate: coordinateT) {
  const comparator = coordinate === 'lng' && 180 || coordinate === 'lat' && 90
  console.warn(comparator)

  return (control: FormControl): { [key: string]: boolean } | null => {
    console.warn()
    if (isFinite(control.value) && Math.abs(control.value) <= comparator) {
      return null;
    }

    return { 'coordinates': true };
  };
}

function getErrorMsg(x: AbstractControl, y: string): string {
  if (x.errors?.['required']) {
    return 'field is required'
  }
  if (x.errors?.['minlength']) {
    return `type at least ${x.errors['minlength'].requiredLength} characters`
  }

  if (x.errors?.['coordinates']) {
    return `wrong ${y} pattern`
  }

  return 'error msg'
}
