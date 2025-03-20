import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  jwt_token: string | null
  isAuthenticated: boolean
}

const initialState: UserState = {
  jwt_token: null,
  isAuthenticated: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ jwt_token: string }>
    ) => {
      const { jwt_token } = action.payload
      state.jwt_token = jwt_token
      state.isAuthenticated = true
    },
    clearUser: (state) => {
      state.jwt_token = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
