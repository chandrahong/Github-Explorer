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
    <div className="left-side-container">
        <div className="content" id={labelHover == "ALL"? 'selected' : 'unselected'}onClick={() => handleFilter(['ALL'])}> ALL </div>
        {labelNames && labelNames.map((key) => {
            return <div key={key.label} className="content" id={labelHover == key.label ? 'selected' : 'unselected'} onClick={() => handleFilter(key.value)}>{key.label}</div>
          
        })}
        <div className="content" id={labelHover == 'ASC' ? 'selected' : 'unselected'} onClick={() => handleFilter(['ASC'])}> ASC</div>
          <div className="content" id={labelHover == 'DESC' ? 'selected' : 'unselected'} onClick={() => handleFilter(['DESC'])}> DESC</div>
    </div>
  )
};

export default SearchSideBar
