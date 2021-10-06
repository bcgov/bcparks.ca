import React, { Component } from 'react';

class Dropdown extends Component {
    constructor() {
        super()
        this.state = {
            visible: false
        }
    }
    toggleVisibility() {
        this.setState({
            visible: !this.state.visible
        })
    }

    render() {
        return (
            <div id={this.props.id}>
                <button id="indigenous-relations" class="indigenous-dropdown" onClick={this.toggleVisibility.bind(this)}>
                    <h3>{this.props.title}</h3>
                    {this.state.visible &&
                    <p> dummy content </p>
                    }
                </button>
            </div>
        )
    }

}

export default Dropdown;