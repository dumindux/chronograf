import {
  ADDING,
  EDITING,
  DEFAULT_ANNOTATION,
} from 'src/shared/annotations/helpers'

import {Action} from 'src/shared/actions/annotations'
import {Annotation, TagFilter, TagFilterType} from 'src/types/annotations'

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
    [dashboardId: number]: {
      [tagFilterId: string]: TagFilter
    }
  }
}

const recent = Date.now() - 1000 * 60

const initialState = {
  mode: null,
  isTempHovering: false,
  annotations: {
    '49ee1a85-a51a-4fea-9d2d-b9d692d2b41d': {
      id: '49ee1a85-a51a-4fea-9d2d-b9d692d2b41d',
      startTime: recent,
      endTime: recent,
      text: 'houston we have a problem',
      tags: {
        foo: 'bar',
      },
      links: {
        self:
          '/chronograf/v1/sources/6/annotations/49ee1a85-a51a-4fea-9d2d-b9d692d2b41d',
      },
    },
  },
  tagKeys: null,
  tagValues: {},
  tagFilters: {
    1: {
      a: {
        id: 'a',
        tagKey: 'foo',
        filterType: TagFilterType.Equals,
        tagValue: 'bar',
      },
    },
  },
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

    case 'SET_ANNOTATIONS': {
      const annotations = action.payload.annotations.reduce(
        (acc, a) => ({
          ...acc,
          [a.id]: a,
        }),
        {}
      )

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

    case 'CREATE_TAG_FILTER':
    case 'UPDATE_TAG_FILTER': {
      const {tagFilter, dashboardId} = action.payload
      const dashboardTagFilters = state.tagFilters[dashboardId] || {}

      return {
        ...state,
        tagFilters: {
          [dashboardId]: {
            ...dashboardTagFilters,
            [tagFilter.id]: tagFilter,
          },
        },
      }
    }

    case 'DELETE_TAG_FILTER': {
      const {tagFilter, dashboardId} = action.payload
      const dashboardTagFilters = state.tagFilters[dashboardId] || {}

      return {
        ...state,
        tagFilters: {
          ...state.tagFilters,
          [dashboardId]: {
            ...dashboardTagFilters,
            [tagFilter.id]: null,
          },
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
