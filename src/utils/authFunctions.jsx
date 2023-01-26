import { db, auth } from '../firebase'

export const getUser = () => {
  return auth.currentUsers
}

// export const get