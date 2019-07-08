import React, { Component } from 'react';

class FetchTest extends Component {
    state = {
        loading: true,
        person: null
    };

    async componentDidMount() {
        const url = "https://api.randomuser.me/";
        const response = await fetch(url);
        const data = await response.json();
        this.setState({ person: data.results[0], loading: false });
    }

    render() {
        
        if (this.state.loading) {
            return <div>로딩 중...</div>;
        }

        if (!this.state.person) {
            return <div>사람 못 불러옴</div>;
        }
        return (
            <div>
                <div>{this.state.person.name.title}</div>
                <div>{this.state.person.name.first}</div>
                <div>{this.state.person.name.last}</div>
                <img src={this.state.person.picture.large} />
            </div>
        );
    }
}

export default FetchTest;