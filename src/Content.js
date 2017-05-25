import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import './App.css';

class Sidebar extends Component {
	constructor(props) {
		super(props);

		this.items = [];
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.focusedElement === this.props.focusedElement) {
			return false;
		}
		return true;
	}

	componentDidUpdate(prevProps, prevState) {
		let focusedElement;
		let focusedIdx;

		// Find the focused index
		this.items.forEach((item, idx) => {
			if (item.state.isFocused) {
				focusedElement = item;
				focusedIdx = idx;
			}
		});

		if (focusedElement) {
			// Dirty hack, 1ms gets us the correct, current position of the focused node
			setTimeout(() => {
				let focusedNode = document.querySelector(`#${focusedElement.props.id}`);
				console.log(focusedNode);
				
				let prevBottom = 0;

				this.items.forEach((item, idx) => {
					const node = document.querySelector(`#${item.props.id}`);
				
					const style = item.props.style;

					if (idx > focusedIdx) {
						
						let newTop;

						if ((idx - 1) === focusedIdx) {
							const offsetDiff = node.offsetTop - focusedNode.offsetTop
							newTop = node.offsetTop + (focusedNode.offsetHeight - offsetDiff) + 10;
						} else {
							newTop = prevBottom;
						}
						prevBottom = newTop + node.offsetHeight + 10;

						style.top = `${newTop}px`;
					}
			
					item.setState({ style });
				});
			}, 1);
		}
	}

	render() {
		const elementsCount = this.props.elements.length;

		const processedElements = [];

		React.Children.forEach(this.props.elements, (element, idx) => {
			const props = {
				ref: (el) => this.items[idx] = el,
				style: {
					top: document.querySelector(`.${element.props.id}`).offsetTop,
					position: 'absolute',
				},
			}

			if (element.props.id === this.props.focusedElement) {
				props.isFocused = true;
			}

			// Position all elements if we have none OR this element is focused
			processedElements.push(React.cloneElement(element, props));
		});

		this.processedElements = processedElements;

		return (
			<div className="sidebar">
				{ processedElements }
			</div>
		);
	}
}

class SidebarElement extends Component {	
	constructor(props) {
		super(props);

		this.state = {
			isFocused: props.isFocused,
			style: props.style,
		};
	}

	componentWillReceiveProps(props) {		
		this.setState({ isFocused: props.isFocused });
	}

	render() {

		const className = `sidebar-element${this.state.isFocused ? ' focused' : ''}`;

		return (
			<div
				className={className}
				style={this.state.style}
				id={this.props.id}
				onClick={() => this.props.elementClicked(this.props.id)}
			>
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
	}

	onClick() {
		this.props.handleClick(this.props.id);
	}

	componentDidMount() {
		this.props.onMount(React.createElement(SidebarElement, {
			text: this.props.id,
			id: this.props.id,
			key: this.props.id,
			elementClicked: this.props.elementClicked,
		}));
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
		this.elementClicked = this.elementClicked.bind(this);
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

	elementClicked(id) {
		this.setState({ focusedElement: id });
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
				<SomeElement elementClicked={this.elementClicked} onMount={this.registerSidebarComponent} id="first" handleClick={this.handleClick}>
					Child #1
				</SomeElement>
				<br />
				<SomeElement elementClicked={this.elementClicked} onMount={this.registerSidebarComponent} id="second" handleClick={this.handleClick}>
					Child #2
				</SomeElement>
				<SomeElement elementClicked={this.elementClicked} onMount={this.registerSidebarComponent} id="third" handleClick={this.handleClick}>
					Child #3
				</SomeElement>
				<br/><br/><br/>
				<SomeElement elementClicked={this.elementClicked} onMount={this.registerSidebarComponent} id="fourth" handleClick={this.handleClick}>
					Child #4
				</SomeElement>
				<SomeElement elementClicked={this.elementClicked} onMount={this.registerSidebarComponent} id="fifth" handleClick={this.handleClick}>
					Child #5
				</SomeElement>
				<SomeElement elementClicked={this.elementClicked} onMount={this.registerSidebarComponent} id="sixth" handleClick={this.handleClick}>
					Child #6
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
