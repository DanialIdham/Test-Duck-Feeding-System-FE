import * as Actions from "../actions";
import update from 'immutability-helper'

const initialState = {
    searchText: "",
    scheduledFeedings: {},
    scheduledList: {},
    farms: {},
    foods: {},
    farm: {},
    meta: {},
};
export const appReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_SCHEDULED_FEEDINGS: {
            return {
                ...state,
                scheduledFeedings: action.payload.data,
                meta: action.payload.meta,
            };
        }
        case Actions.GET_FARM: {
            return {
                ...state,
                farms: action.payload.data,
            };
        }
        case Actions.GET_FOOD: {
            return {
                ...state,
                foods: action.payload.data,
            };
        }
        case Actions.ADD_A_FARM: {
            if (action.payload.data) {
                return update(state, { farms: { $merge: { [action.payload.data.id]: action.payload.data } } })
            }
            else
                return {
                    ...state,
                };
        }
        case Actions.UPDATE_FARM: {
            return {
                ...state,
            };
        }
        case Actions.ADD_FEEDING: {
            if (action.payload.data) {
                return update(state, { scheduledFeedings: { $merge: { [action.payload.data.id]: action.payload.data } } })
            }
            else
                return {
                    ...state,
                };
        }
        case Actions.UPDATE_FEEDING: {
            return {
                ...state,
            };
        }
        case Actions.ADD_FOOD: {
            if (action.payload.data) {
                return update(state, { foods: { $merge: { [action.payload.data.id]: action.payload.data } } })
            }
            else
                return {
                    ...state,
                };
        }
        case Actions.UPDATE_FOOD: {
            return {
                ...state,
            };
        }
        case Actions.GET_ALL_SCHEDULED: {
            return {
                ...state,
                scheduledList: action.payload.data,
            };
        }
        default: {
            return state;
        }
    }
};

export default appReducer;
