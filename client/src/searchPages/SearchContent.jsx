import React , {Fragment,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SelectRepo, SelectUser } from '../redux/reducers/userSlice'
import Select from "react-select"
import CreateButton from '../content/CreateButton';
import { select_repo } from '../redux/reducers/filterSlice';
import { useNavigate } from 'react-router-dom';
import SearchIssues from './SearchIssues';
import SearchSideBar from './SearchSideBar';
import { SelectSearchUpdatedBool, set_search_update } from '../redux/reducers/issueSlice';


const SearchContent = () => {
    const repositories = useSelector(SelectRepo);
    const user = useSelector(SelectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchUpdate = useSelector(SelectSearchUpdatedBool)
    
    useEffect(()=> {
        dispatch(set_search_update(false))
    },[searchUpdate])

    const handleSelectRepo = (selectedOption) => {
        console.log(selectedOption)
        dispatch(select_repo(selectedOption));
        navigate(`/${user?.login}/${selectedOption.label}`);
        window.location.reload();
    }

  return (
    <Fragment>
         <div className="repo">
            <div className="sidebar">
                {repositories &&
                    <Fragment>
                    <div className="create-div">
                        <Select 
                            placeholder= "Select a Repositories"
                            options={repositories.map(repo => ({value: repo.html_url, label: repo.name}))}
                            id="repo-select"
                            onChange={handleSelectRepo}
                        />
                        

                        <CreateButton />

                    </div>
                    <div className="filter">
                        <SearchSideBar />
                    </div>
                    </Fragment>
                }
            </div>

            <div className="repo-container">
                <SearchIssues />
            </div>
        </div>
    </Fragment> 
  )
}

export default SearchContent
