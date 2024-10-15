import type { Sesion } from './SesionModel'

export interface SesionState {
  loading: boolean
  data: Sesion | null
}
