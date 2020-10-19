import axios from 'axios';
import { 
    GET_ANSWERLIST,
    GET_ANSWER,
    ADD_ANSWER,
    ANSWER_ERROR,
    ANSWER_UNLOADED,
    ANSWERLIST_UNLOADED
} from './types';
import Swal from 'sweetalert2';


// //Get user answerlist
// export const getUserAnswerList = (questionId) => async dispatch => {
//     try {
//         const res = await axios.get(`/api/answer/${questionId}`)

//         dispatch({
//             type: GET_ANSWERLIST,
//             payload: res.data
//         });    
//     } catch (err) {
//         dispatch({
//             type: ANSWER_ERROR,
//             payload: err
//         });    
//     }
// };

//Get user answer
export const getUserAnswer = (questionId) => async dispatch => {
    try {
        const res = await axios.get(`/api/answer/user/${questionId}`)

        dispatch({
            type: GET_ANSWER,
            payload: res.data
        });    
    } catch (err) {
        dispatch({
            type: ANSWER_ERROR,
            payload: err
        });    
    }
};

// Add answer
export const addAnswer = formData => async dispatch => {
    try {
        const res = await axios.post(`/api/answer`, formData);
        dispatch({
          type: ADD_ANSWER,
          payload: res.data
        });

        Swal.fire({
            title:'Answer Send!',
            icon:'success'
        })
    } catch (err) {
        const errorMessage = err.response.data.msg ;

        if (errorMessage) {
            Swal.fire({
              title: `${errorMessage} !`,
              icon:'error'
            })
          }
        dispatch({
            type: ANSWER_ERROR,
            payload: err
        });    
    }
};

//answer Unload
export const answerUnload = () => async dispatch => {
    try {
        dispatch({type: ANSWER_UNLOADED});
    } catch (err) {
        dispatch({
            type: ANSWER_ERROR,
            payload: err
        });    
    }
};

//answerList Unload
export const answerListUnload = () => async dispatch => {
    try {
        dispatch({type: ANSWERLIST_UNLOADED});
    } catch (err) {
        dispatch({
            type: ANSWER_ERROR,
            payload: err
        });    
    }
};