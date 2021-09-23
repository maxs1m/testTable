import './App.css';
import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {getUsers, setFilter, setSearch} from "./Store/store";
import {filter, search, userFilter, userSearch} from "./Store/selectors";
import classNames from "classnames";

function App(props) {
    const [users, setUsers] = useState([])
    const [sort, setSort] = useState(['','up'])
    const [option, setOption] = useState([])
    const [page, setPage] = useState(1)
    const [centralPage, setCentralPage] = useState(2)
    const [info, setInfo] = useState({})

    useEffect(() => {
        props.getUsers()
    },[])

    useEffect(() => {
        setUsers(props.users)
        setOption((Array.from(new Set(props.users.map(user => user.adress.state)))))
    },[props.users])

    useEffect(() => {
        setUsers(props.userFilter)
        if (props.userFilter.length < 1)  setUsers(props.users)
    },[props.userFilter])

    const addSort = (params) => {
        let copy = Object.assign([], users);
        if (sort[0] === params) {
            setUsers(copy.reverse())
            setSort([params, (sort[1] === 'up')? 'down':'up'])
            return
        }
        setSort([params, 'up'])
        switch (params) {
            case 'id':
                setUsers(copy.sort((prev, next) => prev[params] - next[params]))
                break
            case 'state':
                setUsers(copy.sort((prev, next) => {
                    if ( prev.adress[params] <  next.adress[params] ) return -1;
                    if ( prev.adress[params] <  next.adress[params] ) return 1;
                }))
                break
            default:
                setUsers(copy.sort((prev, next) => {
                    if ( prev[params] < next[params] ) return -1;
                    if ( prev[params] < next[params] ) return 1;
                }))
                break
        }
    }

    const setSearch = (event) => {
        props.setSearch(event.target.value)
    }

    const setFilter = (event) => {
        let index = event.nativeEvent.target.selectedIndex
        props.setFilter(event.nativeEvent.target[index].text)
    }

    const setFirstPage = () => {
        if (centralPage > 2) setCentralPage(page - 1)
        if (page > 1) {
            setPage( page - 1)
        } else if (page === Math.ceil(users.length/20)) {
            setPage(page - 2)
        } else {
            setPage( 1)
        }
    }

    const setLastPage = () => {
        if (centralPage < Math.ceil(users.length/20 - 1)) setCentralPage(page + 1)
        if (page < Math.ceil(users.length/20)) {
            setPage( page + 1)
        } else if (page === 1) {
            setPage(page + 2)
        } else {
            setPage( Math.ceil(users.length/20))
        }
    }

    return (
        <div className="App">
            <div className='container'>
                <header>
                    <div>
                        <input value={props.search}
                               onChange={setSearch}
                               placeholder='Searching by name'/>
                    </div>
                    <div>
                        <select onChange={setFilter} value={props.filter}>
                            <option value=''>Select</option>
                            {option.map((option, index) =>
                                <option key={index} value={option}>{option}</option>
                            )}
                        </select>
                    </div>
                </header>
                <div className='grid-container'>
                    <div className='grid-container__item'>
                        <div onClick={() => addSort('id')}
                             className={(sort[0] === 'id')? sort[1]:'up'}>Id</div>
                        <div onClick={() => addSort('firstName')}
                             className={(sort[0] === 'firstName')? sort[1]:'up'}>First name</div>
                        <div onClick={() => addSort('lastName')}
                             className={(sort[0] === 'lastName')? sort[1]:'up'}>Last name</div>
                        <div onClick={() => addSort('email')}
                             className={(sort[0] === 'email')? sort[1]:'up'}>Email</div>
                        <div onClick={() => addSort('phone')}
                             className={(sort[0] === 'phone')? sort[1]:'up'}>Phone</div>
                        <div onClick={() => addSort('state')}
                             className={(sort[0] === 'state')? sort[1]:'up'}>State</div>
                    </div>
                    {users.slice((page-1)*20, page*20 - 1).map((user, id) => (
                        <div className='grid-container__item' key={id} onClick={() => setInfo(user)}>
                            <div>{user.id}</div>
                            <div>{user.firstName}</div>
                            <div>{user.lastName}</div>
                            <div>{user.email}</div>
                            <div>{user.phone}</div>
                            <div>{user.adress.state}</div>
                        </div>
                    ))}
                </div>
                <div>
                    {page > 1 && <button onClick={() => {
                        setPage(page - 1)
                        if (centralPage > 2) setCentralPage(page - 1)
                    }}>prev</button>}
                    <button onClick={setFirstPage} className={classNames({'active': page === 1})}>{centralPage - 1}</button>
                    {Math.ceil(users.length/20) > 1 && <button onClick={() => setPage(centralPage)} className={classNames({'active': page === centralPage})}>{centralPage}</button>}
                    {Math.ceil(users.length/20) > 2 && <button onClick={setLastPage} className={classNames({'active': page === Math.ceil(users.length/20)})}>{centralPage + 1}</button>}
                    {page < Math.ceil(users.length/20) && <button onClick={() => {
                        setPage(page + 1)
                        if (centralPage < Math.ceil(users.length/20 - 1)) setCentralPage(page + 1)
                    }}>next</button>}
                </div>
                {info.firstName && <div className='info'>
                    <span>Profile info</span>
                    <span>Selected profile: {info.firstName} {info.lastName}</span>
                    <span>Description: {info.description}</span>
                    <span>Address: {info.adress.streetAddress}</span>
                    <span>City: {info.adress.city}</span>
                    <span>State: {info.adress.state}</span>
                    <span>Index: {info.adress.zip}</span>
                </div>}
            </div>
        </div>
    );
}



const mapStateToProps = (state) => {
    return {
        userFilter: userFilter(state),
        users: userSearch(state),
        filter: filter(state),
        search: search(state)
    }
}

export default connect(mapStateToProps, {getUsers, setSearch, setFilter})(App)
