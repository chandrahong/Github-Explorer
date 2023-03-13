import React from 'react'
import labelNames from '../variables/Label'
import { useDispatch, useSelector } from 'react-redux'
import '../css/LeftSideBar.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { selectFilter, select_filter } from '../redux/reducers/filterSlice'




const SearchSideBar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const labelHover = useSelector(selectFilter)
    const query = new URLSearchParams(location.search).get('q');

  function handleFilter(label){
    dispatch(select_filter(label));
    navigate(`/search/${label}/?q=${query}`);
  }

  return (
    <div className="container">
        <a className="content" id={labelHover == "ALL"? 'selected' : 'unselected'}onClick={() => handleFilter(['ALL'])}> ALL </a>
        {labelNames && labelNames.map((key) => {
            return <a key={key.label} className="content" id={labelHover == key.label ? 'selected' : 'unselected'} onClick={() => handleFilter(key.value)}>{key.label}</a>
        })}
    </div>
  )
};

export default SearchSideBar
