import React, { Component } from 'react'
import {Nav} from "react-bootstrap";
import { MDBCheckbox } from 'mdb-react-ui-kit';


class RightNavBar extends Component {
  render() {
    return (
      <div className='right-sidebar'>
        <Nav className="d-none d-md-block bg-light">

            <div className='bar-container'>

                <p className='title-dataset_stats'>Dataset Stats</p>
                <div className='data-sets-field'>
                
                </div>

                <p className='title-class_labels'>Class Labels</p>
                <div className='class-labels-field'>
                    <MDBCheckbox name='hard_hat' value='' id='hard_hat_check' label='hard_hat' defaultChecked/>
                    <MDBCheckbox name='truck' value='' id='truck_check' label='truck' defaultChecked />
                    <MDBCheckbox name='worker' value='' id='worker_check' label='worker' defaultChecked />    
                </div>

                <p className='title-options'>Options</p>
                <div className='options-field'>
                   <div className='row'>
                        <div className='col-md-6'>
                            <p>Detect Objects:</p>
                                <MDBCheckbox name='inside_region' value='' id='inside_region_check' label='Inside region' defaultChecked/>
                                <MDBCheckbox name='outside_region' value='' id='outside_region_check' label='Outside region' defaultChecked />
                        </div>
                        <div className='col-md-6'>
                            <p>Send Alerts:</p>
                                <MDBCheckbox name='alert_yes' value='' id='alert_yes_check' label='Yes' defaultChecked/>
                                <MDBCheckbox name='alert_no' value='' id='alert_no_check' label='No' defaultChecked />
                        </div>
                    </div> 
                </div>

                <p className='title-shortcuts'>Keyboard Shortcuts</p>
                <div className='shortcuts-field'>
                    <p>d: Next image</p>
                    <p>a: Previous image</p>
                    <p>w: New rectangle</p>
                    <p>c: Copy from previous image</p>
                    <p>↑: Move rectangle up</p>
                    <p>↓: Move rectangle down</p>
                    <p>→: Move rectangle right</p>
                    <p>←: Move rectangle left</p>
                </div>

            </div>

        </Nav>
      </div>
    )
  }
}

export default RightNavBar