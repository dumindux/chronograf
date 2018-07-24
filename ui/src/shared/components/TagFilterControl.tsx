import React, {PureComponent, KeyboardEvent, ChangeEvent} from 'react'

import Debouncer from 'src/shared/utils/debouncer'
import {FILTER_TYPES} from 'src/shared/annotations/helpers'

import {TagFilter, TagFilterType} from 'src/types/annotations'

const nextItem = (xs, x) => xs[(xs.indexOf(x) + 1) % xs.length]
const TOGGLE_FILTER_DEBOUNCE_DELAY = 500

type DraftState = 'SAVING' | 'EDITING' | 'DEFAULT'

interface Props {
  tagFilter: TagFilter
  autoFocus?: boolean
  onUpdate: (t: TagFilter) => void
  onDelete: (t: TagFilter) => void
  onGetKeySuggestions?: () => Promise<string[]>
  onGetValueSuggestions?: (key: string) => Promise<string[]>
}

interface State {
  tagKey: string
  tagValue: string
  filterType: TagFilterType
  keySuggestions: string[]
  valueSuggestions: string[]
  draftState: DraftState
}

class TagFilterControl extends PureComponent<Props, State> {
  private tagKeyInput: React.RefObject<HTMLInputElement>
  private debouncer: Debouncer

  constructor(props) {
    super(props)

    const {tagKey, tagValue, filterType} = props.tagFilter

    this.state = {
      tagKey,
      tagValue,
      filterType,
      keySuggestions: [],
      valueSuggestions: [],
      draftState: 'DEFAULT',
    }

    this.tagKeyInput = React.createRef<HTMLInputElement>()
    this.debouncer = new Debouncer()
  }

  public componentDidMount() {
    if (this.props.autoFocus) {
      this.tagKeyInput.current.focus()
    }
  }

  public render() {
    const {tagKey, tagValue, filterType} = this.state

    return (
      <div className="annotation-tag-filter">
        <div className="annotation-tag-filter--tag-key">
          <input
            ref={this.tagKeyInput}
            className="form-control input-xs"
            value={tagKey}
            onChange={this.handleTagKeyChange}
            onFocus={this.handleTagKeyFocus}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <div
          className="annotation-tag-filter--filter-type"
          onClick={this.toggleFilterType}
        >
          {filterType}
        </div>
        <div className="annotation-tag-filter--tag-value">
          <input
            className="form-control input-xs"
            value={tagValue}
            onChange={this.handleTagValueChange}
            onFocus={this.handleTagValueFocus}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        {this.renderIcon()}
      </div>
    )
  }

  public renderIcon() {
    const {draftState} = this.state

    if (draftState === 'SAVING') {
      // TODO: Spinner
    } else if (draftState === 'EDITING') {
      return (
        <div className="btn btn-xs btn-default" onClick={this.save}>
          <span className="icon checkmark" />
        </div>
      )
    } else {
      return (
        <div className="btn btn-xs btn-default" onClick={this.handleDelete}>
          <span className="icon remove" />
        </div>
      )
    }
  }

  private handleTagKeyFocus = async (): Promise<void> => {
    this.setState({draftState: 'EDITING'})

    const keySuggestions = await this.props.onGetKeySuggestions()

    this.setState({keySuggestions})
  }

  private handleTagValueFocus = async (): Promise<void> => {
    this.setState({draftState: 'EDITING'})

    const valueSuggestions = await this.props.onGetValueSuggestions(
      this.state.tagKey
    )

    this.setState({valueSuggestions})
  }

  private handleDelete = (): void => {
    const {onDelete, tagFilter} = this.props

    onDelete(tagFilter)
  }

  private toggleFilterType = (): void => {
    const {filterType} = this.state

    this.setState({filterType: nextItem(FILTER_TYPES, filterType)})

    this.debouncer.call(this.save, TOGGLE_FILTER_DEBOUNCE_DELAY)
  }

  private save = (): void => {
    const {onUpdate, tagFilter} = this.props
    const {tagKey, filterType, tagValue} = this.state

    onUpdate({id: tagFilter.id, tagKey, filterType, tagValue})

    this.setState({draftState: 'DEFAULT'})
  }

  private handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key == 'Enter') {
      this.save()
    }
  }

  private handleTagKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({tagKey: e.target.value})
  }

  private handleTagValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({tagValue: e.target.value})
  }
}

export default TagFilterControl
