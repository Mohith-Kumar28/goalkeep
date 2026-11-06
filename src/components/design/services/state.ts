import type { Audiences } from '@/content/design/service-page'

export type Audience = keyof Audiences

export type SignsState = { audience: Audience; checked: ReadonlyArray<number> }

export type SignsAction = { type: 'toggle'; index: number } | { type: 'audience'; audience: Audience }

export const initialSigns: SignsState = { audience: 'nonprofit', checked: [] }

export function signsReducer(state: SignsState, action: SignsAction): SignsState {
  switch (action.type) {
    case 'toggle':
      return {
        ...state,
        checked: state.checked.includes(action.index)
          ? state.checked.filter((i) => i !== action.index)
          : [...state.checked, action.index],
      }
    case 'audience':
      return action.audience === state.audience ? state : { audience: action.audience, checked: [] }
  }
}
