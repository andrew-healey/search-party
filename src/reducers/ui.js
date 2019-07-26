import reducerFromObject from "./reducerFromObject.js";
let initalState = {
    sidebar: false,
    name: "",
    page: "landing",
    modal: {
        create: false,
        scan_qr: false,
        share_code: false,
        person_info: false,
    }
};
let a = reducerFromObject({
    SET_SIDEBAR: (action, state) => ({
        ...state,
        sidebar: action.value,
    }),
    SET_NAME: (action, state) => ({
        ...state,
        name: action.value,
    }),
    SET_MODAL: (action, state) => ({
        ...state,
        modal: {
            ...state.modal,
            [action.modal]: action.value,
        }
    }),
    SET_PAGE: ({page}, state) => ({
        ...state,
        page,
    })
}, initalState);
console.log(a);
export default a;