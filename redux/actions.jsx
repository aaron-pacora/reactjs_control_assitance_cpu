import { actionTypes } from './const';

export const onDishSelected = (dish) => dispatch => {
   return dispatch({ type: actionTypes.ON_DISH_SELECTED,dish })
}

export const onDraggingDish = (data) => dispatch => {
   return dispatch({ type: actionTypes.ON_DRAGGING_DISH, data })
}
// export const changeDetail = (data) =>{
//    return {
//       type : actionTypes.CHANGE_DETAIL,
//       description : data.description,
//       assist_type : data.type,
//       visible : data.visible,
//       id : data.id,
//       date : data.date
//    }
// }
// export const serverRenderClock = (isServer) => dispatch => {
//    return dispatch({ type: actionTypes.TICK, light: !isServer, ts: Date.now() })
// }

// export const startClock = dispatch => {
//    return setInterval(() => {
//       // Dispatch `TICK` every 1 second
//       dispatch({ type: actionTypes.TICK, light: true, ts: Date.now() })
//    }, 1000)
// }

// export const decrementCount = () => dispatch => {
//    return dispatch({ type: actionTypes.DECREMENT })
// }

// export const resetCount = () => dispatch => {
//    return dispatch({ type: actionTypes.RESET })
// }
