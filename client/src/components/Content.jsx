import React, { Fragment, useEffect, useState } from 'react'
import Select from 'react-select';
import '../css/Content.css'
import '../css/Loading.css'
import { useDispatch, useSelector } from 'react-redux';
import LeftSideBar from './LeftSideBar';
import { SelectRepo, SelectUser, set_repo} from '../redux/reducers/userSlice';
import { selectparamsRepo, select_repo } from '../redux/reducers/filterSlice';
import CreateButton from '../content/CreateButton';
import RepoContent from '../content/RepoContent';
import { useNavigate } from 'react-router-dom';
import { fetchRepositories } from '../api/apiCall';

const Content = () => {
  const user = useSelector(SelectUser);
  const repositories = useSelector(SelectRepo);
  const paramsRepo = useSelector(selectparamsRepo);
  const dispatch = useDispatch();
  const [username , setUsername] = useState('')
  const [passingrepo, setPassingRepo] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    setUsername(user?.login)
    if(user && repositories === null){
      fetchRepositories(username)
        .then(data => {
          const repoData = data.map(repo => ({ name: repo.name, html_url: repo.html_url }));
          dispatch(set_repo(repoData));
        })
      }
  },[username])

  useEffect(() =>  {
    if(paramsRepo !== null){
      const choice = [{value : paramsRepo.html_url,label: paramsRepo.name}]
      setPassingRepo(choice);
      const defaultRepo = {value : paramsRepo.html_url,label: paramsRepo.name}
      dispatch(select_repo(defaultRepo))
    }
  },[paramsRepo])

  const handleSelectRepo = (selectedOption) => {
    console.log(selectedOption)
    dispatch(select_repo(selectedOption));
    navigate(`/${user?.login}/${selectedOption.label}`);
    window.location.reload();
  }

  return (
    
    <div className="repo">
      <div className="sidebar">
      {repositories ?
        <Fragment>
          <div className="create-div">
              {paramsRepo !== null? 
                <Select 
                  options={repositories && repositories.map(repo => ({value: repo.html_url, label: repo.name}))}
                  value={passingrepo}
                  placeholder="Select a Repositories"
                  defaultValue={{label: passingrepo.label, value: passingrepo.value}}
                  id="repo-select"
                  onChange={handleSelectRepo}
                />
                :
                <Select 
                  placeholder= "Select a Repositories"
                  options={repositories && repositories.map(repo => ({value: repo.html_url, label: repo.name}))}
                  id="repo-select"
                  onChange={handleSelectRepo}
                />
              }

            <CreateButton />

          </div>
        </Fragment>

        : (
          <Fragment>
            <div className="default-div">
              <Select id="repo-select" className='default-select' placeholder="Select a Repositories" />
              <CreateButton />
            </div>
          </Fragment>
        )
      }

            <div className="filter">
              <LeftSideBar />
            </div>
      </div>

      <div className="repo-container">
          <RepoContent />
      </div>
    </div>
  )
}

export default Content
