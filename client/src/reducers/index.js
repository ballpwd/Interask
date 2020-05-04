import { combineReducers } from "redux";
import ask from "./askReducer";
import room from "./roomReducer";
import orgAsk from "./orgAskReducer";
import orgRoom from "./orgRoomReducer";
import auth from './authReducer';

export default combineReducers({
  ask,
  room,
  orgAsk,
  orgRoom,
  auth
});