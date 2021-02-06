# Error Handling best practice

## Install source-map-cli to be able to read the production files created by angular and return source file name, line and column just like when we are debugging in development environment
* npm i -D source-map-cli

## Go to angular.json and force angular --prod to create a hidden sourcemap
```
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
    "outputPath": "dist/prod",
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": {
      "scripts": true,
      "hidden": true
    },...
```

## Create an error interface
* IError.ts
```
export interface IError {
  message: string,
  name: string,
  stack: string
}
```

## Create an error service
```
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

```

## Create an error handler class to overwrite default angular error handling behavior
* error-handler.ts
```
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
```

* Now, when we run ng build --prod it'll generate .js.map files. It's very important to not upload these files to production server, otherwise, it'll consequently give the user the ability to get the source code of your production bundled files. So, we deppend on developper to do the job accordingly.

* Since error-handler is manipulating the error, we can send it to an log service to inform the error to development team.

* Developer will receive the error stack like this:
```
"Error: Throwed error.
    at new t (http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:188006)
    at Ge.t.ɵfac [as factory] (http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:188068)
    at vn (http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:28705)
    at http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:78782
    at http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:78853
    at zi.create (http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:79139)
    at t.bootstrap (http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:94429)
    at http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:91765
    at Array.forEach (<anonymous>)
    at t._moduleDoBootstrap (http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:91752)"
```

* Developer should take the second line
```
http://localhost/prod/main.0cc84879dd0bdb6d758a.js:1:188006
```
and now it's time to make source-map-cli package do it's job.

* Get back to VsCode and put production files togheter with .js.map files at: dist/prod/

* Run the following command into terminal
```
 source-map resolve "dist/prod/main.0cc84879dd0bdb6d758a.js.map" "1" "188006"
```
Obs: We can write a script at package.json in order to facilitate calling source-map:
```
"sourcemap": "source-map resolve"
```
In this case we can run bellow command
```
npm run sourcemap dist/prod/main.0cc84879dd0bdb6d758a.js.map 1 188006
```

* We should have bellow result
```
Maps to webpack:///src/app/app.component.ts:13:10

    throw new Error('Throwed error.')
          ^
```
