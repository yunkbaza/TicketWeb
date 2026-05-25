import {
  Injectable,
  computed,
  signal
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingStore {
  private readonly _requests =
    signal(0);

  readonly isLoading =
    computed(
      () => this._requests() > 0
    );

  startLoading() {
    this._requests.update(
      value => value + 1
    );
  }

  stopLoading() {
    this._requests.update(value =>
      value > 0
        ? value - 1
        : 0
    );
  }

  reset() {
    this._requests.set(0);
  }
}