import * as fileService from './services/file-service'
import * as userService from './services/user-service'

export interface Injections {
  fileService: typeof fileService,
  userService: typeof userService,
}

const store = createStore(storeModel, {
  injections: {
    fileService: fileService,
    userService: userService
  }
})

export default store