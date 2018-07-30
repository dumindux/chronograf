import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import AddAnnotationToggle from 'src/shared/components/AddAnnotationToggle'
import TagFilterControl from 'src/shared/components/TagFilterControl'
import NewTagFilterToggle from 'src/shared/components/NewTagFilterToggle'

import {
  createTagFilter,
  updateTagFilter,
  deleteTagFilter,
} from 'src/shared/actions/annotations'

import {getTagFilters} from 'src/shared/selectors/annotations'

import {TagFilter} from 'src/types/annotations'
import {AnnotationState} from 'src/shared/reducers/annotations'

interface Props {
  dashboardId: number
  tagFilters: TagFilter[]
  onCreateTagFilter: typeof createTagFilter
  onUpdateTagFilter: typeof updateTagFilter
  onDeleteTagFilter: typeof deleteTagFilter
  onRefreshAnnotations: () => Promise<void>
}

class AnnotationControlBar extends PureComponent<Props> {
  public render() {
    const {tagFilters} = this.props

    return (
      <div className="annotation-control-bar">
        <div className="annotation-control-bar--lhs">
          <div className="toolbar-title">Filter Annotations by Tags:</div>
          {tagFilters.map(tagFilter => (
            <TagFilterControl
              key={tagFilter.id}
              tagFilter={tagFilter}
              onUpdate={this.handleUpdateTagFilter}
              onDelete={this.handleDeleteTagFilter}
              onGetKeySuggestions={() => Promise.resolve([])}
              onGetValueSuggestions={() => Promise.resolve([])}
            />
          ))}
          <NewTagFilterToggle onCreate={this.handleCreateTagFilter} />
        </div>
        <div className="annotation-control-bar--rhs">
          <AddAnnotationToggle />
        </div>
      </div>
    )
  }

  public handleCreateTagFilter = (t: TagFilter): void => {
    const {dashboardId, onCreateTagFilter, onRefreshAnnotations} = this.props

    onCreateTagFilter(dashboardId, t)
    onRefreshAnnotations()
  }

  public handleUpdateTagFilter = (t: TagFilter): void => {
    const {dashboardId, onUpdateTagFilter, onRefreshAnnotations} = this.props

    onUpdateTagFilter(dashboardId, t)
    onRefreshAnnotations()
  }

  public handleDeleteTagFilter = (t: TagFilter): void => {
    const {dashboardId, onDeleteTagFilter, onRefreshAnnotations} = this.props

    onDeleteTagFilter(dashboardId, t)
    onRefreshAnnotations()
  }
}

const mstp = (
  state: {annotations: AnnotationState},
  ownProps: {dashboardId: number}
): Partial<Props> => {
  return {
    tagFilters: getTagFilters(state, ownProps.dashboardId),
  }
}

const mdtp = {
  onCreateTagFilter: createTagFilter,
  onUpdateTagFilter: updateTagFilter,
  onDeleteTagFilter: deleteTagFilter,
}

export default connect(mstp, mdtp)(AnnotationControlBar)
