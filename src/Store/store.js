import {applyMiddleware, createStore} from "redux";
import axios from "axios";
import thunk from "redux-thunk";

const ADD_USERS = 'ADD_USERS'
const SET_SEARCH = 'SET_SEARCH'
const SET_FILTER = 'SET_FILTER'

const initialState = {
    users: [],
    search: '',
    filter: ''
}

const table = (state = initialState, action) => {
    switch (action.type) {
        case ADD_USERS:
            return {...state, users: action.users}
        case SET_SEARCH:
            return {...state, search: action.search}
        case SET_FILTER:
            return {...state, filter: action.filter}
        default:
            return state
    }
}

const addUsers = (users) => ({type: ADD_USERS, users})
export const setSearch = (search) => ({type:SET_SEARCH, search})
export const setFilter = (filter) => ({type:SET_FILTER, filter})

export const getUsers = () => {
    return async (dispatch) => {
        let data = await axios.get('https://itrex-react-lab-files.s3.eu-central-1.amazonaws.com/react-test-api.json').then(response => response.data)
        dispatch(addUsers(data))
    }
}

const store = createStore(table, applyMiddleware(thunk))

export default store

window.store = store