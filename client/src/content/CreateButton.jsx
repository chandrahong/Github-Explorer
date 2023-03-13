import { Fragment, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import {IoMdClose} from 'react-icons/io'
import labelNames from '../variables/Label';
import Select from 'react-select';
import '../css/Createbutton.css'
import { useSelector } from 'react-redux';
import { SelectRepo, SelectUser } from '../redux/reducers/userSlice';
import { SendIssues } from '../api/apiCall';


function CreateButton() {
  const user = useSelector(SelectUser);
  const repositories = useSelector(SelectRepo);
  const [showModal, setShowModal] = useState(false);
  const [titlelabel, setTitleLabel] = useState('');
  const [bodylabel, setBodyLabel] = useState('');
  const [selectedrepo, setSelectedRepo] = useState(null)
  const [label, setLabel] = useState(null);

  const handleClose = () => {
    setShowModal(false)
  };
  const handleShow = () => {
    setShowModal(true)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataissues = {
      owner: user.login,
      repo: selectedrepo.label,
      title: titlelabel,
      body: bodylabel,
      labels: label.value,
    };
    SendIssues(dataissues)
      .then((data) => {
        console.log(data);
        window.location.reload();
      })
  };

  const handleRepo= (selectedOption) => {
    setSelectedRepo(selectedOption);
  }

  const handleLabel= (selectedlabel) => {
    setLabel(selectedlabel);
  }

  return (
    <Fragment>
      <Button id="create-button" variant="primary" onClick={handleShow}>
        Create Issue
      </Button>
      <div className="modal-background">
        <Modal className="modal-container" show={showModal} onHide={handleClose}>
          <Modal.Header className="bg-dark p-3">
            <Modal.Title className="header-label">Create Issue</Modal.Title>
            <IoMdClose className="close-button" onClick={handleClose}/>
          </Modal.Header>
          <Modal.Body>
            
            <Form className="input-area">
            
              <Form.Group className="selector">
                <Form.Group className="repo-select">
                  <Modal.Title className="repo-label">Select a Repositories</Modal.Title>
                  <Select 
                  options={repositories.map(repo => ({value: repo.html_url, label: repo.name}))} 
                  onChange={handleRepo}
                  className="create-repo"
                  autoFocus 
                    />
                </Form.Group>

                <Form.Group className="state-select">
                  <Modal.Title className="state-label">Select Labels</Modal.Title>
                  <Select 
                  options={labelNames} 
                  onChange={handleLabel}
                  className="create-state"/>
                </Form.Group>
              </Form.Group>

              <Form.Group className="mb-3 title" controlId="exampleForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your title.."
                  onChange={(e)=> setTitleLabel(e.target.value)}
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
                spellCheck="false"
                placeholder="Please input more than 30 words"
                rows={12} onChange={(e)=> setBodyLabel(e.target.value)} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" className="save-modal" onClick={handleSubmit}>
              Create Issue
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Fragment>
  );
}

export default CreateButton;