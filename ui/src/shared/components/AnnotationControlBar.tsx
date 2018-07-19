import React, {PureComponent} from 'react'
import {connect} from 'react-redux'

import AnnotationControlBarLabels from 'src/shared/components/AnnotationControlBarLabels'
import AddAnnotationToggle from 'src/shared/components/AddAnnotationToggle'

import {getAnnotationLabelsAsync} from 'src/shared/actions/annotations'

interface Props {
  dashboardId: number
  onGetAnnotationLabels: () => Promise<void>
}

class AnnotationControlBar extends PureComponent<Props> {
  public componentDidMount() {
    this.props.onGetAnnotationLabels()
  }

  public render() {
    const {dashboardId} = this.props

    return (
      <div className="annotation-control-bar">
        <div className="annotation-control-bar--lhs">
          <AnnotationControlBarLabels dashboardId={dashboardId} />
        </div>
        <div className="annotation-control-bar--rhs">
          <AddAnnotationToggle />
        </div>
      </div>
    )
  }
}

const mdtp = {
  onGetAnnotationLabels: getAnnotationLabelsAsync,
}

export default connect(null, mdtp)(AnnotationControlBar)
