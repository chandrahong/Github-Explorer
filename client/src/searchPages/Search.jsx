import React, {Fragment, useEffect, useState} from 'react'
import Navbar from '../components/Navbar'
import SearchContent from './SearchContent'
import { useSelector } from 'react-redux'
import { SelectRepo, SelectUser } from '../redux/reducers/userSlice'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { set_user } from '../redux/reducers/userSlice'
import { set_repo } from '../redux/reducers/userSlice'
import { fetchRepositories, getUserData, SearchIssues } from '../api/apiCall'
import { selectFilter, select_filter } from '../redux/reducers/filterSlice'
import {SelectSearchUpdatedBool, set_issue} from '../redux/reducers/issueSlice'
import '../css/SearchIssues.css'

const Search = () => {
    const {labelName} = useParams();
    console.log(labelName);
    const location = useLocation()
    const query = new URLSearchParams(location.search).get('q');
    
    const accessToken = localStorage.getItem("accessToken");

    const user = useSelector(SelectUser);
    const repo = useSelector(SelectRepo);
    const searchupdated = useSelector(SelectSearchUpdatedBool);
    const label = useSelector(selectFilter)

    const [username, SetUsername] = useState();
    const dispatch = useDispatch();
    const history = useNavigate();

    useEffect(()=> {
        if(query && user && label === null){
            const username = user?.login;
            SearchIssues(query,username)
                .then(data => {
                    dispatch(set_issue(data))
                })
        }
        if(query && user && label){
          SearchIssues(query,username,label)
                .then(data => {
                    dispatch(set_issue(data))
                })
        }
    },[query, user ,label, searchupdated])


    useEffect(() => {
        if(accessToken === null){
          history('/');
        }

        if(labelName){
            dispatch(select_filter([labelName]))
          }
        
        if(user === null && accessToken !== null ){
          getUserData(accessToken)
            .then((data) => {
                 console.log(data)
                 dispatch(set_user(data));
                 SetUsername(data.login);
            })
          }

          if(user && repo == null && accessToken){
            fetchRepositories(username)
              .then((data) => {
                const repoData = data.map(repo => ({name: repo.name, html_url: repo.html_url}));
                console.log(repoData);
                dispatch(set_repo(repoData));
              })
          }
    
      },[accessToken, username, labelName])

  return (
    <Fragment >
      <div className='Search-Page'>
        <Navbar type={"search"}/>
        <SearchContent />
      </div>
    </Fragment>
  )
}

export default Search
