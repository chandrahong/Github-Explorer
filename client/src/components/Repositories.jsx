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


const Repositories = () => {
    const {repoName , labelName} = useParams();
    const accessToken = localStorage.getItem("accessToken");

    //redux selector
    const updated = useSelector(SelectUpdateBool);
    const user = useSelector(SelectUser);
    const repo = useSelector(SelectRepo);

    //react useState
    const [username, SetUsername] = useState();
    
    
    const dispatch = useDispatch();
    const history = useNavigate();

    useEffect(() => {
        if(accessToken === null){
          history('/')
        }
        if(user === null && accessToken !== null ){
            getUserData(accessToken)
              .then(data => {
                dispatch(set_user(data));
                SetUsername(data.login);
              })
          }
    
          if(user && repo == null && accessToken){
              fetchRepositories(username)
                .then((data) => {
                const repoData = data.map(repo => ({name: repo.name, html_url: repo.html_url}));
                dispatch(set_repo(repoData));
              })
          }
      },[accessToken, username])
      
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
