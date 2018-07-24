import {Dispatch} from 'redux'

import {Annotation, AnnotationRange, TagFilter} from 'src/types/annotations'

export type Action =
  | EditingAnnotationAction
  | DismissEditingAnnotationAction
  | AddingAnnotationAction
  | AddingAnnotationSuccessAction
  | DismissAddingAnnotationAction
  | MouseEnterTempAnnotationAction
  | MouseLeaveTempAnnotationAction
  | LoadAnnotationsAction
  | UpdateAnnotationAction
  | SetAddingAnnotationAction
  | DeleteAnnotationAction
  | AddAnnotationAction
  | SetEditingAnnotationAction
  | SetTagFilterAction
  | RemoveTagFilterAction
  | SetAddingTagFilterAction
  | SetTagKeysAction
  | SetTagValuesAction

export interface EditingAnnotationAction {
  type: 'EDITING_ANNOTATION'
}

export type DismissEditingAnnotationActionCreator = () => DismissEditingAnnotationAction

export interface DismissEditingAnnotationAction {
  type: 'DISMISS_EDITING_ANNOTATION'
}

export interface AddingAnnotationAction {
  type: 'ADDING_ANNOTATION'
}

export interface AddingAnnotationSuccessAction {
  type: 'ADDING_ANNOTATION_SUCCESS'
}

export interface DismissAddingAnnotationAction {
  type: 'DISMISS_ADDING_ANNOTATION'
}

export interface MouseEnterTempAnnotationAction {
  type: 'MOUSEENTER_TEMP_ANNOTATION'
}

export interface MouseLeaveTempAnnotationAction {
  type: 'MOUSELEAVE_TEMP_ANNOTATION'
}

export interface LoadAnnotationsAction {
  type: 'LOAD_ANNOTATIONS'
  payload: {
    annotations: Annotation[]
  }
}

export interface UpdateAnnotationAction {
  type: 'UPDATE_ANNOTATION'
  payload: {
    annotation: Annotation
  }
}

export interface SetAddingAnnotationAction {
  type: 'SET_ADDING_ANNOTATION'
  payload: Annotation | null
}

export interface DeleteAnnotationAction {
  type: 'DELETE_ANNOTATION'
  payload: {
    annotation: Annotation
  }
}

export interface AddAnnotationAction {
  type: 'ADD_ANNOTATION'
  payload: {
    annotation: Annotation
  }
}

export interface SetEditingAnnotationAction {
  type: 'SET_EDITING_ANNOTATION'
  payload: string | null
}

export type GetAnnotationsDispatcher = (
  indexUrl: string,
  annotationRange: AnnotationRange
) => GetAnnotationsThunk

export type GetAnnotationsThunk = (
  dispatch: Dispatch<LoadAnnotationsAction>
) => Promise<void>

export interface SetTagFilterAction {
  type: 'SET_TAG_FILTER'
  payload: {
    dashboardId: number
    tagFilter: TagFilter | null
  }
}

export interface RemoveTagFilterAction {
  type: 'REMOVE_TAG_FILTER'
  payload: {
    dashboardId: number
    tagKey: string
  }
}

export interface SetAddingTagFilterAction {
  type: 'SET_ADDING_TAG_FILTER'
  payload: TagFilter
}

export interface SetTagKeysAction {
  type: 'SET_TAG_KEYS'
  payload: string[]
}

export type FetchAndSetTagKeysAction = () => ((
  dispatch: Dispatch<SetTagKeysAction>
) => Promise<void>)

export interface SetTagValuesAction {
  type: 'SET_TAG_VALUES'
  payload: {
    tagKey: string
    tagValues: string[]
  }
}

export type FetchAndSetTagValuesAction = (
  tagKey: string
) => ((dispatch: Dispatch<SetTagKeysAction>) => Promise<void>)
