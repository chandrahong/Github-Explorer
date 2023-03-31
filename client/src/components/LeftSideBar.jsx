import React , { useEffect ,Fragment, useState} from 'react'
import labelNames from '../variables/Label'
import { useDispatch, useSelector } from 'react-redux'
import {selectFilter, selectRepo, select_filter, select_parameters_url} from '../redux/reducers/filterSlice'
import { SelectUser } from '../redux/reducers/userSlice'
import '../css/LeftSideBar.css'
import { SelectUpdateBool, set_issue } from '../redux/reducers/issueSlice'
import { useNavigate } from 'react-router-dom'
import { getRepoIssues } from '../api/apiCall'

const LeftSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [popUp, setPopUp] = useState(false)
  const {user, selectedRepo, label} = useLabelFilter();

  function handleFilter(labelname){
    dispatch(select_filter(labelname));
    if(selectedRepo === null){
      //home.jsx if you are not selecting a repo
      setPopUp(true)
    }else{
      // condition when u click the same label
      navigate(`/${user?.login}/${selectedRepo?.label}/${labelname}`);
      window.location.reload();
    }

  }

  return (
    <Fragment>
      {popUp &&<div className="unselected-popup">
          <h1>Select a Repositories</h1>
      </div>
      }
      <div className="left-side-container">
          <div className="content" id={label == 'ALL' ? 'selected' : 'unselected'} onClick={() => handleFilter(['ALL'])}> ALL </div>
          {labelNames && labelNames.map((key) => {
              return <div key={key.label} className="content" id={label == key.label ? 'selected' : 'unselected'} onClick={() => handleFilter(key.value)}>{key.label}</div>
          })}
          <div className="content" id={label == 'ASC' ? 'selected' : 'unselected'} onClick={() => handleFilter(['ASC'])}> ASC</div>
          <div className="content" id={label == 'DESC' ? 'selected' : 'unselected'} onClick={() => handleFilter(['DESC'])}> DESC</div>
      </div>
    </Fragment>
  )
};

export default LeftSideBar


function useLabelFilter(){
    const label = useSelector(selectFilter);
    const selectedRepo = useSelector(selectRepo);
    const updated = useSelector(SelectUpdateBool);
    const user = useSelector(SelectUser);

    const dispatch = useDispatch();

  
    useEffect(() => {
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

    return {user, selectedRepo, label}

}