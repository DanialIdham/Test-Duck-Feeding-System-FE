import axios from 'axios';
export const GET_SCHEDULED_FEEDINGS = "[SCHEDULE FEEDING] GET ALL";
export const GET_FARM = "[FARM] GET ALL";
export const GET_FOOD = "[FOOD] GET ALL";
export const ADD_A_FARM = "[FOOD] ADD A FARM";
export const UPDATE_FARM = "[FOOD] UPDATE FARM";
export const ADD_FEEDING = "[FOOD] ADD FEEDING";
export const UPDATE_FEEDING = "[FOOD] UPDATE FEEDING";
export const ADD_FOOD = "[FOOD] ADD FOOD";
export const UPDATE_FOOD = "[FOOD] UPDATE FOOD";
export const GET_ALL_SCHEDULED = "[SCHEDULED] GET ALL";
export const ADD_SCHEDULED = "[FOOD] ADD SCHEDULED";
export const UPDATE_SCHEDULED = "[FOOD] UPDATE SCHEDULED";

export const getAllScheduleFeeding = (params) => {
    const request = axios({
        method: "get",
        url: `${process.env.REACT_APP_ENDPOINT}/feeding-schedule`,
        params: params,
        withCredentials: false,
        data: {}
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_SCHEDULED_FEEDINGS,
                payload: response.data,
            })
        );
}

export const getAllFarm = () => {
    const request = axios({
        method: "get",
        url: `${process.env.REACT_APP_ENDPOINT}/farm`,
        params: params,
        withCredentials: false,
        data: {}
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_FARM,
                payload: response.data,
            })
        );
}

export const getAllFood = () => {
    const request = axios({
        method: "get",
        url: `${process.env.REACT_APP_ENDPOINT}/food`,
        params: params,
        withCredentials: false,
        data: {}
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_FOOD,
                payload: response.data,
            })
        );
}

export const addFarm = (data) => {
    const request = axios({
        method: "post",
        url: `${process.env.REACT_APP_ENDPOINT}/farm`,
        params: params,
        withCredentials: false,
        data: data
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: ADD_A_FARM,
                payload: response,
            })
        );
}


export const updateFarm = (data) => {
    const request = axios({
        method: "put",
        url: `${process.env.REACT_APP_ENDPOINT}/farm`,
        params: params,
        withCredentials: false,
        data: data
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: UPDATE_FARM,
                payload: response,
            })
        );
}

export const addScheduleFeeding = (data) => {
    const request = axios({
        method: "post",
        url: `${process.env.REACT_APP_ENDPOINT}/feeding-schedule`,
        params: params,
        withCredentials: false,
        data: data
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: ADD_FEEDING,
                payload: response.data,
            })
        );
}


export const updateScheduleFeeding = (data) => {
    const request = axios({
        method: "put",
        url: `${process.env.REACT_APP_ENDPOINT}/feeding-schedule`,
        params: params,
        withCredentials: false,
        data: data
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: UPDATE_FARM,
                payload: response.data,
            })
        );
}

export const addFood = (data) => {
    const request = axios({
        method: "post",
        url: `${process.env.REACT_APP_ENDPOINT}/food`,
        params: params,
        withCredentials: false,
        data: data
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: ADD_FOOD,
                payload: response.data,
            })
        );
}

export const updateFood = (data) => {
    const request = axios.put(
        `${process.env.REACT_APP_ENDPOINT}/update-food`,
        data
    )
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: UPDATE_FOOD,
                payload: response.data,
            })
        );
}

export const getAllScheduled = () => {
    const request = axios({
        method: "get",
        url: `${process.env.REACT_APP_ENDPOINT}/scheduled`,
        params: params,
        withCredentials: false,
        data: {}
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: GET_ALL_SCHEDULED,
                payload: response.data,
            })
        );
}


export const addScheduled = (data) => {
    const request = axios({
        method: "post",
        url: `${process.env.REACT_APP_ENDPOINT}/scheduled`,
        params: params,
        withCredentials: false,
        data: data
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: ADD_SCHEDULED,
                payload: response.data,
            })
        );
}

export const updateScheduled = (data) => {
    const request = axios({
        method: "put",
        url: `${process.env.REACT_APP_ENDPOINT}/scheduled`,
        params: params,
        withCredentials: false,
        data: data
    });
    return (dispatch) =>
        request.then((response) =>
            dispatch({
                type: UPDATE_SCHEDULED,
                payload: response.data,
            })
        );
}


