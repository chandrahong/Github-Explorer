import React , {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../css/RepoContent.css'
import '../css/Loading.css'
import { selectRepo} from '../redux/reducers/filterSlice'
import Card from 'react-bootstrap/Card';
import {SelectIssue, SelectShowIssue, set_issueClick, show_issueClick , set_labelValue, set_updated} from '../redux/reducers/issueSlice';
import {FiEdit} from 'react-icons/fi'
import {AiOutlineDelete} from 'react-icons/ai'
import {FaCheck, FaTimes} from 'react-icons/fa'
import {GoLogoGithub} from 'react-icons/go'
import EditIssue from './EditIssue';
import { DeleteIssues } from '../api/apiCall.js';
import { useParams } from 'react-router-dom'


const RepoContent = () => {
    const repoName = useSelector(selectRepo);
    const issueData = useSelector(SelectIssue);
    const showIssue = useSelector(SelectShowIssue);
    const [deletePop, setDeletePop] = useState(false);
    const editType = "repositories"

    useEffect(()=> {
        dispatch(set_updated(false));
    },[issueData])

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
        const repoChoosen = repoName?.label;
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
            window.location.reload();
          })
        
    }

  return (
    <div className="content-container">
        <div className="header">
            <div className="repo-section">
                <h1 className="repo-name">{repoName?.label}</h1>
            </div>
            <div className="repo-format">
                <h1 id="link-format">Link</h1>
                <h1 id="id-format">ID</h1>
                <h1 id="content-format">Issue Content</h1>
                <h1 id="labels-format">Label</h1>
            </div>
        </div>
        <div className="repo-content">
          
            {issueData === null && repoName !== null && 
                <div className="loading-background">
                    <span className='loader'></span>
                </div>
            }
            
            {issueData?.length === 0 && <div className="no-data"><h1>No Data</h1></div>}
            {showIssue && 
            <div>
                 <EditIssue edit={editType}/> 
            </div>
            }
     
            {issueData && (issueData.map((key) => {
                return (
                    <div key={key.number} className='card-container'>
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
                                    <div className='issuecontent'>
                                        <Card.Title>{key.title}</Card.Title>
                                        <Card.Text>
                                            {key?.body}
                                        </Card.Text>
                                    </div>
                            </Card.Body>
                            <Card.Footer>
                                    <h1 onClick={()=>handleIssues(key)}>{key?.labels.map(key=>key.name)}</h1>
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
            })) 
            
              
        }

        </div>
    </div>
  )
}

export default RepoContent
