import React, {PureComponent} from 'react'

import OverlayContainer from 'src/reusable_ui/components/overlays/OverlayContainer'
import OverlayHeading from 'src/reusable_ui/components/overlays/OverlayHeading'
import OverlayBody from 'src/reusable_ui/components/overlays/OverlayBody'
import AnnotationEditorForm from 'src/shared/components/AnnotationEditorForm'

import {Annotation} from 'src/types'

interface Props {
  annotation: Annotation
  onCancel: () => void
  onDelete: () => Promise<void>
}

interface State {
  draftAnnotation: Annotation | null
}

class AnnotationEditor extends PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this.state = {draftAnnotation: null}
  }

  public render() {
    const {annotation, onDelete, onCancel} = this.props

    return (
      <div className="annotation-editor">
        <OverlayContainer maxWidth={600}>
          <OverlayHeading title={'Edit Annotation'}>
            <div className="annotation-editor--controls">
              <button className="btn btn-sm btn-default" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn btn-sm btn-success"
                disabled={!this.canSave}
              >
                Save
              </button>
            </div>
          </OverlayHeading>
          <OverlayBody>
            <AnnotationEditorForm
              key={annotation.id}
              annotation={annotation}
              onSetDraftAnnotation={this.handleSetDraftAnnotation}
              onDelete={onDelete}
            />
          </OverlayBody>
        </OverlayContainer>
      </div>
    )
  }

  private get canSave(): boolean {
    return !!this.state.draftAnnotation
  }

  private handleSetDraftAnnotation = (
    draftAnnotation: Annotation | null
  ): void => {
    this.setState({draftAnnotation})
  }
}

export default AnnotationEditor
