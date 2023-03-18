import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRepositories, getUserData } from "../../api/apiCall";
import { SelectRepo, SelectUser, set_repo, set_user } from "../../redux/reducers/userSlice";

export default function useUserApiData(){
    const [loading, setLoading] = useState(false);
    const [username, SetUsername] = useState('');
    const dispatch = useDispatch();
    const history = useNavigate();
    const user = useSelector(SelectUser);
    const repo = useSelector(SelectRepo);

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
                dispatch(set_repo(repoData));
                setLoading(false)
              })
          }
    },[accessToken, username])

    return {user, repo, loading}
}