import React from 'react';
import LeftNavBar from './navigation/LeftNavBar';
import RightNavBar from './navigation/RightNavBar';
import Title from './title/Title';



function App() {
  return (
    <div>
      <Title />
      <div className='container'>
        <div className='row'>
          <div className='col-md-10 left-bar'>
            <LeftNavBar/>
          </div>
          <div className='col-md-2 offset-md-4 right-bar'>
            <RightNavBar/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
