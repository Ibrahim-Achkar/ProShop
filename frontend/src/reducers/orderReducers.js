import * as constants from '../constants/productConstants';

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };
    case constants.ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };
    case constants.ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case constants.ORDER_CREATE_RESET: //this is part of the fix so that users don't see each others orders
      return {};
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} }, //loading set to true to avoid issues where it was trying to load the order before it went to true
  action
) => {
  switch (action.type) {
    case constants.ORDER_DETAILS_REQUEST:
      return {
        ...state, //this will keep us from getting errors when it loads
        loading: true,
      };
    case constants.ORDER_DETAILS_SUCCESS:
      return {
        loading: false,
        order: action.payload,
      };
    case constants.ORDER_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.ORDER_PAY_REQUEST:
      return {
        loading: true,
      };
    case constants.ORDER_PAY_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case constants.ORDER_PAY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case constants.ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};

export const orderDeliverReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.ORDER_DELIVER_REQUEST:
      return {
        loading: true,
      };
    case constants.ORDER_DELIVER_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case constants.ORDER_DELIVER_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case constants.ORDER_DELIVER_RESET:
      return {};
    default:
      return state;
  }
};

export const orderListMyReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case constants.ORDER_LIST_MY_REQUEST:
      return {
        loading: true,
      };
    case constants.ORDER_LIST_MY_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case constants.ORDER_LIST_MY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const orderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case constants.ORDER_LIST_REQUEST:
      return {
        loading: true,
      };
    case constants.ORDER_LIST_SUCCESS:
      return {
        loading: false,
        orders: action.payload,
      };
    case constants.ORDER_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
