import { actionTypes, initialState } from './const';

export const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actionTypes.ON_DISH_SELECTED:
         return Object.assign({}, state, {
            dishSelected: action.dish,
         })
      case actionTypes.ON_DRAGGING_DISH:
         return Object.assign({}, state, {
            onDraggingDish: action.data,
         })
      // case actionTypes.CHANGE_DETAIL:

      //    return {...state,
      //       assists:{
      //          detail : {
      //             description: action.description,
      //             type       : action.assist_type,
      //             visible       : action.visible,
      //             id       : action.id,
      //             date       : action.date,
      //          }
      //       } ,
      //    }
      default: return state
   }
}
