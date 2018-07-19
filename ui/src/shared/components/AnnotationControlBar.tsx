import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import {ADDING} from 'src/shared/annotations/helpers'

import {
  addingAnnotation,
  dismissAddingAnnotation,
} from 'src/shared/actions/annotations'

interface Props {
  isAddingAnnotation: boolean
  onAddingAnnotation: typeof addingAnnotation
  onDismissAddingAnnotation: typeof dismissAddingAnnotation
}

class AnnotationControlBar extends PureComponent<Props> {
  public render() {
    return (
      <div className="annotation-control-bar">
        <div className="annotation-control-bar--lhs">
          {this.renderEmptyState()}
        </div>
        <div className="annotation-control-bar--rhs">
          {this.renderToggleButton()}
        </div>
      </div>
    )
  }

  private renderEmptyState(): JSX.Element {
    return (
      <div className="annotation-control-bar--empty">
        There are no <strong>Annotation Labels</strong> present in this time
        range
      </div>
    )
  }

  private renderToggleButton(): JSX.Element {
    const {isAddingAnnotation} = this.props
    const buttonClass = isAddingAnnotation ? 'default' : 'primary'

    let buttonContent

    if (isAddingAnnotation) {
      buttonContent = 'Cancel Add Annotation'
    } else {
      buttonContent = (
        <>
          <span className="icon plus" /> Add Annotation
        </>
      )
    }

    return (
      <div
        className={`btn btn-${buttonClass} btn-sm`}
        onClick={this.handleToggleAddingAnnotation}
      >
        {buttonContent}
      </div>
    )
  }

  private handleToggleAddingAnnotation = (): void => {
    const {
      isAddingAnnotation,
      onAddingAnnotation,
      onDismissAddingAnnotation,
    } = this.props

    if (isAddingAnnotation) {
      onDismissAddingAnnotation()
    } else {
      onAddingAnnotation()
    }
  }
}

const mstp = ({annotations: {mode}}) => ({
  isAddingAnnotation: mode === ADDING,
})

const mdtp = {
  onAddingAnnotation: addingAnnotation,
  onDismissAddingAnnotation: dismissAddingAnnotation,
}

export default connect(mstp, mdtp)(AnnotationControlBar)
