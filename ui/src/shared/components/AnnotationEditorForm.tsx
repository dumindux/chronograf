import React, {PureComponent, ChangeEvent} from 'react'
import moment from 'moment'

import RadioButtons from 'src/reusable_ui/components/radio_buttons/RadioButtons'
import ConfirmButton from 'src/shared/components/ConfirmButton'
import LabelInput from 'src/shared/components/LabelInput'

import Debouncer from 'src/shared/utils/debouncer'

import {Annotation} from 'src/types'

const INPUT_DEBOUNCE_TIME = 600
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SS'
const BAD_DATETIME_ERROR = 'Not a valid date'
const END_BEFORE_START_ERROR = 'End date must be after start date'
const EMPTY_TEXT_ERROR = 'Name cannot be empty'

const getTime = (d: string | number): number => new Date(d).getTime()
const isValidDate = (d: string | number): boolean => !isNaN(getTime(d))
const formatDate = (d: string | number): string =>
  moment(d).format(DATETIME_FORMAT)

type Type = 'point' | 'window'

interface Props {
  annotation: Annotation
  onSetDraftAnnotation: (draft: Annotation) => void
  onDelete: () => Promise<void>
  debouncer?: Debouncer
}

interface State {
  type: Type

  // Last _valid_ state
  text: string
  startTime: number
  endTime: number
  labels: string[]

  // Current state
  startTimeInput: string
  endTimeInput: string

  textError: string | null
  startTimeError: string | null
  endTimeError: string | null
}

class AnnotationEditorForm extends PureComponent<Props, State> {
  private debouncer: Debouncer

  constructor(props) {
    super(props)

    this.debouncer = props.debouncer || new Debouncer()

    const {text, startTime, endTime, labels} = props.annotation
    const type = startTime === endTime ? 'point' : 'window'

    this.state = {
      text,
      startTime: getTime(formatDate(startTime)),
      endTime: getTime(formatDate(endTime)),
      labels: labels || [],
      type,
      startTimeInput: formatDate(startTime),
      startTimeError: null,
      endTimeInput: formatDate(endTime),
      endTimeError: null,
      textError: null,
    }
  }

  public componentWillUnmount() {
    this.debouncer.cancelAll()
  }

  public render() {
    const {onDelete} = this.props
    const {
      type,
      text,
      labels,
      startTimeInput,
      endTimeInput,
      textError,
      startTimeError,
      endTimeError,
    } = this.state

    return (
      <div className="annotation-editor-body">
        <div className="row">
          <div className="form-group col-xs-6">
            <label>
              Name
              {textError && <div className="error">{textError}</div>}
            </label>
            <input
              type="text"
              className="form-control input-sm"
              value={text}
              onChange={this.handleTextChange}
            />
          </div>
          <div className="form-group col-xs-6">
            <label>Type</label>
            <RadioButtons
              buttons={['point', 'window']}
              activeButton={type}
              onChange={this.handleTypeChange}
            />
          </div>
        </div>
        <div className="row">
          <div className={`form-group col-xs-${type === 'point' ? 12 : 6}`}>
            <label>
              {type === 'point' ? 'Time' : 'Start'}
              {startTimeError && <div className="error">{startTimeError}</div>}
            </label>
            <input
              type="text"
              className="form-control input-sm"
              value={startTimeInput}
              onChange={this.handleStartTimeInputChange}
              onBlur={this.handleStartTimeInputBlur}
            />
          </div>
          {type === 'window' && (
            <div className="form-group col-xs-6">
              <label>
                End
                {endTimeError && <div className="error">{endTimeError}</div>}
              </label>
              <input
                type="text"
                className="form-control input-sm"
                value={endTimeInput}
                onChange={this.handleEndTimeInputChange}
                onBlur={this.handleEndTimeInputBlur}
              />
            </div>
          )}
        </div>
        <div className="row">
          <div className="form-group col-xs-12">
            <label>Labels</label>
            <LabelInput labels={labels} onSetLabels={this.handleSetLabels} />
          </div>
        </div>
        <div className="row">
          <ConfirmButton
            text={'Delete'}
            confirmAction={onDelete}
            type="btn-danger"
            customClass={'annotation-editor-body--delete'}
            size="btn-xs"
          />
        </div>
      </div>
    )
  }

  private handleTextChange = ({
    target: {value: text},
  }: ChangeEvent<HTMLInputElement>): void => {
    let nextState: object = {text, textError: null}

    if (!text) {
      nextState = {text, textError: EMPTY_TEXT_ERROR}
    }

    this.setState(nextState, () => this.setDraftAnnotation())
  }

  private handleTypeChange = (type: Type): void => {
    if (type === 'point') {
      this.setState({type}, () => this.setDraftAnnotation())
    } else if (type === 'window') {
      const endTime = getTime(this.props.annotation.endTime)

      this.setState(
        {
          type,
          endTimeInput: formatDate(endTime),
          endTimeError: null,
        },
        () => this.changeEndTime()
      )
    }
  }

  private handleStartTimeInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState(
      {
        startTimeInput: e.target.value,
        startTimeError: null,
      },
      () => {
        this.debouncer.call(this.changeStartTime, INPUT_DEBOUNCE_TIME)
      }
    )
  }

  private handleStartTimeInputBlur = (): void => {
    const {startTimeInput} = this.state

    if (isValidDate(startTimeInput)) {
      this.setState({startTimeInput: formatDate(startTimeInput)})
    }
  }

  private changeStartTime = () => {
    const {startTimeInput} = this.state

    let nextState: object = {
      startTime: getTime(startTimeInput),
      startTimeError: null,
    }

    if (!isValidDate(startTimeInput)) {
      nextState = {startTimeError: BAD_DATETIME_ERROR}
    }

    this.setState(nextState, () => this.setDraftAnnotation())
  }

  private handleEndTimeInputChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState(
      {
        endTimeInput: e.target.value,
        endTimeError: null,
      },
      () => {
        this.debouncer.call(this.changeEndTime, INPUT_DEBOUNCE_TIME)
      }
    )
  }

  private handleEndTimeInputBlur = (): void => {
    const {endTimeInput} = this.state

    if (isValidDate(endTimeInput)) {
      this.setState({endTimeInput: formatDate(endTimeInput)})
    }
  }

  private changeEndTime = () => {
    const {startTime, endTimeInput} = this.state

    let nextState: object = {
      endTime: getTime(endTimeInput),
      endTimeError: null,
    }

    if (!isValidDate(endTimeInput)) {
      nextState = {endTimeError: BAD_DATETIME_ERROR}
    } else if (getTime(endTimeInput) < startTime) {
      nextState = {endTimeError: END_BEFORE_START_ERROR}
    }

    this.setState(nextState, () => this.setDraftAnnotation())
  }

  private handleSetLabels = (labels: string[]) => {
    if (new Set(labels).size !== labels.length) {
      // Don't allow duplicate elements
      return
    }

    this.setState({labels}, () => this.setDraftAnnotation())
  }

  private setDraftAnnotation = (): void => {
    const {annotation, onSetDraftAnnotation} = this.props
    const {
      type,
      startTime,
      endTime,
      text,
      startTimeError,
      endTimeError,
      textError,
      labels,
    } = this.state

    if (!!startTimeError || !!endTimeError || !!textError) {
      onSetDraftAnnotation(null)

      return
    }

    onSetDraftAnnotation({
      id: annotation.id,
      startTime,
      endTime: type === 'window' ? endTime : startTime,
      text,
      labels,
      links: annotation.links,
    })
  }
}

export default AnnotationEditorForm
