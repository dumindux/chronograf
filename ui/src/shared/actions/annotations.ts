import * as api from 'src/shared/apis/annotation'
import {Dispatch} from 'redux'

import {getAnnotations} from 'src/shared/apis/annotation'

import * as AnnotationsActions from 'src/types/actions/annotations'
import {Annotation, AnnotationRange, TagFilter} from 'src/types/annotations'

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
  annotations: Annotation[]
): AnnotationsActions.LoadAnnotationsAction => ({
  type: 'LOAD_ANNOTATIONS',
  payload: {
    annotations,
  },
})

export const updateAnnotation = (
  annotation: Annotation
): AnnotationsActions.UpdateAnnotationAction => ({
  type: 'UPDATE_ANNOTATION',
  payload: {
    annotation,
  },
})

export const setAddingAnnotation = (
  annotation: Annotation | null
): AnnotationsActions.SetAddingAnnotationAction => ({
  type: 'SET_ADDING_ANNOTATION',
  payload: annotation,
})

export const deleteAnnotation = (
  annotation: Annotation
): AnnotationsActions.DeleteAnnotationAction => ({
  type: 'DELETE_ANNOTATION',
  payload: {
    annotation,
  },
})

export const addAnnotation = (
  annotation: Annotation
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

export const setTagFilter = (
  dashboardId: number,
  tagFilter: TagFilter | null
): AnnotationsActions.SetTagFilterAction => ({
  type: 'SET_TAG_FILTER',
  payload: {dashboardId, tagFilter},
})

export const removeTagFilter = (
  dashboardId: number,
  tagKey: string
): AnnotationsActions.RemoveTagFilterAction => ({
  type: 'REMOVE_TAG_FILTER',
  payload: {dashboardId, tagKey},
})

export const setAddingTagFilter = (
  addingTagFilter: TagFilter
): AnnotationsActions.SetAddingTagFilterAction => ({
  type: 'SET_ADDING_TAG_FILTER',
  payload: addingTagFilter,
})

export const setTagKeys = (
  tagKeys: string[]
): AnnotationsActions.SetTagKeysAction => ({
  type: 'SET_TAG_KEYS',
  payload: tagKeys,
})

export const setTagValues = (
  tagKey: string,
  tagValues: string[]
): AnnotationsActions.SetTagValuesAction => ({
  type: 'SET_TAG_VALUES',
  payload: {tagKey, tagValues},
})

export const addAnnotationAsync = (
  createUrl: string,
  annotation: Annotation
) => async dispatch => {
  dispatch(addAnnotation(annotation))
  const savedAnnotation = await api.createAnnotation(createUrl, annotation)
  dispatch(deleteAnnotation(annotation))
  dispatch(addAnnotation(savedAnnotation))
}

export const getAnnotationsAsync: AnnotationsActions.GetAnnotationsDispatcher = (
  indexUrl: string,
  {since, until}: AnnotationRange
): AnnotationsActions.GetAnnotationsThunk => async (
  dispatch: Dispatch<AnnotationsActions.LoadAnnotationsAction>
): Promise<void> => {
  const annotations = await getAnnotations(indexUrl, since, until)

  dispatch(loadAnnotations(annotations))
}

export const deleteAnnotationAsync = (
  annotation: Annotation
) => async dispatch => {
  await api.deleteAnnotation(annotation)
  dispatch(deleteAnnotation(annotation))
}

export const updateAnnotationAsync = (
  annotation: Annotation
) => async dispatch => {
  await api.updateAnnotation(annotation)
  dispatch(updateAnnotation(annotation))
}

export const fetchAndSetTagKeys = () => async dispatch => {
  // TODO: Fetch tag keys
  const tagKeys = await Promise.resolve([])

  dispatch(setTagKeys(tagKeys))
}

export const fetchAndSetTagValues = (tagKey: string) => async dispatch => {
  // TODO: Fetch tag values
  const tagValues = await Promise.resolve([])

  dispatch(setTagValues(tagKey, tagValues))
}
