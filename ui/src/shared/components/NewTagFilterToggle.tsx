import React, {PureComponent} from 'react'

import TagFilterControl from 'src/shared/components/TagFilterControl'

import {NEW_TAG_FILTER} from 'src/shared/annotations/helpers'

import {TagFilter} from 'src/types/annotations'

interface Props {
  onCreate: (t: TagFilter) => void
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
    const {isAdding} = this.state

    return (
      <>
        {isAdding && (
          <TagFilterControl
            tagFilter={NEW_TAG_FILTER()}
            autoFocus={true}
            onUpdate={this.handleCreate}
            onDelete={this.handleDiscard}
            onGetKeySuggestions={() => Promise.resolve([])}
            onGetValueSuggestions={() => Promise.resolve([])}
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

  private handleCreate = (t: TagFilter) => {
    const {onCreate} = this.props

    onCreate(t)

    this.setState({isAdding: false})
  }

  private handleDiscard = () => {
    this.setState({isAdding: false})
  }
}

export default NewTagFilterToggle
