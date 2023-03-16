import React , { useEffect , useRef, useState, useCallback} from 'react'
import labelNames from '../variables/Label'
import { useDispatch, useSelector } from 'react-redux'
import {selectFilter, selectRepo, select_filter, select_parameters_url} from '../redux/reducers/filterSlice'
import { SelectUser } from '../redux/reducers/userSlice'
import '../css/LeftSideBar.css'
import { SelectUpdateBool, set_issue } from '../redux/reducers/issueSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { getRepoIssues } from '../api/apiCall'




const LeftSideBar = () => {
  const dispatch = useDispatch();
  const label = useSelector(selectFilter);
  const selectedRepo = useSelector(selectRepo);
  const updated = useSelector(SelectUpdateBool);
  const user = useSelector(SelectUser);;
  const navigate = useNavigate();

 
  useEffect(() => {
    console.log(label)
    let parameters;
    if(label && selectedRepo){
      parameters = "?user=" + user.login + "&repo=" + selectedRepo.label + "&label=" + label;
    }
    if(selectedRepo && label === null){
      parameters = "?user=" + user.login + "&repo=" + selectedRepo.label;
    }
    if(selectedRepo){
      dispatch(select_parameters_url(parameters))
      getRepoIssues(parameters)
              .then(data => {
                  dispatch(set_issue(data))
          })
    }
  
  
  },[selectedRepo, label, updated])

  function handleFilter(label){
    dispatch(select_filter(label));
    navigate(`/${user?.login}/${selectedRepo.label}/${label}`);
  }

  return (
    <div className="left-side-container">
        <div className="content" id={label == 'ALL' ? 'selected' : 'unselected'} onClick={() => handleFilter(['ALL'])}> ALL </div>
        {labelNames && labelNames.map((key) => {
            return <a key={key.label} className="content" id={label == key.label ? 'selected' : 'unselected'} onClick={() => handleFilter(key.value)}>{key.label}</a>
        })}
        <div className="content" id={label == 'ASC' ? 'selected' : 'unselected'} onClick={() => handleFilter(['ASC'])}> ASC</div>
        <div className="content" id={label == 'DESC' ? 'selected' : 'unselected'} onClick={() => handleFilter(['DESC'])}> DESC</div>
    </div>
  )
};

export default LeftSideBar
