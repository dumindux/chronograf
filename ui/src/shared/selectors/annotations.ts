import {createSelector} from 'reselect'

import {Annotation} from 'src/types'

export const getSelectedLabels = (state, props): string[] => {
  const {selectedLabels} = state.annotations
  const dashboardID = props.params.dashboardID

  return selectedLabels[dashboardID]
}

const getAnnotationsById = state => state.annotations.annotations

export const getSelectedAnnotations = createSelector(
  getSelectedLabels,
  getAnnotationsById,
  (selectedLabels, annotationsById) => {
    console.log('computed')

    const allAnnotations = Object.values<Annotation>(annotationsById).filter(
      a => !!a
    )

    if (!selectedLabels || !selectedLabels.length) {
      return allAnnotations
    }

    return allAnnotations.filter(a =>
      selectedLabels.every(v => !!a.labels && a.labels.includes(v))
    )
  }
)
