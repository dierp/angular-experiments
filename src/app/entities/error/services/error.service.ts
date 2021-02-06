import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { IError } from '../interfaces/IError'

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _error: BehaviorSubject<IError> = new BehaviorSubject<IError>({} as IError)

  get error (): IError {
    return this._error.value
  }

  set error (error: IError) {
    this._error.next(error)
  }
}
