import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import './App.css';

class Sidebar extends Component {
	render() {
		return (
			<div className="sidebar">
				{ this.props.elements }
			</div>
		);
	}
}

class SidebarElement extends Component {	
	constructor(props) {
		super(props);

		this.state = {
			isFocused: props.focusedElement === props.id,
			style: {},
		};
	}

	componentDidMount() {
		if (this.state.isFocused) {

		} else {
			this.setState({ style: {
				top: document.querySelector(`.${this.props.id}`).offsetTop,
				position: 'absolute',
			}});
		}
	}

	componentWillReceiveProps(props) {
		this.setState({ isFocused: props.focusedElement === props.id });
	}

	render() {
		console.log(this.state.style);
		return (
			<div className="sidebar-element" style={this.state.style} id={this.props.id}>
				{this.props.text}
				{this.state.isFocused && ' (focused)'}
			</div>
		);
	}
}

class SomeElement extends Component {
	constructor(props) {
		super(props);

		this.onClick = this.onClick.bind(this);

		this.state = {
		};
	}

	onClick() {
		this.props.handleClick(this.props.id);
	}

	componentDidMount() {
		this.props.onMount(React.createElement(SidebarElement, {
			text: this.props.id,
			id: this.props.id,
			key: this.props.id,
			ref: (element) => { this.element = element },
		}));
	}

	componentWillReceiveProps(props) {
		if (this.element) {
			this.element.setState({ isFocused: props.focusedElement === props.id });
		}
	}

	render() {
		return (
			<div className={`some-element ${this.props.id}`} onClick={this.onClick}>
				{this.props.children}
			</div>
		)
	}
}

class Content extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isOpen: false,
			elements: [],
			focusedElement: null,
		};

		this.handleClick = this.handleClick.bind(this);
		this.toggleSidebar = this.toggleSidebar.bind(this);
		this.registerSidebarComponent = this.registerSidebarComponent.bind(this);
	}

	handleClick(id) {
		this.setState({ 
			isOpen: true,
		}, () => {
			this.setState({ focusedElement: id });
		});
	}

	registerSidebarComponent(el) {
		this.state.elements.push(el);
	}

	toggleSidebar() {
		this.setState({
			isOpen: !this.state.isOpen,
			focusedElement: null,
		});
	}

	render() {
		const { isOpen } = this.state

		return (
			<div className="container">
				<button className="button" onClick={this.toggleSidebar}>
					Toggle Sidebar
				</button>
				<SomeElement onMount={this.registerSidebarComponent} focusedElement={this.state.focusedElement} isSidebarOpen={isOpen} id="first" handleClick={this.handleClick}>
					Child #1
				</SomeElement>
				<SomeElement onMount={this.registerSidebarComponent} focusedElement={this.state.focusedElement} isSidebarOpen={isOpen} id="second" handleClick={this.handleClick}>
					Child #2
				</SomeElement>
				<SomeElement onMount={this.registerSidebarComponent} focusedElement={this.state.focusedElement} isSidebarOpen={isOpen} id="third" handleClick={this.handleClick}>
					Child #3
				</SomeElement>
				{
					isOpen &&
					<Sidebar elements={this.state.elements} focusedElement={this.state.focusedElement} />
				}
			</div>
		);
	}
}

export default Content;
