import { useState, useEffect, useRef, MouseEvent, useCallback } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import ReactPlayer from 'react-player';
import axios from "axios";

export default function LiveStream(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [detect, setDetect] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isCanvasEmpty, setCanvasEmpty] = useState(true);
    const [canDraw, setCanDraw] = useState(false);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);

    const cameraStreamUrl = "http://192.168.1.94/hls/playlist.m3u8"

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;
        context!.lineWidth = 4;
        contextRef.current = context;
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = contextRef.current!;
        const pixelBuffer = new Uint32Array(context.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
        setCanvasEmpty(!pixelBuffer.some(color => color !== 0));
    }, [canDraw, isCanvasEmpty])

    const startDrawing = (e: MouseEvent) => {
        if(!canDraw) return;
        clearCanvas();
        setX(e.nativeEvent.offsetX);
        setY(e.nativeEvent.offsetY);
        setIsDrawing(true);
    }

    const endDrawing = () => {
        if(isDrawing) setIsDrawing(false);
        setCanDraw(false);
    }

    const draw = (e: MouseEvent) => {
        if(!isDrawing) return;
        const context = contextRef.current!;
        const offsetX = e.nativeEvent.offsetX;
        const offsetY = e.nativeEvent.offsetY;
        setW(offsetX-x);
        setH(offsetY-y);
        if(offsetX <= x || offsetY <= y || w < 0 || h < 0) return clearCanvas(); 
        context.strokeRect(x, y, w, h);
        context.clearRect(x, y, w, h);
        context.clearRect(x-4, offsetY+2, offsetX, offsetY);
        context.clearRect(offsetX+2, y-4, offsetX, offsetY);
    }

    const clearCanvas = () => {
        const canvas = canvasRef.current!
        const context = contextRef.current!;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    const saveROI = useCallback( async () => {
        try {
            await axios.post("http://127.0.0.1:8000/create", {
                location, data: `[{top: ${y}, left: ${x}, width: ${w}, height: ${h}}]`, detect
            });
        } catch (error) {
            console.error(error);
        }
    }, [x, y, w, h, location, detect])

    return (
        <div style={{cursor: canDraw ? "crosshair" : "default"}}>
            <div className="livestream-controls">
                <Autocomplete
                    style={{marginLeft: 40, marginTop: 38}}
                    disablePortal
                    sx={{width: 200, fontSize: 16}}
                    onChange={(_, value) => setLocation(value ? value.toLocaleLowerCase() : null)}
                    options={["Inside", "Outside"]}
                    renderInput={(props) => <TextField {...props} label="Location"/>}
                />
                <Autocomplete
                    style={{marginLeft: 40, marginTop: 38}}
                    disablePortal
                    sx={{width: 200, fontSize: 16}}
                    onChange={(_, value) => setDetect(value ? value.toLocaleLowerCase().replace(" ", "_"): null)}
                    options={["Hardhat", "No hardhat"]}
                    renderInput={(props) => <TextField {...props} label="Detect"/>}
                />
                <div className="roi-button">
                    <Button 
                        variant="contained" 
                        size="large"
                        onClick={() => setCanDraw(true)}
                        >Create new ROI
                    </Button>
                    <Button 
                        onClick={() => saveROI()}
                        disabled={isCanvasEmpty || location === null || detect === null}
                        variant="contained"
                        size="large"
                        style={{marginLeft: 25}}
                        >Save ROI
                    </Button>
                </div>
            </div>
            <div className="player-canvas">
                <div className="player">
                    <ReactPlayer
                        width={'960px'}
                        height={'540px'}
                        loop={true}
                        autoPlay={true}
                        muted
                        url={cameraStreamUrl}
                    />
                </div>
                <div className="canvas">
                    <canvas 
                        ref={canvasRef} 
                        className='canvas'
                        width={'960px'} 
                        height={'540px'}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                    />
                </div>
            </div>
        </div>
    )
}