import React, {useState, Fragment, useEffect, useRef} from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import {IoMdClose} from 'react-icons/io'
import Select from 'react-select';
import labelNames from '../variables/Label';
import '../css/EditIssue.css'
import { useDispatch, useSelector } from 'react-redux';
import { SelectClickedIssue, SelectShowIssue, show_issueClick, SelectLabelValue, set_updated, set_search_update} from '../redux/reducers/issueSlice';
import { UpdateIssues } from '../api/apiCall';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const EditIssue = (edit) => {
    //redux selector
    const issue = useSelector(SelectClickedIssue);
    const showIssue = useSelector(SelectShowIssue);
    const labelValue = useSelector(SelectLabelValue);

    //useRef
    const titleRef = useRef(null);
    const textareaRef = useRef(null);

    const dispatch = useDispatch();

    const [selectedChoice, setSelectedChoice] = useState({})
    const [editBody, setEditBody] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const choice = [{value : [labelValue[0]],label: labelValue[0]}]

    //Notify when updated
    const updatenotify = () => {
      toast.success('Issue Updated !', {
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

    
    useEffect(() => {
      if(issue){
        setSelectedChoice(choice)
        titleRef.current.value = issue.title;
        textareaRef.current.value = issue.body;
      }
    },[issue])

    const handleClose = () => {
        dispatch(show_issueClick(false));
    };
    
    const handleLabel = (selectedLabel) =>{
        console.log(selectedLabel)
        setSelectedChoice(selectedLabel)
    }


    const handleUpdate = (event) => {
        event.preventDefault();
        const user = issue.user?.login;
        const repoChoosen = issue.repository_url.split('/')[5]
        const issueNumber = issue.number;
        let updateIssues;

        //Different condition while updating
        if(selectedChoice.label){
          if(editTitle.length!== 0 && editBody.length!== 0){
            updateIssues = {
              labels : [selectedChoice.label],
              title: editTitle,
              body: editBody
            }
          }
          else if(editTitle.length === 0 && editBody.length!== 0){
            updateIssues = {
              labels : [selectedChoice.label],
              body: editBody
            }
          }
          else if(editBody.length === 0 && editTitle.length!== 0){
            updateIssues = {
              labels : [selectedChoice.label],
              title: editTitle
            }
          } else {
            updateIssues = {
              labels : [selectedChoice.label]
            }
          }
        }

        if(selectedChoice.label === undefined){
          if(editTitle.length!== 0 && editBody.length!== 0){
            updateIssues = {
              title: editTitle,
              body: editBody
            }
          }
          else if(editTitle.length === 0 && editBody.length!== 0){
            updateIssues = {
              body: editBody
            }
          }
          else if(editBody.length === 0 && editTitle.length!== 0){
            updateIssues = {
              title: editTitle
            }
          }
          else{
            updateIssues = {
              labels : selectedChoice.map(key=>key.label)
            }
          }
        }

        
        if(edit.edit === "repositories"){
          dispatch(set_updated(true))
        }else{
          dispatch(set_search_update(true))
        }

        
        UpdateIssues(updateIssues, user, repoChoosen, issueNumber)
          .then(data => {
            console.log(data);
            updatenotify();
            dispatch(show_issueClick(false));
          })

    }

  return (
    <Fragment>
      <div className="issue-background">
        <Modal className="issue-container" show={showIssue} onHide={handleClose}>
          <Modal.Header className="issue-header">
            <Modal.Title className="issue-label">{issue.repository_url.split('/')[5]}</Modal.Title>
            <IoMdClose className="close-button" onClick={handleClose}/>
          </Modal.Header>
          <Modal.Body>
            
            <Form className="input-area">
            
              <Form.Group className="selector">
                <Form.Group className="state-select">
                  <Modal.Title className="state-label">Labels</Modal.Title>
                  <Select 
                  options={labelNames}
                  onChange={handleLabel}
                  value ={selectedChoice}
                  defaultValue={{label: labelValue[0]}}
                  className="issue-labels"/>
                </Form.Group>
              </Form.Group>

              <Form.Group className="issue-title" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  spellCheck="false"
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Enter your title.."
                  ref={titleRef}
                />
              </Form.Group>
              <Form.Group
                className="mb-3 text-area"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Body</Form.Label>
                <Form.Control
                className='create-body'
                as="textarea"
                ref={textareaRef}
                spellCheck="false"
                placeholder="Please input more than 30 words"
                onChange={(e) => setEditBody(e.target.value)}
                rows={12}  
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className="save-modal" onClick={handleUpdate}>
             Update Issue
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Fragment>
  )
}

export default EditIssue
