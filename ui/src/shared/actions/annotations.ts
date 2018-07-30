import * as api from 'src/shared/apis/annotation'
import {Dispatch} from 'redux'

import {getAnnotations} from 'src/shared/apis/annotation'

import {Annotation, AnnotationRange, TagFilter} from 'src/types/annotations'

export type Action =
  | EditingAnnotationAction
  | DismissEditingAnnotationAction
  | AddingAnnotationAction
  | AddingAnnotationSuccessAction
  | DismissAddingAnnotationAction
  | MouseEnterTempAnnotationAction
  | MouseLeaveTempAnnotationAction
  | SetAnnotationsAction
  | UpdateAnnotationAction
  | SetAddingAnnotationAction
  | DeleteAnnotationAction
  | AddAnnotationAction
  | SetEditingAnnotationAction
  | CreateTagFilterAction
  | UpdateTagFilterAction
  | DeleteTagFilterAction
  | SetAddingTagFilterAction
  | SetTagKeysAction
  | SetTagValuesAction

interface EditingAnnotationAction {
  type: 'EDITING_ANNOTATION'
}

export const editingAnnotation = (): EditingAnnotationAction => ({
  type: 'EDITING_ANNOTATION',
})

interface DismissEditingAnnotationAction {
  type: 'DISMISS_EDITING_ANNOTATION'
}

export const dismissEditingAnnotation = (): DismissEditingAnnotationAction => ({
  type: 'DISMISS_EDITING_ANNOTATION',
})

interface AddingAnnotationAction {
  type: 'ADDING_ANNOTATION'
}

export const addingAnnotation = (): AddingAnnotationAction => ({
  type: 'ADDING_ANNOTATION',
})

interface AddingAnnotationSuccessAction {
  type: 'ADDING_ANNOTATION_SUCCESS'
}

export const addingAnnotationSuccess = (): AddingAnnotationSuccessAction => ({
  type: 'ADDING_ANNOTATION_SUCCESS',
})

interface DismissAddingAnnotationAction {
  type: 'DISMISS_ADDING_ANNOTATION'
}

export const dismissAddingAnnotation = (): DismissAddingAnnotationAction => ({
  type: 'DISMISS_ADDING_ANNOTATION',
})

interface MouseEnterTempAnnotationAction {
  type: 'MOUSEENTER_TEMP_ANNOTATION'
}

export const mouseEnterTempAnnotation = (): MouseEnterTempAnnotationAction => ({
  type: 'MOUSEENTER_TEMP_ANNOTATION',
})

interface MouseLeaveTempAnnotationAction {
  type: 'MOUSELEAVE_TEMP_ANNOTATION'
}

export const mouseLeaveTempAnnotation = (): MouseLeaveTempAnnotationAction => ({
  type: 'MOUSELEAVE_TEMP_ANNOTATION',
})

interface SetAnnotationsAction {
  type: 'SET_ANNOTATIONS'
  payload: {
    annotations: Annotation[]
  }
}

export const setAnnotations = (
  annotations: Annotation[]
): SetAnnotationsAction => ({
  type: 'SET_ANNOTATIONS',
  payload: {
    annotations,
  },
})

interface UpdateAnnotationAction {
  type: 'UPDATE_ANNOTATION'
  payload: {
    annotation: Annotation
  }
}

export const updateAnnotation = (
  annotation: Annotation
): UpdateAnnotationAction => ({
  type: 'UPDATE_ANNOTATION',
  payload: {
    annotation,
  },
})

interface SetAddingAnnotationAction {
  type: 'SET_ADDING_ANNOTATION'
  payload: Annotation | null
}

export const setAddingAnnotation = (
  annotation: Annotation | null
): SetAddingAnnotationAction => ({
  type: 'SET_ADDING_ANNOTATION',
  payload: annotation,
})

interface DeleteAnnotationAction {
  type: 'DELETE_ANNOTATION'
  payload: {
    annotation: Annotation
  }
}

export const deleteAnnotation = (
  annotation: Annotation
): DeleteAnnotationAction => ({
  type: 'DELETE_ANNOTATION',
  payload: {
    annotation,
  },
})

interface AddAnnotationAction {
  type: 'ADD_ANNOTATION'
  payload: {
    annotation: Annotation
  }
}

export const addAnnotation = (annotation: Annotation): AddAnnotationAction => ({
  type: 'ADD_ANNOTATION',
  payload: {
    annotation,
  },
})

interface SetEditingAnnotationAction {
  type: 'SET_EDITING_ANNOTATION'
  payload: string | null
}

export const setEditingAnnotation = (
  id: string | null
): SetEditingAnnotationAction => ({
  type: 'SET_EDITING_ANNOTATION',
  payload: id,
})

interface CreateTagFilterAction {
  type: 'CREATE_TAG_FILTER'
  payload: {
    dashboardId: number
    tagFilter: TagFilter
  }
}

export const createTagFilter = (
  dashboardId: number,
  tagFilter: TagFilter
): CreateTagFilterAction => ({
  type: 'CREATE_TAG_FILTER',
  payload: {
    dashboardId,
    tagFilter,
  },
})

interface UpdateTagFilterAction {
  type: 'UPDATE_TAG_FILTER'
  payload: {
    dashboardId: number
    tagFilter: TagFilter
  }
}

export const updateTagFilter = (
  dashboardId: number,
  tagFilter: TagFilter
): UpdateTagFilterAction => ({
  type: 'UPDATE_TAG_FILTER',
  payload: {dashboardId, tagFilter},
})

interface DeleteTagFilterAction {
  type: 'DELETE_TAG_FILTER'
  payload: {
    dashboardId: number
    tagFilter: TagFilter
  }
}

export const deleteTagFilter = (
  dashboardId: number,
  tagFilter: TagFilter
): DeleteTagFilterAction => ({
  type: 'DELETE_TAG_FILTER',
  payload: {dashboardId, tagFilter},
})

interface SetAddingTagFilterAction {
  type: 'SET_ADDING_TAG_FILTER'
  payload: TagFilter
}

export const setAddingTagFilter = (
  addingTagFilter: TagFilter
): SetAddingTagFilterAction => ({
  type: 'SET_ADDING_TAG_FILTER',
  payload: addingTagFilter,
})

interface SetTagKeysAction {
  type: 'SET_TAG_KEYS'
  payload: string[]
}

export const setTagKeys = (tagKeys: string[]): SetTagKeysAction => ({
  type: 'SET_TAG_KEYS',
  payload: tagKeys,
})

interface SetTagValuesAction {
  type: 'SET_TAG_VALUES'
  payload: {
    tagKey: string
    tagValues: string[]
  }
}

export const setTagValues = (
  tagKey: string,
  tagValues: string[]
): SetTagValuesAction => ({
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

export type GetAnnotationsDispatcher = (
  indexUrl: string,
  annotationRange: AnnotationRange
) => GetAnnotationsThunk

export type GetAnnotationsThunk = (
  dispatch: Dispatch<SetAnnotationsAction>
) => Promise<void>

export const getAnnotationsAsync: GetAnnotationsDispatcher = (
  indexUrl: string,
  {since, until}: AnnotationRange
): GetAnnotationsThunk => async (
  dispatch: Dispatch<SetAnnotationsAction>
): Promise<void> => {
  const annotations = await getAnnotations(indexUrl, since, until)

  dispatch(setAnnotations(annotations))
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
