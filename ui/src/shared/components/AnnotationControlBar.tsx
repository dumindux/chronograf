import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import AddAnnotationToggle from 'src/shared/components/AddAnnotationToggle'
import AnnotationFilterControl from 'src/shared/components/AnnotationFilterControl'

import {
  updateTagFilter,
  deleteTagFilter,
  fetchAndSetTagKeys,
  fetchAndSetTagValues,
  setAddingTagFilter,
} from 'src/shared/actions/annotations'

import {NEW_TAG_FILTER} from 'src/shared/annotations/helpers'
import {getTagFilters} from 'src/shared/selectors/annotations'

import {Source} from 'src/types'
import {TagFilter} from 'src/types/annotations'
import {AnnotationState} from 'src/shared/reducers/annotations'

interface Props {
  dashboardId: number
  tagFilters: TagFilter[]
  addingTagFilter?: TagFilter
  tagKeys?: string[]
  tagValues: {
    [tagKey: string]: string[]
  }
  source: Source
  onUpdateTagFilter: typeof updateTagFilter
  onDeleteTagFilter: typeof deleteTagFilter
  onRefreshAnnotations: () => Promise<void>
  onGetTagKeys: typeof fetchAndSetTagKeys
  onGetTagValues: typeof fetchAndSetTagValues
  onSetAddingTagFilter: typeof setAddingTagFilter
}

class AnnotationControlBar extends PureComponent<Props> {
  public render() {
    const {tagFilters, addingTagFilter} = this.props

    return (
      <div className="annotation-control-bar">
        <div className="annotation-control-bar--lhs">
          <div className="toolbar-title">Filter Annotations by Tags:</div>
          {tagFilters.map(tagFilter => (
            <AnnotationFilterControl
              key={tagFilter.id}
              tagFilter={tagFilter}
              onUpdate={this.handleUpdateTagFilter}
              onDelete={this.handleDeleteTagFilter}
              onGetKeySuggestions={this.handleGetKeySuggestions}
              onGetValueSuggestions={this.handleGetValueSuggestions}
            />
          ))}
          {addingTagFilter && (
            <AnnotationFilterControl
              tagFilter={addingTagFilter}
              onUpdate={this.handleSaveNewTagFilter}
              onDelete={this.handleDeleteTagFilter}
              onGetKeySuggestions={this.handleGetKeySuggestions}
              onGetValueSuggestions={this.handleGetValueSuggestions}
            />
          )}
          <button
            className="btn btn-sm btn-primary annotation-control-bar--add-filter"
            onClick={this.handleAddTagFilter}
          >
            <span className="icon plus" />
          </button>
        </div>
        <div className="annotation-control-bar--rhs">
          <AddAnnotationToggle />
        </div>
      </div>
    )
  }

  private handleAddTagFilter = () => {
    const {onSetAddingTagFilter} = this.props

    onSetAddingTagFilter(NEW_TAG_FILTER())
  }

  private handleSaveNewTagFilter = async (t: TagFilter) => {
    const {
      onSetAddingTagFilter,
      onUpdateTagFilter,
      onRefreshAnnotations,
      dashboardId,
    } = this.props

    onUpdateTagFilter(dashboardId, t)
    onSetAddingTagFilter(null)
    onRefreshAnnotations()
  }

  private handleUpdateTagFilter = async (t: TagFilter): Promise<void> => {
    const {dashboardId, onUpdateTagFilter, onRefreshAnnotations} = this.props

    onUpdateTagFilter(dashboardId, t)
    await onRefreshAnnotations()
  }

  private handleDeleteTagFilter = async (t: TagFilter): Promise<void> => {
    const {dashboardId, onDeleteTagFilter, onRefreshAnnotations} = this.props

    onDeleteTagFilter(dashboardId, t)
    await onRefreshAnnotations()
  }

  private handleGetKeySuggestions = async (): Promise<string[]> => {
    const {tagKeys, onGetTagKeys, source} = this.props

    if (!!tagKeys) {
      return tagKeys
    }

    await onGetTagKeys(source.links.proxy)

    return this.props.tagKeys
  }

  private handleGetValueSuggestions = async (
    tagKey: string
  ): Promise<string[]> => {
    const {tagValues, onGetTagValues, source} = this.props

    if (!!tagValues[tagKey]) {
      return tagValues[tagKey]
    }

    await onGetTagValues(source.links.proxy, tagKey)

    return this.props.tagValues[tagKey]
  }
}

const mstp = (
  state: {annotations: AnnotationState},
  ownProps: {dashboardId: number}
): Partial<Props> => {
  const {tagKeys, tagValues, addingTagFilter} = state.annotations
  const tagFilters = getTagFilters(state, ownProps.dashboardId)

  return {tagFilters, tagKeys, tagValues, addingTagFilter}
}

const mdtp = {
  onUpdateTagFilter: updateTagFilter,
  onDeleteTagFilter: deleteTagFilter,
  onGetTagKeys: fetchAndSetTagKeys,
  onGetTagValues: fetchAndSetTagValues,
  onSetAddingTagFilter: setAddingTagFilter,
}

export default connect(mstp, mdtp)(AnnotationControlBar)
