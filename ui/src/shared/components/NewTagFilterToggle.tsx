import React, {PureComponent} from 'react'

import AnnotationFilterControl from 'src/shared/components/AnnotationFilterControl'

import {NEW_TAG_FILTER} from 'src/shared/annotations/helpers'

import {TagFilter} from 'src/types/annotations'

interface Props {
  onCreate: (t: TagFilter) => Promise<void>
  onGetKeySuggestions: () => Promise<string[]>
  onGetValueSuggestions: (key: string) => Promise<string[]>
}

interface State {
  isAdding: boolean
}

class NewTagFilterToggle extends PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this.state = {isAdding: false}
  }

  public render() {
    const {onGetKeySuggestions, onGetValueSuggestions} = this.props
    const {isAdding} = this.state

    return (
      <>
        {isAdding && (
          <AnnotationFilterControl
            tagFilter={NEW_TAG_FILTER()}
            autoFocus={true}
            onUpdate={this.handleCreate}
            onDelete={this.handleDiscard}
            onGetKeySuggestions={onGetKeySuggestions}
            onGetValueSuggestions={onGetValueSuggestions}
          />
        )}
        <button
          className="btn btn-sm btn-primary annotation-control-bar--add-filter"
          onClick={this.handleAddTagFilter}
        >
          <span className="icon plus" />
        </button>
      </>
    )
  }

  private handleAddTagFilter = () => {
    this.setState({isAdding: true})
  }

  private handleCreate = async (t: TagFilter) => {
    const {onCreate} = this.props

    onCreate(t)

    this.setState({isAdding: false})
  }

  private handleDiscard = async (): Promise<void> => {
    this.setState({isAdding: false})
  }
}

export default NewTagFilterToggle
