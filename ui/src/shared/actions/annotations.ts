import * as api from 'src/shared/apis/annotation'
import {Dispatch} from 'redux'

import {getAnnotations} from 'src/shared/apis/annotation'

import * as AnnotationsActions from 'src/types/actions/annotations'
import * as AnnotationsModels from 'src/types/annotations'
import {RemoteDataState} from 'src/types'

export const editingAnnotation = (): AnnotationsActions.EditingAnnotationAction => ({
  type: 'EDITING_ANNOTATION',
})

export const dismissEditingAnnotation = (): AnnotationsActions.DismissEditingAnnotationAction => ({
  type: 'DISMISS_EDITING_ANNOTATION',
})

export const addingAnnotation = (): AnnotationsActions.AddingAnnotationAction => ({
  type: 'ADDING_ANNOTATION',
})

export const addingAnnotationSuccess = (): AnnotationsActions.AddingAnnotationSuccessAction => ({
  type: 'ADDING_ANNOTATION_SUCCESS',
})

export const dismissAddingAnnotation = (): AnnotationsActions.DismissAddingAnnotationAction => ({
  type: 'DISMISS_ADDING_ANNOTATION',
})

export const mouseEnterTempAnnotation = (): AnnotationsActions.MouseEnterTempAnnotationAction => ({
  type: 'MOUSEENTER_TEMP_ANNOTATION',
})

export const mouseLeaveTempAnnotation = (): AnnotationsActions.MouseLeaveTempAnnotationAction => ({
  type: 'MOUSELEAVE_TEMP_ANNOTATION',
})

export const loadAnnotations = (
  annotations: AnnotationsModels.Annotation[]
): AnnotationsActions.LoadAnnotationsAction => ({
  type: 'LOAD_ANNOTATIONS',
  payload: {
    annotations,
  },
})

export const updateAnnotation = (
  annotation: AnnotationsModels.Annotation
): AnnotationsActions.UpdateAnnotationAction => ({
  type: 'UPDATE_ANNOTATION',
  payload: {
    annotation,
  },
})

export const deleteAnnotation = (
  annotation: AnnotationsModels.Annotation
): AnnotationsActions.DeleteAnnotationAction => ({
  type: 'DELETE_ANNOTATION',
  payload: {
    annotation,
  },
})

export const addAnnotation = (
  annotation: AnnotationsModels.Annotation
): AnnotationsActions.AddAnnotationAction => ({
  type: 'ADD_ANNOTATION',
  payload: {
    annotation,
  },
})

export const setEditingAnnotation = (
  id: string | null
): AnnotationsActions.SetEditingAnnotationAction => ({
  type: 'SET_EDITING_ANNOTATION',
  payload: id,
})

export const toggleLabel = (
  label: string,
  dashboardId: number
): AnnotationsActions.ToggleLabelAction => ({
  type: 'TOGGLE_LABEL',
  payload: {label, dashboardId},
})

export const setAnnotationLabelsStatus = (
  status: RemoteDataState
): AnnotationsActions.SetAnnotationLabelsStatusAction => ({
  type: 'SET_ANNOTATION_LABELS_STATUS',
  payload: status,
})

export const loadAnnotationLabels = (
  labels: string[]
): AnnotationsActions.LoadAnnotationLabelsAction => ({
  type: 'LOAD_ANNOTATION_LABELS',
  payload: labels,
})

export const addAnnotationAsync = (
  createUrl: string,
  annotation: AnnotationsModels.Annotation
) => async dispatch => {
  dispatch(addAnnotation(annotation))
  const savedAnnotation = await api.createAnnotation(createUrl, annotation)
  dispatch(deleteAnnotation(annotation))
  dispatch(addAnnotation(savedAnnotation))
}

export const getAnnotationsAsync: AnnotationsActions.GetAnnotationsDispatcher = (
  indexUrl: string,
  {since, until}: AnnotationsModels.AnnotationRange
): AnnotationsActions.GetAnnotationsThunk => async (
  dispatch: Dispatch<AnnotationsActions.LoadAnnotationsAction>
): Promise<void> => {
  const annotations = await getAnnotations(indexUrl, since, until)

  dispatch(loadAnnotations(annotations))
}

export const deleteAnnotationAsync = (
  annotation: AnnotationsModels.Annotation
) => async dispatch => {
  await api.deleteAnnotation(annotation)
  dispatch(deleteAnnotation(annotation))
}

export const updateAnnotationAsync = (
  annotation: AnnotationsModels.Annotation
) => async dispatch => {
  await api.updateAnnotation(annotation)
  dispatch(updateAnnotation(annotation))
}

const delay = ms => new Promise(res => setTimeout(res, ms))

const FAKE_ANNOTATION_LABELS = ['bam', 'slam', 'wham', 'jam', 'yam']

export const getAnnotationLabelsAsync = () => async dispatch => {
  dispatch(setAnnotationLabelsStatus(RemoteDataState.Loading))

  await delay(1000)

  dispatch(loadAnnotationLabels(FAKE_ANNOTATION_LABELS))
  dispatch(setAnnotationLabelsStatus(RemoteDataState.Done))
}
