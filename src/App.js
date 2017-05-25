import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Content from './Content.js';

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="App-intro">
					<Content />
				</div>
			</div>
		);
	}
}

export default App;
