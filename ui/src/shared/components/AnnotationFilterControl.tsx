import React, {PureComponent} from 'react'

import Debouncer from 'src/shared/utils/debouncer'
import {FILTER_TYPES} from 'src/shared/annotations/helpers'
import AnnotationFilterControlInput from 'src/shared/components/AnnotationFilterControlInput'

import {TagFilter, TagFilterType} from 'src/types/annotations'

const nextItem = (xs, x) => xs[(xs.indexOf(x) + 1) % xs.length]
const TOGGLE_FILTER_DEBOUNCE_DELAY = 500

type DraftState = 'SAVING' | 'EDITING' | 'DEFAULT'

interface Props {
  tagFilter: TagFilter
  autoFocus?: boolean
  onUpdate: (t: TagFilter) => Promise<void>
  onDelete: (t: TagFilter) => Promise<void>
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

class AnnotationFilterControl extends PureComponent<Props, State> {
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

    this.debouncer = new Debouncer()
  }

  public render() {
    const {autoFocus} = this.props
    const {
      tagKey,
      tagValue,
      filterType,
      keySuggestions,
      valueSuggestions,
    } = this.state

    return (
      <div className="annotation-filter-control">
        <div className="annotation-filter-control--tag-key">
          <AnnotationFilterControlInput
            value={tagKey}
            inputClass="input-xs"
            onChange={this.handleTagKeyChange}
            onFocus={this.handleTagKeyFocus}
            onSelect={this.handleSelectTagKey}
            suggestions={keySuggestions}
            autoFocus={autoFocus}
          />
        </div>
        <div
          className="annotation-filter-control--filter-type"
          onClick={this.toggleFilterType}
        >
          {filterType}
        </div>
        <div className="annotation-filter-control--tag-value">
          <AnnotationFilterControlInput
            value={tagValue}
            inputClass="input-xs"
            onChange={this.handleTagValueChange}
            onFocus={this.handleTagValueFocus}
            onSelect={this.handleSelectTagValue}
            suggestions={valueSuggestions}
          />
        </div>
        {this.renderIcon()}
      </div>
    )
  }

  public renderIcon() {
    const {draftState} = this.state

    if (draftState === 'SAVING') {
      return <div className="annotation-filter-control--loading" />
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

    this.setState({draftState: 'SAVING'})

    onDelete(tagFilter)
  }

  private toggleFilterType = (): void => {
    const {filterType} = this.state

    this.setState({
      filterType: nextItem(FILTER_TYPES, filterType),
      draftState: 'SAVING',
    })

    this.debouncer.call(this.save, TOGGLE_FILTER_DEBOUNCE_DELAY)
  }

  private save = async (): Promise<void> => {
    const {onUpdate, onDelete, tagFilter} = this.props
    const {tagKey, filterType, tagValue} = this.state

    this.setState({draftState: 'SAVING'})

    if (tagKey === '') {
      onDelete(tagFilter)
    } else {
      await onUpdate({id: tagFilter.id, tagKey, filterType, tagValue})
      this.setState({draftState: 'DEFAULT'})
    }
  }

  private handleSelectTagKey = (tagKey: string): void => {
    this.setState({tagKey}, this.save)
  }

  private handleSelectTagValue = (tagKey: string): void => {
    this.setState({tagKey}, this.save)
  }

  private handleTagKeyChange = (tagKey: string): void => {
    this.setState({tagKey})
  }

  private handleTagValueChange = (tagValue: string) => {
    this.setState({tagValue})
  }
}

export default AnnotationFilterControl
