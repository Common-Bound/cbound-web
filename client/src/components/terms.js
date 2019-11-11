import React, { Component } from "react";
import styled from "styled-components";
import Header from "./main/Header";
//import background from "../images/BackGround.webp";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
  overflow: scroll;
`;

const MainContainer = styled.div`
  position: relative;
  top: 64px;
  color: #ffffff

  background-image: url("https://task-data-bucket.s3.ap-northeast-2.amazonaws.com/BackGround.webp");
  background-repeat: no-repeat;
  width: 100%;

  background-size: 100% 100%;
  background-position: center;

  @media (max-width: 500px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

class terms extends Component {
  render() {
    return (
      <Container>
        <Header page="main" />
        <MainContainer>
          <br></br>
          <br></br>
          <strong>1. 개인정보의 처리 목적</strong> DAL(‘C-bound.io’이하
          ‘커먼바운드’) 은(는) 다음의 목적을 위하여 개인정보를 처리하고 있으며,
          다음의 목적 이외의 용도로는 이용하지 않습니다.<br></br> - 고객
          가입의사 확인, 고객에 대한 서비스 제공에 따른 본인 식별.인증, 회원자격
          유지.관리, 물품 또는 서비스 공급에 따른 금액 결제, 물품 또는 서비스의
          공급.배송 등<br></br>
          <br></br>
          <br></br>
          <strong>2. 개인정보의 처리 및 보유 기간</strong>
          <br></br>
          <br></br>① DAL(‘C-bound.io’이하 ‘커먼바운드’) 은(는) 정보주체로부터
          개인정보를 수집할 때 동의 받은 개인정보 보유․이용기간 또는 법령에 따른
          개인정보 보유․이용기간 내에서 개인정보를 처리․보유합니다.<br></br>
          <br></br>② 구체적인 개인정보 처리 및 보유 기간은 다음과 같습니다.
          <br></br>☞ 아래 예시를 참고하여 개인정보 처리업무와 개인정보
          처리업무에 대한 보유기간 및 관련 법령, 근거 등을 기재합니다.<br></br>
          (예시)- 고객 가입 및 관리 : 서비스 이용계약 또는 회원가입 해지시까지,
          다만 채권․채무관계 잔존시에는 해당 채권․채무관계 정산시까지<br></br>-
          전자상거래에서의 계약․청약철회, 대금결제, 재화 등 공급기록 : 5년{" "}
          <br></br>
          <br></br>
          <br></br>
          <strong>
            3. 정보주체와 법정대리인의 권리·의무 및 그 행사방법 이용자는
            개인정보주체로써 다음과 같은 권리를 행사할 수 있습니다.
          </strong>
          ① 정보주체는 DAL(‘C-bound.io’이하 ‘커먼바운드) 에 대해 언제든지 다음
          각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.<br></br>1.
          개인정보 열람요구<br></br> 2. 오류 등이 있을 경우 정정 요구<br></br>{" "}
          3. 삭제요구<br></br> 4. 처리정지 요구<br></br>
          <br></br>
          <strong>4. 처리하는 개인정보의 항목 작성 </strong>
          <br></br>
          <br></br> ①{" "}
          <em class="emphasis">DAL('C-bound.io'이하 '커먼바운드')</em>은(는)
          다음의 개인정보 항목을 처리하고 있습니다.1(개인정보 처리업무)<br></br>
          - 필수항목 : 이메일, 비밀번호, 성별, 생년월일, 이름, 서비스 이용 기록,
          접속 로그, 결제기록<br></br>- 선택항목 : <br></br>
          <br></br>
          <br></br>
          <strong>
            5. 개인정보의 파기<em class="emphasis">DAL('커먼바운드')</em>은(는)
            원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당
            개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다.
          </strong>
          -파기절차<br></br>이용자가 입력한 정보는 목적 달성 후 별도의 DB에
          옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라
          일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는
          법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.
          <br></br>
          <br></br>-파기기한<br></br>이용자의 개인정보는 개인정보의 보유기간이
          경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리
          목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게
          되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일
          이내에 그 개인정보를 파기합니다.<br></br>
          <br></br>
          <strong>
            6. 개인정보 자동 수집 장치의 설치•운영 및 거부에 관한 사항
          </strong>
          ① DAL 은 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고
          수시로 불러오는 ‘쿠기(cookie)’를 사용합니다. ② 쿠키는 웹사이트를
          운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는
          소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도
          합니다. 가. 쿠키의 사용 목적 : 이용자가 방문한 각 서비스와 웹
          사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을
          파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다. 나. 쿠키의
          설치•운영 및 거부 : 웹브라우저 상단의 도구>인터넷 옵션>개인정보 메뉴의
          옵션 설정을 통해 쿠키 저장을 거부 할 수 있습니다. 다. 쿠키 저장을
          거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.<br></br>
          <br></br>
          <strong>7. 개인정보 보호책임자 작성 </strong>
          <br></br>
          <br></br> ① DAL(‘C-bound.io’이하 ‘커먼바운드) 은(는) 개인정보 처리에
          관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
          불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를
          지정하고 있습니다.<br></br>
          <br></br>▶ 개인정보 보호책임자 <br></br>
          <br></br>성명 :김은수<br></br>
          <br></br>직책 :CEO<br></br>
          <br></br>직급 :CEO<br></br>
          <br></br>연락처 :010-2266-2975, eunsu.dev@gmail.com, <br></br>
          <br></br>※ 개인정보 보호 담당부서로 연결됩니다.<br></br>
          <br></br> <br></br>
          <br></br>▶ 개인정보 보호 담당부서<br></br>
          <br></br>부서명 :개발팀<br></br>
          <br></br>담당자 :김은수<br></br>
          <br></br>연락처 :010-2266-2975, eunsu.dev@gmail.com, <br></br>
          <br></br>② 정보주체께서는 DAL(‘C-bound.io’이하 ‘커먼바운드) 의
          서비스(또는 사업)을 이용하시면서 발생한 모든 개인정보 보호 관련 문의,
          불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로
          문의하실 수 있습니다. DAL(‘C-bound.io’이하 ‘커먼바운드) 은(는)
          정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.<br></br>
          <br></br>
          <strong>8. 개인정보 처리방침 변경 </strong>①이 개인정보처리방침은
          시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및
          정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여
          고지할 것입니다.<br></br>
          <br></br>
          <strong>
            9. 개인정보의 안전성 확보 조치{" "}
            <em class="emphasis">DAL('커먼바운드')</em>은(는) 개인정보보호법
            제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및
            물리적 조치를 하고 있습니다.
          </strong>
          1. 정기적인 자체 감사 실시<br></br> 개인정보 취급 관련 안정성 확보를
          위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.<br></br>
          <br></br>{" "}
        </MainContainer>
      </Container>
    );
  }
}

export default terms;
