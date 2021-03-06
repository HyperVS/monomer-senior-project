import { useState, useEffect, useRef, MouseEvent, useCallback } from "react";
import { Autocomplete, TextField, Button, Collapse, Alert, Box, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from 'react-player';
import axios from "axios";
import "dotenv/config";

const host = process.env.HOST;

export default function LiveStream(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null | undefined>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [detect, setDetect] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isCanvasEmpty, setCanvasEmpty] = useState(true);
    const [canDraw, setCanDraw] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [mode, setMode] = useState<"error" | "success">("success");
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);

    const cameraStreamUrl = `http://${host}/hls/playlist.m3u8`

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
            await axios.post(`http://${host}:8000/create`, {
                location, data: `[{top: ${y}, left: ${x}, width: ${w}, height: ${h}}]`, detect
            });
            setMode("success");
            setMessage("Successfully saved ROI");
            setOpen(true);
        } catch (error) {
            console.error(error);
            setMode("error");
            setMessage("Error saving ROI");
            setOpen(true);
        }
    }, [x, y, w, h, location, detect])

    const CustomAlert = () => (
        <Box sx={{ width: '100%' }}>
            <Collapse in={open}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="medium"
                            onClick={() => setOpen(false)}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    severity={mode}
                    style={{fontSize: 14}}
                    sx={{ mb: 2 }}>
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
    

    return (
        <div style={{cursor: canDraw ? "crosshair" : "default", width: "100%"}}>
            <CustomAlert/>
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
                        width={'auto'}
                        height={'100%'}
                        autoPlay={true}
                        playing
                        muted
                        url={cameraStreamUrl}
                    />
                </div>
                <div className="canvas">
                    <canvas 
                        ref={canvasRef} 
                        className='canvas'
                        width={"720px"} 
                        height={"480px"}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={endDrawing}
                    />
                </div>
            </div>
        </div>
    )
}