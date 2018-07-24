import {
  ADDING,
  EDITING,
  DEFAULT_ANNOTATION,
} from 'src/shared/annotations/helpers'

import {Action} from 'src/types/actions/annotations'
import {Annotation, TagFilter} from 'src/types/annotations'

export interface AnnotationState {
  annotations: {
    [annotationId: string]: Annotation
  }
  mode: string
  isTempHovering: boolean
  editingAnnotation?: string
  addingAnnotation?: Annotation
  addingTagFilter?: TagFilter
  tagKeys?: string[]
  tagValues: {
    [tagKey: string]: string[]
  }
  tagFilters: {
    [dashboardId: number]: TagFilter[]
  }
}

const initialState = {
  mode: null,
  isTempHovering: false,
  annotations: {},
  tagKeys: null,
  tagValues: {},
  tagFilters: {},
}

const annotationsReducer = (
  state: AnnotationState = initialState,
  action: Action
): AnnotationState => {
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
        addingAnnotation: DEFAULT_ANNOTATION(),
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
        addingAnnotation: null,
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

    case 'SET_ADDING_ANNOTATION': {
      return {
        ...state,
        addingAnnotation: action.payload,
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

    case 'SET_TAG_FILTER': {
      const {tagFilter, dashboardId} = action.payload
      const prevTagFilters = state.tagFilters[dashboardId] || []
      const tagFilters = [
        ...prevTagFilters.filter(t => t.tagKey !== tagFilter.tagKey),
        tagFilter,
      ]

      return {
        ...state,
        tagFilters: {
          ...state.tagFilters,
          [dashboardId]: tagFilters,
        },
      }
    }

    case 'REMOVE_TAG_FILTER': {
      const {tagKey, dashboardId} = action.payload
      const prevTagFilters = state.tagFilters[dashboardId] || []
      const tagFilters = prevTagFilters.filter(t => t.tagKey !== tagKey)

      return {
        ...state,
        tagFilters: {
          ...state.tagFilters,
          [dashboardId]: tagFilters,
        },
      }
    }

    case 'SET_ADDING_TAG_FILTER': {
      return {
        ...state,
        addingTagFilter: action.payload,
      }
    }

    case 'SET_TAG_KEYS': {
      return {
        ...state,
        tagKeys: action.payload,
      }
    }

    case 'SET_TAG_VALUES': {
      const {tagKey, tagValues} = action.payload

      return {
        ...state,
        tagValues: {
          ...state.tagValues,
          [tagKey]: tagValues,
        },
      }
    }
  }

  return state
}

export default annotationsReducer
