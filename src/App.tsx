import React from 'react';
import LeftNavBar from './navigation/LeftNavBar';
import MidNavBar from './navigation/MidNavBar';
import RightNavBar from './navigation/RightNavBar';
import Title from './title/Title';



function App() {
  return (
    <header className='header'>
      <Title />
      <div className='container'>
        <div className='row'>
            <div className='col-sm-7 mid-bar'>
                <MidNavBar />
            </div>
            <div className='col-sm-9 left-bar'>
              <LeftNavBar/>
            </div>
            <div className='col-sm-2 offset-md-4 right-bar'>
              <RightNavBar/>
            </div>
        </div>
      </div>
    </header>
  );
}

export default App;
