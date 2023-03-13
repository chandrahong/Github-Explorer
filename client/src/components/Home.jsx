import React, {Fragment, useEffect, useState} from 'react'
import Navbar from './Navbar'
import Content from './Content'
import { useSelector } from 'react-redux'
import { SelectRepo, SelectToken, SelectUser } from '../redux/reducers/userSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { set_user } from '../redux/reducers/userSlice'
import { set_repo } from '../redux/reducers/userSlice'
import { fetchRepositories, getUserData } from '../api/apiCall'
import '../css/Loading.css'

const Home = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(SelectUser);
  const repo = useSelector(SelectRepo);
  const dispatch = useDispatch();
  const [username, SetUsername] = useState();
  const history = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if(accessToken === null){
      history('/');
    }

    if(user === null && accessToken !== null ){
      setLoading(true)
      getUserData(accessToken)
        .then(data => {
          dispatch(set_user(data));
          SetUsername(data.login);
        })
      }

      if(user && repo == null && accessToken){
        fetchRepositories(username)
          .then(data => {
            const repoData = data.map(repo => ({name: repo.name, html_url: repo.html_url}));
            console.log(repoData);
            dispatch(set_repo(repoData));
            setLoading(false)
          })
      }
  },[accessToken, username])

  return (
    <Fragment>
        <div>
          {loading && 
                <div className="loading-background">
                    <span className='loader'></span>
                </div>
          }   
          <Navbar />
          <Content />
        </div>
    </Fragment>
  )
  
}

export default Home
