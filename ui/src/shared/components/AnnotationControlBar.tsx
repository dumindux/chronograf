import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import AnnotationEditor from 'src/shared/components/AnnotationEditor'
import OverlayTechnology from 'src/reusable_ui/components/overlays/OverlayTechnology'

import {
  setEditingAnnotation,
  deleteAnnotationAsync,
} from 'src/shared/actions/annotations'

import {Annotation} from 'src/types'

interface Props {
  editingAnnotation?: Annotation
  onSetEditingAnnotation: typeof setEditingAnnotation
  onDeleteAnnotation: typeof deleteAnnotationAsync
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
          <div className="btn btn-primary btn-sm">
            <span className="icon plus" />
            Add Annotation
          </div>
        </div>
        <OverlayTechnology visible={!!editingAnnotation}>
          <AnnotationEditor
            annotation={editingAnnotation}
            onCancel={this.handleCancelEdits}
            onDelete={this.handleDelete}
          />
        </OverlayTechnology>
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

  private handleCancelEdits = (): void => {
    const {onSetEditingAnnotation} = this.props

    onSetEditingAnnotation(null)
  }

  private handleDelete = async (): Promise<void> => {
    const {editingAnnotation, onDeleteAnnotation} = this.props

    await onDeleteAnnotation(editingAnnotation)

    return
  }
}

const mstp = ({annotations: {annotations, editingAnnotation}}) => {
  return {
    editingAnnotation: annotations[editingAnnotation],
  }
}

const mdtp = {
  onSetEditingAnnotation: setEditingAnnotation,
  onDeleteAnnotation: deleteAnnotationAsync,
}

export default connect(mstp, mdtp)(AnnotationControlBar)
