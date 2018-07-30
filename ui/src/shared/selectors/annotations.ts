import {createSelector} from 'reselect'

import {Annotation, TagFilter} from 'src/types/Annotations'
import {AnnotationState} from 'src/shared/reducers/annotations'

const getAnnotationsById = (state: {annotations: AnnotationState}) =>
  state.annotations.annotations

export const getSelectedAnnotations = createSelector(
  getAnnotationsById,
  annotationsById => {
    return Object.values<Annotation>(annotationsById).filter(a => !!a)
  }
)

export const getTagFilters = (
  state: {annotations: AnnotationState},
  dashboardId
): TagFilter[] => {
  return Object.values(state.annotations.tagFilters[dashboardId] || {}).filter(
    v => !!v
  )
}
