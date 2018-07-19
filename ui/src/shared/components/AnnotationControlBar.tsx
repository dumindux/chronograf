import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import AnnotationEditor from 'src/shared/components/AnnotationEditor'

import {ADDING} from 'src/shared/annotations/helpers'

import {
  setEditingAnnotation,
  updateAnnotationAsync,
  deleteAnnotationAsync,
  addingAnnotation,
  dismissAddingAnnotation,
} from 'src/shared/actions/annotations'

import {Annotation} from 'src/types'

interface Props {
  editingAnnotation?: Annotation
  isAddingAnnotation: boolean
  onAddingAnnotation: typeof addingAnnotation
  onDismissAddingAnnotation: typeof dismissAddingAnnotation
  onSetEditingAnnotation: typeof setEditingAnnotation
  onDeleteAnnotation: typeof deleteAnnotationAsync
  onSaveAnnotation: typeof updateAnnotationAsync
}

class AnnotationControlBar extends PureComponent<Props> {
  public render() {
    const {editingAnnotation} = this.props

    return (
      <div className="annotation-control-bar">
        <div className="annotation-control-bar--lhs">
          {this.renderEmptyState()}
        </div>
        <div className="annotation-control-bar--rhs">
          {this.renderToggleButton()}
        </div>
        {editingAnnotation && (
          <div className="overlay-tech show">
            <div className="overlay--dialog" data-test="overlay-children">
              <AnnotationEditor
                annotation={editingAnnotation}
                onCancel={this.handleCancelEdits}
                onSave={this.handleSave}
                onDelete={this.handleDelete}
              />
            </div>
            <div className="overlay--mask" />
          </div>
        )}
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

  private handleCancelEdits = (): void => {
    const {onSetEditingAnnotation} = this.props

    onSetEditingAnnotation(null)
  }

  private handleDelete = async (): Promise<void> => {
    const {editingAnnotation, onDeleteAnnotation} = this.props

    await onDeleteAnnotation(editingAnnotation)

    return
  }

  private handleSave = async (a: Annotation): Promise<void> => {
    const {onSaveAnnotation, onSetEditingAnnotation} = this.props

    await onSaveAnnotation(a)

    onSetEditingAnnotation(null)

    return
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

const mstp = ({annotations: {annotations, mode, editingAnnotation}}) => {
  return {
    editingAnnotation: annotations[editingAnnotation],
    isAddingAnnotation: mode === ADDING,
  }
}

const mdtp = {
  onSaveAnnotation: updateAnnotationAsync,
  onAddingAnnotation: addingAnnotation,
  onDismissAddingAnnotation: dismissAddingAnnotation,
  onSetEditingAnnotation: setEditingAnnotation,
  onDeleteAnnotation: deleteAnnotationAsync,
}

export default connect(mstp, mdtp)(AnnotationControlBar)
