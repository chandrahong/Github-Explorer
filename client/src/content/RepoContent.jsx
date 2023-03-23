import React , {useState, useEffect, useRef, useCallback} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../css/RepoContent.css'
import '../css/Loading.css'
import { selectFilter, selectparamaterUrl, selectRepo} from '../redux/reducers/filterSlice'
import Card from 'react-bootstrap/Card';
import {SelectIssue, SelectShowIssue, set_issueClick, show_issueClick , set_labelValue, set_updated, SelectUpdateBool} from '../redux/reducers/issueSlice';
import {FiEdit} from 'react-icons/fi'
import {AiOutlineDelete} from 'react-icons/ai'
import {FaCheck} from 'react-icons/fa'
import {FaTimes} from 'react-icons/fa'
import {GoLogoGithub} from 'react-icons/go'
import EditIssue from './EditIssue';
import { DeleteIssues } from '../api/apiCall.js';
import useInfiniteScroll from '../components/Hooks/useInfiniteScroll'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';


const RepoContent = () => {
    const parameters = useSelector(selectparamaterUrl)
    const repoName = useSelector(selectRepo);
    const showIssue = useSelector(SelectShowIssue);

    const [deletePop, setDeletePop] = useState([]);

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
        setDeletePop(null)
    }

    const {issueData, pageNumber, label, setPageNumber} = useUpdated();

    //passing props
    const editType = "repositories"


    const { loader , hasMore } = useInfiniteScroll(parameters, pageNumber);

    const observer = useRef();
    const lastElementRef = useCallback((node) => {
        if(loader) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) =>{
            if(entries[0].isIntersecting && hasMore && label && issueData.length > 9){
                setTimeout(()=> {
                    setPageNumber( (prev) => prev  + 1);
                },1000)
           
            }
        });
        if(node) observer.current.observe(node);
    },[loader , hasMore, label]);
 

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
        console.log(issue)
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
            deletednotify();
            setDeletePop([]);
            setTimeout(()=> {
                window.location.reload();
            },2000)
          })
        
    }

  return (


    <div className="content-container">
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        ></ToastContainer>

        {loader && !hasMore && repoName !== null &&
            <div className="loading-background">
                <span className='loader'></span>
            </div>
        }
        <div className="header">
            <div className="repo-section">
                <h1 className="repo-name">{repoName?.label}</h1>
            </div>
            <div className="repo-format">
                <h1 id="link-format">Link</h1>
                <h1 id="id-format">ID</h1>
                <h1 id="content-format">Total Issue {issueData?.length}</h1>
                <h1 id="labels-format">Label</h1>
            </div>
        </div>
        <div className="repo-content" id="containerDiv"> 
            
            {issueData?.length === 0 && <div className="no-data"><h1>No Data</h1></div>}
            {showIssue && 
            <div>
                 <EditIssue edit={editType}/> 
            </div>
            }

            {deletePop?.length !== 0 &&
                                            <div className="delete-pop">
                                                <div className="delete-pop-container" onMouseLeave={()=>setDeletePop([])}>
                                                    <h1> Delete Issue {deletePop?.number}? </h1>
                                                    <div className="delete-pop-btn">
                                                        <FaCheck id="delete-check" onClick={() => handleDelete(deletePop)}/>
                                                        <FaTimes id="delete-times" onClick={() => setDeletePop([])}/>
                                                    </div>
                                                </div>
                                            </div>
            }
     
            {issueData && (issueData.map((key,index) => {
                if(issueData.length === index + 1){
                    return (<div key={key.number} className='card-container'>
                        <Card >
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
                                        <Card.Text ref={lastElementRef}>
                                            {key?.body}
                                        </Card.Text>
                                    </div>
                            </Card.Body>
                            <Card.Footer>
                                    <h1 onClick={()=>handleIssues(key)}>{key?.labels.map(key=>key.name)}</h1>
                                    <div className="repo-button">
                                        <FiEdit id="edit-btn" onClick={() => handleIssues(key)}/>
                                        <AiOutlineDelete id="delete-btn" onClick={() => setDeletePop(key)}/>
                                    </div>
                            </Card.Footer>
                        </Card>
                    </div>)
                } else {
                    return (<div key={key.number} className='card-container'>
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
                                            <AiOutlineDelete id="delete-btn" onClick={() => setDeletePop(key)}/>
                                        </div>
                                </Card.Footer>
                            </Card>
                        </div>)
                }
            })) 
            }
            <div className="fetch-more">{ hasMore && label && issueData?.length > 9 && <h1>Loading..</h1>}</div>

        </div>
    </div>
  )
}

export default RepoContent

function useUpdated(){
    //useState PageNumber
    const [pageNumber, setPageNumber] = useState(1);
    const parameters = useSelector(selectparamaterUrl)

    //redux
    const label = useSelector(selectFilter)
    const updated = useSelector(SelectUpdateBool);
    const issueData = useSelector(SelectIssue);
    const dispatch = useDispatch();

    useEffect(()=> {
        setPageNumber(1)
        var myDiv = document.getElementById('containerDiv');
        myDiv.scrollTop = 0;
    },[label, parameters])

    useEffect(()=> {
        if(updated){
            dispatch(set_updated(false));
        }
    },[issueData])

    return {issueData, pageNumber, label, setPageNumber}
}