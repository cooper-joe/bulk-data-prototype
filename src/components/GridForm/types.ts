export interface Column {
  id: string
  label: string
  type: 'text' | 'radio'
  options?: string[]
  width?: string
  readOnly?: boolean
}

