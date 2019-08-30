import React, { Component } from "react";

class buildTest extends Component {
  render() {
    return (
      <div>
        hello stranger!!! 빌드 테스트 입니다. 이게 remote 에서 보이면 CI 의
        build 단계에서 build 한 것이 적용된 것이고, 그렇지 않다면 build를 또
        deploy 단계에서 수행한 후 이를 serve 해야 합니다.
      </div>
    );
  }
}

export default buildTest;
