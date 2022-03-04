import React, { Component } from 'react'
import { Form, Button, Col, Container, ToggleButton } from 'react-bootstrap'

class MidNavBar extends Component {
  render() {
    return (
      <div className='mid-sidebar'>
          <div className='form-group'>
            <Form.Group controlId='dataset-selection' className='col-sm-6'>
              <Form.Label>Select Dataset</Form.Label>
              <Form.Control as='select' name='dataset-select' defaultValue={'Hard Hats (object detection)'} style={{width: '300px'}}>
                <option value={'hard_hats'}>Hard Hats (object detection)</option>  
                <option value={'truck'}>Trucks (object detection)</option>  
                <option value={'worker'}>Worker (object detection)</option>  
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='new_dataset_button' className='col-sm-6'>
              <Button varient='primary' className='new_dataset_btn'>Create New Dataset</Button>  
            </Form.Group>
          </div>
      </div>
    )
  }
}

export default MidNavBar