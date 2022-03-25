import { MouseEvent, useEffect, useRef, useState } from 'react';
import { Form, Button, Col, Container, ToggleButton } from 'react-bootstrap';
import ReactPlayer from 'react-player';


export default function MidNavBar(){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const m = useRef({w: 0, h: 0})


  useEffect(() => {
    const canvas = canvasRef.current;
    canvas!.width = window.innerWidth * 2;
    canvas!.height = window.innerHeight * 2;
    canvas!.style.width = `${window.innerWidth}px`;
    canvas!.style.height = `${window.innerHeight}px`;
    const context = canvas?.getContext("2d");
    context?.scale(2,2);
    context!.strokeStyle = 'blue';
    context!.lineWidth = 4;
    contextRef.current = context;
  }, [])

  const startDrawing = ({nativeEvent}: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    setIsDrawing(true);
    const { offsetX, offsetY, clientX, clientY } = nativeEvent;
    contextRef.current!.beginPath();
    contextRef.current!.rect(offsetX, offsetY, 300,200);
  }

  const endDrawing = () => {
    setIsDrawing(false);
    contextRef.current!.closePath();
  }

  const draw = ({nativeEvent}: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    if(!isDrawing) return;
    const { offsetX, offsetY, clientX, clientY } = nativeEvent;
    contextRef.current!.stroke();
    m.current.w = clientX;
    m.current.h = clientY;
  }

  return (
    <div className='mid-sidebar'>
        <div className='form-group'>
          <Form.Group controlId='dataset-selection' className='col-sm-6'>
            <Form.Label>Select Dataset</Form.Label>
            <Form.Control as='select' name='dataset-select' defaultValue={'Hard Hats (object detection)'} style={{width: '300px'}} 
              className='dataset-style'>
              <option value={'hard_hats'}>Hard Hats (object detection)</option>  
              <option value={'truck'}>Trucks (object detection)</option>  
              <option value={'worker'}>Worker (object detection)</option>  
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='new_dataset_button' className='col-sm-6'>
            <Button className='new_dataset_btn'>Create New Dataset</Button>  
          </Form.Group>
        </div>
          <div className='player'>
            <ReactPlayer width={'830px'} height={'540px'} loop={true} url={"https://www.youtube.com/watch?v=9SyVuPxkuxA"} playing={true} muted/>
          </div>
          <canvas 
            ref={canvasRef} 
            className='canvas' 
            width={'830px'} 
            height={'540px'} 
            style={{position: 'absolute', zIndex: 999}}
            // onClick={() => alert("hello")}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseMove={draw}
          />
    </div>
  )
}

