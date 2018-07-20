import {Dispatch} from 'redux'

import * as AnnotationData from 'src/types/annotations'
import {RemoteDataState} from 'src/types'

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
  | ToggleLabelAction
  | SetAnnotationLabelsStatusAction
  | LoadAnnotationLabelsAction

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
    annotations: AnnotationData.Annotation[]
  }
}

export interface UpdateAnnotationAction {
  type: 'UPDATE_ANNOTATION'
  payload: {
    annotation: AnnotationData.Annotation
  }
}

export interface SetAddingAnnotationAction {
  type: 'SET_ADDING_ANNOTATION'
  payload: AnnotationData.Annotation | null
}

export interface DeleteAnnotationAction {
  type: 'DELETE_ANNOTATION'
  payload: {
    annotation: AnnotationData.Annotation
  }
}

export interface AddAnnotationAction {
  type: 'ADD_ANNOTATION'
  payload: {
    annotation: AnnotationData.Annotation
  }
}

export interface SetEditingAnnotationAction {
  type: 'SET_EDITING_ANNOTATION'
  payload: string | null
}

export interface ToggleLabelAction {
  type: 'TOGGLE_LABEL'
  payload: {
    label: string
    dashboardId: number
  }
}

export interface SetAnnotationLabelsStatusAction {
  type: 'SET_ANNOTATION_LABELS_STATUS'
  payload: RemoteDataState
}

export interface LoadAnnotationLabelsAction {
  type: 'LOAD_ANNOTATION_LABELS'
  payload: string[]
}

export type GetAnnotationsDispatcher = (
  indexUrl: string,
  annotationRange: AnnotationData.AnnotationRange
) => GetAnnotationsThunk

export type GetAnnotationsThunk = (
  dispatch: Dispatch<LoadAnnotationsAction>
) => Promise<void>
