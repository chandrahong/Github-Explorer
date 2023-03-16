import React, {Fragment, useEffect, useState} from 'react'
import '../css/Navbar.css'
import { SelectUser , set_repo, set_user } from '../redux/reducers/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchRepositories, getUserData } from '../api/apiCall'
import { selectRepo } from '../redux/reducers/filterSlice'
import Navbar from '../components/Navbar'
import Content from '../components/Content'

const liveUrl="https://github-explorer-server.vercel.app"
const serverUrl = "http://localhost:4000"
const CLIENT_ID= "5cc77c808ff05db1e21a"
const DEV_CLIENT_ID = "e759f676603de7d45d91"

const Login = () => {
  const dispatch = useDispatch();
  const user = useSelector(SelectUser);
  const repo = useSelector(selectRepo)
  const accessToken = localStorage.getItem("accessToken");
  const [rerender, setRerender] = useState(false);
  const history = useNavigate();


  useEffect(() =>{
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const codeParam = urlParams.get("code");

    if(codeParam && (accessToken === null)){
      async function getAccessToken(){
        await fetch(serverUrl +"/getAccessToken?code=" + codeParam, {
          method:"GET"
        }).then((response) => {
          return response.json()
        }).then((data) => {
          console.log(data);
          if(data.access_token){
            console.log(data.access_token);
            localStorage.setItem("accessToken", data.access_token);
            setRerender(!rerender);
          }
        })
      }
      getAccessToken();
    }
  },[])

  useEffect(()=>{
    if(accessToken !== null && user === null){
      getUserData(accessToken)
        .then(data =>{
          console.log(data)
          dispatch(set_user(data));
          localStorage.setItem("avatar_url", data.avatar_url)
        })
    }

    if(user && repo === null && accessToken){
        const username = user.login;
        fetchRepositories(username, accessToken)
          .then((data) => {
            const repoData = data.map(repo => ({name: repo.name, html_url: repo.html_url}));
            console.log(repoData);
            dispatch(set_repo(repoData));
          })
      }
  },[accessToken,user])

  function loginWithGithub(){
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + DEV_CLIENT_ID + "&scope=public_repo%20read:user%20user:email");
  }


  return (
    <Fragment>
              {user && localStorage.getItem("accessToken")?
                history('/home')
              : 
              <Fragment>
                <Navbar />
                <Content />
                <div className="login-background">
                  <div className="login">
                    <div className="login-container">
                      <h1>Login with Authorization</h1>
                      <button type="button" id="github-login" onClick={loginWithGithub}>Log In with Github</button>
                    </div>
                  </div>
                </div>
                  
      
              </Fragment>
              }
       
    </Fragment>
  )
}

export default Login;