import uuid from 'uuid'

import {Annotation, TagFilter, TagFilterType} from 'src/types/annotations'

export const ANNOTATION_MIN_DELTA = 0.5

export const ADDING = 'adding'
export const EDITING = 'editing'

export const DEFAULT_ANNOTATION = (): Annotation => ({
  id: 'tempAnnotation',
  text: 'Name Me',
  startTime: null,
  endTime: null,
  links: {self: ''},
})

export const NEW_TAG_FILTER = (): TagFilter => ({
  id: uuid.v4(),
  tagKey: '',
  tagValue: '',
  filterType: TagFilterType.Equals,
})

export const visibleAnnotations = (
  xAxisRange: [number, number],
  annotations: Annotation[] = []
): Annotation[] => {
  const [xStart, xEnd] = xAxisRange

  if (xStart === 0 && xEnd === 0) {
    return []
  }

  return annotations.filter(a => {
    if (a.startTime === null || a.endTime === null) {
      return false
    }
    if (a.endTime === a.startTime) {
      return xStart <= a.startTime && a.startTime <= xEnd
    }

    return !(a.endTime < xStart || xEnd < a.startTime)
  })
}

export const FILTER_TYPES = [
  TagFilterType.Equals,
  TagFilterType.NotEquals,
  TagFilterType.RegEquals,
  TagFilterType.RegNotEquals,
]
