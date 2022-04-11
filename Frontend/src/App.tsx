import NavBar from "./components/NavBar";
import Header from "./components/Header";
import LiveStream from "./components/LiveStream";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <div>
      <Header/>
      <BrowserRouter>
        <div className="app-container">
          <NavBar/>
          <Routes>
            <Route path="" element={<Navigate to={"/liveStream"}/>}/>
            <Route path="liveStream" element={<LiveStream/>}/>
            <Route path="videoBrowser" element={null}/>
            <Route path="imageAnnotation" element={null}/>
            <Route path="modelOutput" element={null}/>
            <Route path="admin" element={null}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
