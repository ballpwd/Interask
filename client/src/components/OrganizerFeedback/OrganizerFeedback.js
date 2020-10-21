import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { getOrgRoomById, orgRoomUnload } from "../../actions/orgRoomActions";
import {
  getOrgFeedbackList,
  orgFeedbackListUnload,
} from "../../actions/orgFeedbackActions";
import OrganizerFeedbackList from "./OrganizerFeedbackList";
import OrganizerFeedbackAnalyze from "./OrganizerFeedbackAnalyze";
import Loading from "../Loading/Loading";
import { Container, Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem  } from "reactstrap";
import apiUrl from '../../utils/apiUrl' 
//socket
import io from "socket.io-client";
//Export
import { exportFeedback } from "../../utils/export";

const OrganizerFeedback = (props) => {
  const {
    getOrgRoomById,
    orgRoomUnload,
    getOrgFeedbackList,
    orgFeedbackListUnload,
    orgRoom: { room, roomLoading },
    orgFeedback: { feedbackList, feedbackLoading },
    match,
  } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  const [filterDate,setFilterDate] = useState([]);
  const [dropdownDate,setDropdownDate] = useState('All');

  useEffect(() => {
    getOrgRoomById(match.params.roomid);
    return () => {
      orgRoomUnload();
    };
  }, [getOrgRoomById, match.params.roomid, orgRoomUnload]);

  useEffect(() => {
    let socket = io.connect(apiUrl);

    socket.emit("room", match.params.roomid);

    socket.on("organizerFeedback", (data) => {
      if (data.status === 200) {
        getOrgFeedbackList(match.params.roomid);
      }
    });

    getOrgFeedbackList(match.params.roomid);

    return () => {
      orgFeedbackListUnload();
      socket.disconnect();
    };
  }, [getOrgFeedbackList, match.params.roomid, orgFeedbackListUnload]);

  const groups = feedbackList.reduce((groups, feedback) => {
    const date = feedback.date.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(feedback);
    return groups;
  }, {});

  // Edit: to add it in the array format instead
  const groupArrays = Object.keys(groups).map((date) => {
    return {
      date,
      feedbackList: groups[date]
    };
  });

  useEffect(() => {
    let filtered = feedbackList ;
    
    if(dropdownDate !== "All"){
        filtered = filtered.filter(item => {
        return item.date.split('T')[0] === dropdownDate 
      })
    }

    console.log(dropdownDate)
    console.log(filtered)
    setFilterDate(filtered)

  }, [dropdownDate,feedbackList]);

  return roomLoading || feedbackLoading ? (
    <Loading></Loading>
  ) : (
    <Fragment>
      <div className="fullscreen bg">
        <Container fluid>
          <h1 className="org-h1 text-center org-section">Feedback</h1>
        </Container>
        <Container fluid>
          <Row className="justify-content-center align-items-center">
            <Col md="5" xs="12" className="mt-4">
              <Row>
                <Col>
                  <h5 className="org-h5">
                    ROOM: {room.roomName}
                    <br />
                    PIN: {room.code}
                  </h5>
                </Col>
                <Col className="text-right" style={{marginTop: "15px"}}>
                  <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle caret>
                     Filter date : {dropdownDate}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setDropdownDate('All')}>All</DropdownItem>
                        {groupArrays.map((data)=>{
                          return <DropdownItem onClick={() => setDropdownDate(data.date)}>{data.date}</DropdownItem>
                        })}
                  </DropdownMenu>
                  </Dropdown>
                </Col> 
              </Row>
              <Row >
                <Col>
                  {<OrganizerFeedbackList feedbackList={filterDate} />}
                </Col> 
              </Row>
            </Col>
            <Col md="5" xs="12" className="mt-4">
              {<OrganizerFeedbackAnalyze feedbackList={filterDate} />}
              <Row>
                <Col md="12" xs="12" className="text-center mt-5">
                  <Button
                    className="org-btn"
                    onClick={() => exportFeedback(filterDate)}
                    style={{
                      backgroundColor: "#FF8BA7",
                      borderColor: "#121629",
                      borderWidth: "2px",
                      color: "#232946",
                    }}
                  >
                    Export
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  orgRoom: state.orgRoom,
  orgFeedback: state.orgFeedback,
});

export default connect(mapStateToProps, {
  getOrgRoomById,
  getOrgFeedbackList,
  orgRoomUnload,
  orgFeedbackListUnload,
})(OrganizerFeedback);
