import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Select extends Component {
    render() {
        return (
            <div>
                <Link to='/'>데이터 요청자 로그인</Link>
                <Link to='/auth/signin'>데이터 생산자 로그인</Link>
            </div>
        );
    }
}

export default Select;