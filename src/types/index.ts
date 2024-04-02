export enum PartType {
  BLADE = 'blade',
  RATCHET = 'ratchet',
  BIT = 'bit',
}

export type PartData = BitData | RatchetData | BladeData

export interface WikiData {
  set_id: string
  set_url: string
  name: string
  url: string
}

export interface BasePartData {
  id: string
  name: string
  image: string
  type: string
  spin: string
  weight: number
  height: number
  width: number
  attack: number
  defense: number
  wiki: WikiData
}

export interface BitData extends BasePartData {
  endurance: number
  dash: number
  burst_resistance: number
}

export interface RatchetData extends BasePartData {
  endurance: number
}

export interface BladeData extends BasePartData {
  stamina: number
}
