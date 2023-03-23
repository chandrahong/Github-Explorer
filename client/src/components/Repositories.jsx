import React , {Fragment, useEffect, useState}from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { select_filter, select_params_repo} from '../redux/reducers/filterSlice';
import { SelectUpdateBool } from '../redux/reducers/issueSlice';
import { useParams } from 'react-router-dom';
import useUserApiData from './Hooks/useUserApiData';
import Navbar from './Navbar';
import Content from './Content';


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