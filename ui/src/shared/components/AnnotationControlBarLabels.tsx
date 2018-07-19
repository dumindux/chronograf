import React, {SFC} from 'react'
import {connect} from 'react-redux'

import {toggleLabel} from 'src/shared/actions/annotations'

import {RemoteDataState} from 'src/types'

interface Props {
  dashboardId: number
  allLabels: string[]
  allLabelsStatus: RemoteDataState
  selectedLabels: string[]
  onToggleLabel: typeof toggleLabel
}

const AnnotationControlBarLabels: SFC<Props> = props => {
  const {
    allLabels,
    allLabelsStatus,
    selectedLabels,
    onToggleLabel,
    dashboardId,
  } = props

  if (allLabelsStatus !== RemoteDataState.Loading && !allLabels.length) {
    return (
      <div className="annotation-control-bar--empty">
        There are no <strong>Annotation Labels</strong> present in this time
        range
      </div>
    )
  }

  if (allLabelsStatus === RemoteDataState.Loading) {
    return (
      <div className="annotation-control-bar--loading">
        Loading <strong>Annotation Labels</strong>...
      </div>
    )
  }

  return (
    <>
      <div className="toolbar-title">Annotation Labels:</div>
      {allLabels.map(label => {
        const onToggle = () => onToggleLabel(label, dashboardId)
        const selected = selectedLabels.includes(label) ? 'selected' : ''

        return (
          <div
            key={label}
            className={`annotation-control-bar--label ${selected}`}
            onClick={onToggle}
          >
            {label}
          </div>
        )
      })}
    </>
  )
}

const mstp = (
  {annotations: {allLabels, allLabelsStatus, selectedLabels}},
  {dashboardId}
) => ({
  allLabels,
  allLabelsStatus,
  selectedLabels: selectedLabels[dashboardId] || [],
})

const mdtp = {
  onToggleLabel: toggleLabel,
}

export default connect(mstp, mdtp)(AnnotationControlBarLabels)
