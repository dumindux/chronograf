import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import AnnotationEditor from 'src/shared/components/AnnotationEditor'

import {
  setEditingAnnotation,
  updateAnnotationAsync,
  deleteAnnotationAsync,
} from 'src/shared/actions/annotations'

import {Annotation} from 'src/types'

interface Props {
  editingAnnotation?: Annotation
  onSetEditingAnnotation: typeof setEditingAnnotation
  onDeleteAnnotation: typeof deleteAnnotationAsync
  onSaveAnnotation: typeof updateAnnotationAsync
}

class AnnotationEditorContainer extends PureComponent<Props> {
  public render() {
    const {editingAnnotation} = this.props

    if (!editingAnnotation) {
      return null
    }

    return (
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
}

const mstp = ({annotations: {annotations, editingAnnotation}}) => {
  return {
    editingAnnotation: annotations[editingAnnotation],
  }
}

const mdtp = {
  onSaveAnnotation: updateAnnotationAsync,
  onSetEditingAnnotation: setEditingAnnotation,
  onDeleteAnnotation: deleteAnnotationAsync,
}

export default connect(mstp, mdtp)(AnnotationEditorContainer)
