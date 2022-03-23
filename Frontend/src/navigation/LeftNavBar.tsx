import { Nav } from "react-bootstrap";

import video_icon from './images/video-camera.png';
import video_browser_icon from './images/video-browser.png';
import image_annotation_icon from './images/image-annotation.png';
import model_output_icon from './images/model-output.png';
import admin_icon from './images/admin.png';

// TODO: use these after demo, fix icons
// import VideocamIcon from '@mui/icons-material/Videocam';
// import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
// import BurstModeIcon from '@mui/icons-material/BurstMode';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import SettingsIcon from '@mui/icons-material/Settings';

export default function LeftNavBar(){
  return (
    <div className='left-sidebar'>
          <Nav className="d-none d-md-block bg-light">
            <div className='live-stream-style'>
              <button type="button" className='live-stream-btn'><img src={video_icon}
                alt='video icon' className='video-style'/>Live Stream</button>
            </div>

            <div className='video-browser-style'>
              <button type="button" className='video-browser-btn'><img src={video_browser_icon} 
                alt="video browser icon" className='video-browser-style'/>Video Browser</button>
            </div>

            <div className='image-annotation-style'>
              <button type="button" className='image-annotation-btn'><img src={image_annotation_icon} 
                alt="image annotation icon" className='image-annotation-style'/>Image Annotation</button>
            </div>

            <div className='model-output-style'>
              <button type="button" className='model-output-btn'><img src={model_output_icon}
                alt="model output icon" className='model_output_style'/>Model Output</button>
            </div>

            <div className='admin-style'>
              <button type="button" className='admin-btn'><img src={admin_icon}
                alt="admin icon" className='admin-style'/>Admin</button>
            </div>
          </Nav>
    </div>
  )
}
