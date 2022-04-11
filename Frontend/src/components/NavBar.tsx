import { Videocam, VideoLibrary, BurstMode, BarChart, Settings } from "@mui/icons-material"
import { SvgIcon } from "@mui/material";
import { Link, useLocation } from 'react-router-dom'

interface ButtonProps {
    id: string;
    name: string;
    icon: any;
    selected: boolean;
}

function Button(props: ButtonProps){
    return (
        <Link className="button-link" to={`/${props.id}`}>
            <div className="button-container" style={{backgroundColor: props.selected ? "#E0EDFF" : undefined}}>
                <SvgIcon component={props.icon} fontSize="large" style={{marginLeft: 26, marginRight: 24}}/>
                <p style={{fontSize: 20, fontWeight: "bold", marginTop: 10}}>{props.name}</p>
            </div>
        </Link>
    )
}

export default function NavBar(){
    const path = useLocation().pathname.slice(1);
    return (
        <div className="navbar-container">
            <Button id="liveStream" name="Live Stream" icon={Videocam} selected={"liveStream" === path}/>
            <Button id="videoBrowser" name="Video Browser" icon={VideoLibrary} selected={"videoBrowser" === path}/>
            <Button id="imageAnnotation" name="Image Annotation" icon={BurstMode} selected={"imageAnnotation" === path}/>
            <Button id="modelOutput" name="Model Output" icon={BarChart} selected={"modelOutput" === path}/>
            <Button id="admin" name="Admin" icon={Settings} selected={"admin" === path}/>
        </div>
    )
}
