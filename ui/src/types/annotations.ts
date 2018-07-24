export interface Annotation {
  id: string
  startTime: number
  endTime: number
  text: string
  labels?: string[]
  links: {self: string}
}

export interface AnnotationRange {
  since: number
  until: number
}

export enum TagFilterType {
  Equals = '==',
  NotEquals = '!=',
  RegEquals = '=~',
  RegNotEquals = '!~',
}

export interface TagFilter {
  id: string
  tagKey: string
  tagValue: string
  filterType: TagFilterType
}
