//var endPoint = "http://api.sizzlingspices.in/";
var endPoint = "http://localhost:9000/";
//var endPoint = "http://192.168.1.203:9000/";
//var endPoint = "https://api.thefreshlystore.com/";

var APIEndPoints = {
    captureUserDetails : endPoint + "write/v1/user/captureUserDetails",
    loginOrCreateUser : endPoint + "write/v1/user/loginOrCreateUser",
    getAllItems : endPoint + "read/v1/items/getAll",
    getHomePageDetails : endPoint + "read/v1/generic/getHomePageDetails",
    addOrUpdateCart : endPoint + "write/v1/cart/addOrUpdate",
    getMyOrders : endPoint + "read/v1/order/getMyOrders?count=@count&offset=@offset",
    getMyCart : endPoint + "read/v1/cart/getMyCart",
    getMyAddresses : endPoint + "read/v1/user/getMyAddresses",
    addAddress : endPoint + "write/v1/user/addAddress",
    deleteUserAddress : endPoint + "write/v1/user/deleteUserAddress",
    placeOrder : endPoint + "write/v1/order/placeOrder",
    editUserDetails : endPoint + "write/v1/user/editUserDetails",
    logout : endPoint + "write/v1/user/logout?token=",
    checkPromocode : endPoint + "read/v1/promocode/check?promocode=",
    editUserAddress : endPoint + "write/v1/user/editUserAddress",
    getTodaysReport : endPoint + "read/v1/admin/getTodaysReport",
    adminLogin : endPoint + "write/v1/admin/login",
    editItem : endPoint + "write/v1/items/edit",
    emailInvoice : endPoint + "read/v1/order/emailInvoice",
    getOrdersToDeliver : endPoint + "read/v1/deliveryAssociate/getOrdersToDeliver",
    deliveryAssociateLogin : endPoint + "write/v1/deliveryAssociate/login",
    updateOrderStatus : endPoint + "write/v1/deliveryAssociate/updateOrderStatus",
    adminUpdateOrderStatus : endPoint + "write/v1/admin/updateOrderStatus",
    imageupload : endPoint + "write/v1/imageupload/upload",
    addItem : endPoint + "write/v1/items/create",
    changePassword : endPoint + "write/v1/generic/changePassword"
}
