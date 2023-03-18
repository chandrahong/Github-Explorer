import React , {Fragment, useEffect, useState}from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Content from './Content';
import { useDispatch, useSelector } from 'react-redux';
import { SelectRepo, SelectUser } from '../redux/reducers/userSlice';
import { set_user, set_repo } from '../redux/reducers/userSlice';
import { select_filter, select_params_repo} from '../redux/reducers/filterSlice';
import { fetchRepositories, getUserData } from '../api/apiCall';
import { SelectUpdateBool } from '../redux/reducers/issueSlice';
import useUserApiData from './Hooks/useUserApiData';


const Repositories = () => {
    const {repoName , labelName} = useParams();
    //redux selector
    const updated = useSelector(SelectUpdateBool);

    //getting UserData from custom hooks
    const {repo} = useUserApiData();

    const dispatch = useDispatch();
  
    useEffect(() => {
      if(repo !== null){
          if(labelName){
            dispatch(select_filter([labelName]))
          }
          const finder = repo.find(key => key.name === repoName)
          dispatch(select_params_repo(finder));
      }
    },[repo, labelName, updated])

  return (
    <Fragment>
        <Navbar />
        <Content />
    </Fragment>
  )
}

export default Repositories