import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import {
  getRoomByOwnerId,
  orgRoomListUnload,
} from "../../actions/orgRoomActions";
import OrganizerRoomList from "./OrganizerRoomList";
import { Container, Row, Button } from "reactstrap";
const OrganizerRoom = (props) => {
  //mockup user
  const user = {
    _id: "5e85403922192a21e87fbbaa",
    email: "ballpwd5@gmail.com",
    userName: "ballpwd5",
  };

  const {
    getRoomByOwnerId,
    orgRoomListUnload,
    orgRoom: { roomList, loading },
  } = props;

  useEffect(() => {
    getRoomByOwnerId(user._id);
    return () => {
      orgRoomListUnload();
    };
  }, [getRoomByOwnerId, user._id, orgRoomListUnload]);

  console.log(roomList);

  return loading ? (
    <h1>Loading</h1>
  ) : (
    <Fragment>
        <Container fluid>
          <h1 className="org-h1 text-center">Hi "{user.userName}"</h1>
          <p className="text-danger text-center">
            {" "}
            Mockup Organizer Room for User ballpwd5{" "}
          </p>
        </Container>
        <Container>
          <Row>
            <div>{<OrganizerRoomList roomList={roomList} />}</div>
          </Row>
          <Row className="justify-content-center mt-5">
            <Button to="/" className="btn btn-dark org-btn">
                MANAGE ROOM
            </Button>
          </Row>
        </Container>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  orgRoom: state.orgRoom,
});

export default connect(mapStateToProps, {
  getRoomByOwnerId,
  orgRoomListUnload,
})(OrganizerRoom);