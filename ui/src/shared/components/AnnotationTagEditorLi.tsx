import React, {PureComponent, ChangeEvent} from 'react'

import {TagFilterType} from 'src/types/annotations'

interface Props {
  tagKey: string
  tagValue: string
  onUpdate: (tagKey: string, tagValue: string) => void
  onDelete: () => void
}

class AnnotationTagEditorLi extends PureComponent<Props> {
  public render() {
    const {tagKey, tagValue, onDelete} = this.props

    return (
      <div className="tag-control">
        <input
          className="form-control input-sm tag-control--key"
          value={tagKey}
          onChange={this.handleChangeTagKey}
        />
        <div className="tag-control--equals">{TagFilterType.Equals}</div>
        <input
          className="form-control input-sm tag-control--value"
          value={tagValue}
          onChange={this.handleChangeTagValue}
        />
        <button
          className="btn btn-default btn-sm tag-control--remove"
          onClick={onDelete}
        >
          <span className="icon remove" />
        </button>
      </div>
    )
  }

  private handleChangeTagKey = (e: ChangeEvent<HTMLInputElement>) => {
    const {onUpdate, tagValue} = this.props

    onUpdate(e.target.value, tagValue)
  }

  private handleChangeTagValue = (e: ChangeEvent<HTMLInputElement>) => {
    const {onUpdate, tagKey} = this.props

    onUpdate(tagKey, e.target.value)
  }
}

export default AnnotationTagEditorLi
