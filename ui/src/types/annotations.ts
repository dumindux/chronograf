export interface Annotation {
  id: string
  startTime: number
  endTime: number
  text: string
  links: {self: string}
}

export interface AnnotationRange {
  since: number
  until: number
}
