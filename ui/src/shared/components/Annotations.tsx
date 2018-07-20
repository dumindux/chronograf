import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

import AnnotationComponent from 'src/shared/components/Annotation'
import NewAnnotation from 'src/shared/components/NewAnnotation'
import {SourceContext} from 'src/CheckSources'

import {ADDING, TEMP_ANNOTATION} from 'src/shared/annotations/helpers'

import {
  updateAnnotation,
  addingAnnotationSuccess,
  mouseEnterTempAnnotation,
  mouseLeaveTempAnnotation,
} from 'src/shared/actions/annotations'
import {visibleAnnotations} from 'src/shared/annotations/helpers'
import {ErrorHandling} from 'src/shared/decorators/errors'

import {Annotation, DygraphClass, Source} from 'src/types'
import {UpdateAnnotationAction} from 'src/types/actions/annotations'

interface Props {
  dWidth: number
  staticLegendHeight: number
  annotations: Annotation[]
  mode: string
  xAxisRange: [number, number]
  dygraph: DygraphClass
  isTempHovering: boolean
  handleUpdateAnnotation: (annotation: Annotation) => UpdateAnnotationAction
  handleAddingAnnotationSuccess: () => void
  handleMouseEnterTempAnnotation: () => void
  handleMouseLeaveTempAnnotation: () => void
}

@ErrorHandling
class Annotations extends Component<Props> {
  public render() {
    const {
      mode,
      dWidth,
      dygraph,
      xAxisRange,
      isTempHovering,
      handleUpdateAnnotation,
      handleAddingAnnotationSuccess,
      handleMouseEnterTempAnnotation,
      handleMouseLeaveTempAnnotation,
      staticLegendHeight,
    } = this.props
    return (
      <div className="annotations-container">
        {mode === ADDING &&
          this.tempAnnotation && (
            <SourceContext.Consumer>
              {(source: Source) => (
                <NewAnnotation
                  dygraph={dygraph}
                  source={source}
                  isTempHovering={isTempHovering}
                  tempAnnotation={this.tempAnnotation}
                  staticLegendHeight={staticLegendHeight}
                  onUpdateAnnotation={handleUpdateAnnotation}
                  onAddingAnnotationSuccess={handleAddingAnnotationSuccess}
                  onMouseEnterTempAnnotation={handleMouseEnterTempAnnotation}
                  onMouseLeaveTempAnnotation={handleMouseLeaveTempAnnotation}
                />
              )}
            </SourceContext.Consumer>
          )}
        {this.annotations.map(a => (
          <AnnotationComponent
            key={a.id}
            mode={mode}
            xAxisRange={xAxisRange}
            annotation={a}
            dygraph={dygraph}
            dWidth={dWidth}
            staticLegendHeight={staticLegendHeight}
          />
        ))}
      </div>
    )
  }

  get annotations() {
    return visibleAnnotations(
      this.props.xAxisRange,
      this.props.annotations,
      TEMP_ANNOTATION.id
    )
  }

  get tempAnnotation() {
    return this.props.annotations.find(a => a.id === TEMP_ANNOTATION.id)
  }
}

const mstp = (state, ownProps) => {
  const {annotations, mode, isTempHovering, selectedLabels} = state.annotations
  const dashboardID = ownProps.params.dashboardID
  const labels = selectedLabels[dashboardID] || []

  let selectedAnnotations = Object.values<Annotation>(annotations).filter(
    a => !!a
  )

  if (labels.length) {
    selectedAnnotations = selectedAnnotations.filter(a =>
      labels.every(v => !!a.labels && a.labels.includes(v))
    )
  }

  return {
    annotations: selectedAnnotations,
    mode: mode || 'NORMAL',
    isTempHovering,
  }
}

const mdtp = {
  handleAddingAnnotationSuccess: addingAnnotationSuccess,
  handleMouseEnterTempAnnotation: mouseEnterTempAnnotation,
  handleMouseLeaveTempAnnotation: mouseLeaveTempAnnotation,
  handleUpdateAnnotation: updateAnnotation,
}

export default withRouter(connect(mstp, mdtp)(Annotations))
