import { Injectable, ErrorHandler } from '@angular/core'
import { environment } from 'src/environments/environment'
import { ErrorService } from '../entities/error/services/error.service'

@Injectable({
  providedIn: 'root'
})
export class ErrorHandling extends ErrorHandler {
  constructor (private errorService: ErrorService) {
    super()
  }

  handleError (error: Error): any {
    const { message, name, stack } = error
    this.errorService.error = {
      message: message || '',
      name: name || '',
      stack: stack || ''
    }
    if (!environment.production) {
      console.log(this.errorService.error)
    }
  }
}
