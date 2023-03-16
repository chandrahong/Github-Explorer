import React , {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../css/SearchIssues.css'
import '../css/Loading.css'
import Card from 'react-bootstrap/Card';
import {SelectShowIssue, set_issueClick, show_issueClick , set_labelValue, SelectIssue, set_search_update} from '../redux/reducers/issueSlice';
import {FiEdit} from 'react-icons/fi'
import {AiOutlineDelete} from 'react-icons/ai'
import {FaCheck, FaTimes} from 'react-icons/fa'
import {GoLogoGithub} from 'react-icons/go'
import { DeleteIssues } from '../api/apiCall.js';
import EditIssue from '../content/EditIssue';
import { useLocation } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { selectFilter } from '../redux/reducers/filterSlice';

const SearchContent = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    //redux-selector
    const issue = useSelector(SelectIssue);
    const label = useSelector(selectFilter)
    const showIssue = useSelector(SelectShowIssue);

    //Others 
    const [deletePop, setDeletePop] = useState(false);
    const editType = "search"

    //Notify when deleted
    const deletednotify = () => {
        toast.success('Issue Deleted!', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
    }

    const dispatch = useDispatch();

    const handleIssues = (issueclicked) => {
        const labelname = issueclicked.labels.map(key=>key.name);
        dispatch(set_labelValue(labelname))
        dispatch(show_issueClick(true))
        dispatch(set_issueClick(issueclicked));
    }

    const handleLink = (link) =>{
        console.log(link)
        window.open(link);
    }

    const handleDelete = (issue) => {
        const issueNumber = issue.number;
        const user = issue.user?.login;
        const repoChoosen = issue.repository_url.split('/')[5];
        const status = "closed";
        const delIssues = {
            owner: user,
            repo: repoChoosen,
            number: issueNumber,
            state: status,
          };
        DeleteIssues(delIssues)
          .then(data => {
            console.log(data);
            deletednotify()
            setTimeout(() => {
                window.location.reload()
            },2000)
            ;
          })
    }

    useEffect(()=>{
        dispatch(set_search_update(false))
    },[issue])

    useEffect(()=>{
        const myDiv = document.getElementById('containerDiv');
        myDiv.scrollTop = 0;
    },[label])


  return (
    <div className="content-container">
        <ToastContainer
            position= "top-right"
            autoClose= {3000}
            hideProgressBar ={false}
            closeOnClick
            pauseOnHover
            draggable
            theme = "dark"
        ></ToastContainer>
        <div className="header">
            <div className="repo-section">
                <h1 className="repo-name">Search Query : {query}</h1>
            </div>
            <div className="repo-format">
                <h1 id="search-link">Link</h1>
                <h1 id="search-id">ID</h1>
                <h1 id="search-repoName">Repositories</h1>
                <h1 id="search-issue">Issue Content</h1>
                <h1 id="search-label">Label</h1>
            </div>
        </div>
        <div className="repo-content" id="containerDiv">
            {showIssue && 
            <div>
                 <EditIssue edit={editType}/> 
            </div>

            }
            {issue ? issue.map((key) => {
                return (
                    <div className='card-container' key={key.number}>
                        <Card>
                            <Card.Header>
                                <div className="id-link">
                                    <GoLogoGithub onClick={() => handleLink(key.html_url)} id="github-btn"/>
                                </div>
                                <div className="id-issue" onClick={()=> handleIssues(key)}>
                                    {key?.number}
                                </div>
                            </Card.Header>
                            <Card.Body onClick={()=> handleIssues(key)}>
                                    <div className='Searchcontent'>
                                        <div className='repoSearch'>
                                            <Card.Title>{key.repository_url.split('/')[5]}</Card.Title>
                                        </div>
                                        <div className="repoSearchBody">
                                            <Card.Title>{key.title}</Card.Title>
                                            <Card.Text>
                                                {key?.body}
                                            </Card.Text>
                                        </div>
                                    </div>
                            </Card.Body>
                            <Card.Footer>
                                    <h1 onClick={()=>handleIssues(key)}>{key?.labels.map(key => key.name)}</h1>
                                    <div className="repo-button">

                                        <FiEdit id="edit-btn" onClick={() => handleIssues(key)}/>
                                        <AiOutlineDelete id="delete-btn" onClick={() => setDeletePop(key.number)}/>
                                    </div>
                                    {deletePop === key.number &&
                                        <div className="delete-pop">
                                            <div className="delete-pop-container" onMouseLeave={()=>setDeletePop(null)}>
                                                <h1> Delete Issue ? </h1>
                                                <div className="delete-pop-btn">
                                                    <FaCheck id="delete-check" onClick={() => handleDelete(key)}/>
                                                    <FaTimes id="delete-times" onClick={() => setDeletePop(null)}/>
                                                </div>
                                            </div>
                                        </div>
                                    }
                            </Card.Footer>
                        </Card>
                    </div>
                )
            })
            :
                <div className="loading-background">
                    <span className='loader'></span>
                 </div>
        
            
        }

        </div>
    </div>
  )
}

export default SearchContent
