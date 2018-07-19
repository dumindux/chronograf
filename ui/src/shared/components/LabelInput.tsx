import React, {KeyboardEvent, ChangeEvent, PureComponent} from 'react'

interface Props {
  labels: string[]
  onSetLabels: (newLabels: string[]) => void
}

interface State {
  currentInput: string
}

class LabelInput extends PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this.state = {currentInput: ''}
  }

  public render() {
    const {labels} = this.props
    const {currentInput} = this.state

    return (
      <div className={`label-input form-control input-sm`}>
        {labels.map(label => (
          <span key={label} className="label-input--label">
            {label}
            <span
              className="icon remove label-input--remove"
              onClick={this.handleDeleteLabel(label)}
            />
          </span>
        ))}
        <input
          type="text"
          value={currentInput}
          onChange={this.handleCurrentInputChange}
          onKeyUp={this.handleKeyUp}
        />
      </div>
    )
  }

  private handleCurrentInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({currentInput: e.target.value})
  }

  private handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    const {currentInput} = this.state

    if (e.key === 'Enter') {
      this.addLabel()
    } else if (e.key === 'Backspace' && !currentInput) {
      this.deleteLastLabel()
    }
  }

  private addLabel = (): void => {
    const {labels, onSetLabels} = this.props
    const {currentInput} = this.state

    if (!currentInput) {
      return
    }

    onSetLabels([...labels, currentInput])
    this.setState({currentInput: ''})
  }

  private deleteLastLabel = (): void => {
    const {labels, onSetLabels} = this.props

    if (!labels.length) {
      return
    }

    onSetLabels(labels.slice(0, labels.length - 1))
  }

  private handleDeleteLabel = (label: string) => (): void => {
    const {labels, onSetLabels} = this.props

    onSetLabels(labels.filter(l => l !== label))
  }
}

export default LabelInput
