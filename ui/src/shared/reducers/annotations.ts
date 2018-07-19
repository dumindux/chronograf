import {ADDING, EDITING, TEMP_ANNOTATION} from 'src/shared/annotations/helpers'

import {Action} from 'src/types/actions/annotations'
import {Annotation, RemoteDataState} from 'src/types'

export interface AnnotationState {
  mode: string
  isTempHovering: boolean
  annotations: {
    [annotationId: string]: Annotation
  }
  editingAnnotation: string | null
  allLabels: string[]
  allLabelsStatus: RemoteDataState
  selectedLabels: {
    [dashboardId: number]: string[]
  }
}

const initialState = {
  mode: null,
  isTempHovering: false,
  annotations: {},
  editingAnnotation: null,
  allLabels: [],
  allLabelsStatus: RemoteDataState.NotStarted,
  selectedLabels: {},
}

const annotationsReducer = (
  state: AnnotationState = initialState,
  action: Action
) => {
  switch (action.type) {
    case 'EDITING_ANNOTATION': {
      return {
        ...state,
        mode: EDITING,
      }
    }

    case 'DISMISS_EDITING_ANNOTATION': {
      return {
        ...state,
        mode: null,
      }
    }

    case 'ADDING_ANNOTATION': {
      return {
        ...state,
        mode: ADDING,
        isTempHovering: true,
        annotations: {
          ...state.annotations,
          [TEMP_ANNOTATION.id]: TEMP_ANNOTATION,
        },
      }
    }

    case 'ADDING_ANNOTATION_SUCCESS': {
      return {
        ...state,
        isTempHovering: false,
        mode: null,
      }
    }

    case 'DISMISS_ADDING_ANNOTATION': {
      return {
        ...state,
        isTempHovering: false,
        mode: null,
        annotations: {
          ...state.annotations,
          [TEMP_ANNOTATION.id]: null,
        },
      }
    }

    case 'MOUSEENTER_TEMP_ANNOTATION': {
      const newState = {
        ...state,
        isTempHovering: true,
      }

      return newState
    }

    case 'MOUSELEAVE_TEMP_ANNOTATION': {
      const newState = {
        ...state,
        isTempHovering: false,
      }

      return newState
    }

    case 'LOAD_ANNOTATIONS': {
      const annotations = {...state.annotations}

      for (const annotation of action.payload.annotations) {
        annotations[annotation.id] = annotation
      }

      return {
        ...state,
        annotations,
      }
    }

    case 'UPDATE_ANNOTATION': {
      const {annotation} = action.payload

      return {
        ...state,
        annotations: {
          ...state.annotations,
          [annotation.id]: annotation,
        },
      }
    }

    case 'DELETE_ANNOTATION': {
      const {annotation} = action.payload

      return {
        ...state,
        annotations: {
          ...state.annotations,
          [annotation.id]: null,
        },
      }
    }

    case 'ADD_ANNOTATION': {
      const {annotation} = action.payload

      return {
        ...state,
        annotations: {
          ...state.annotations,
          [annotation.id]: annotation,
        },
      }
    }

    case 'SET_EDITING_ANNOTATION': {
      return {
        ...state,
        editingAnnotation: action.payload,
      }
    }

    case 'TOGGLE_LABEL': {
      const {label, dashboardId} = action.payload
      const labels = new Set(state.selectedLabels[dashboardId])

      if (labels.has(label)) {
        labels.delete(label)
      } else {
        labels.add(label)
      }

      return {
        ...state,
        selectedLabels: {
          ...state.selectedLabels,
          [dashboardId]: [...labels],
        },
      }
    }

    case 'SET_ANNOTATION_LABELS_STATUS': {
      return {...state, allLabelsStatus: action.payload}
    }

    case 'LOAD_ANNOTATION_LABELS': {
      const allLabels = action.payload

      return {...state, allLabels}
    }
  }

  return state
}

export default annotationsReducer
