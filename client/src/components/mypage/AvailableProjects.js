import React, { Component } from "react";
import Project_orig from '../card/Project_orig';

class AvailableProjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      session: "",
      projects: []
    };
  }

  /**
   * @dev /mypage 라우트로 요청을 보냈을 때, 세션이 존재한다면
   *      참여 가능한 프로젝트 목록을 가져온다. 그러나 세션이 존재하지
   *      않는다면 false 를 반환한다
   */
  async componentDidMount() {
    await this.fetchProject();
  }

  async fetchProject() {
    const url = this.props.match.path;
    const result = await fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.message) {
          return alert(data.message);
        }
        this.setState({ session: data.result, loading: false });
        return new Promise(resolve => {
          resolve(data.result);
        });
      })
      .catch(err => {
        console.log(err);
      });

    // 만약 result가 false가 아니라면 프로젝트 목록이다
    if (result) {
      const my_proj = result.map(el => {
        return (
          <Project_orig
            key={el.id}
            id={el.id}
            title={el.title}
            simple_description={el.simple_description}
            detail_description={el.detail_description}
            due_date={el.due_date}
            created_at={el.created_at}
            type={el.type}
            guideline_url={el.guideline_url}
            reward={el.reward}
          />
        );
      });
      this.setState({
        projects: my_proj
      });
    }
  }

  /**
 * @description 랜덤 프로젝트 추가 버튼 클릭시 랜덤한 프로젝트를 생성하고 
 *              프로젝트 목록을 다시 불러온다
 */
  handleClick = e => {
    const url = this.props.match.path;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.fetchProject();
      });
  };

  render() {
    return (
      <div>
        <ul>{this.state.projects}</ul>
        <button onClick={this.handleClick.bind(this)}>랜덤 프로젝트 추가</button>
      </div>
    );
  }
}

export default AvailableProjects;
