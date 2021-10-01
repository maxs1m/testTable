import {createSelector} from "reselect";

export const users = (state) => {
    return state.users
}

export const search = (state) => {
    return state.search
}

export const filter = (state) => {
    return state.filter
}

export const userSearch = createSelector(users, search,(users, search) => {
    return users.filter(user => user.firstName.toLowerCase().indexOf(search.toLowerCase()) >= 0)
})

export const userFilter = createSelector(users, filter,(users, filter) => {
    return users.filter(user => user.adress.state.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
})