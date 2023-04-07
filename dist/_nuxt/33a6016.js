(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{1153:function(e,t,n){"use strict";n.r(t);n(15),n(10),n(13),n(7),n(14),n(22);var o=n(1),r=n(4),c=n(3),l=n(137),d=n(19),m=(n(351),function(e){var t=new RegExp("^3[47][0-9]{13}$"),n=new RegExp("^4[0-9]{12}(?:[0-9]{3})?$"),o=new RegExp("^62[0-9]{14}[0-9]*$"),r=new RegExp("^81[0-9]{14}[0-9]*$"),c=new RegExp("^5[1-5][0-9]{14}$"),l=new RegExp("^2[2-7][0-9]{14}$"),d=new RegExp("^6011[0-9]{12}[0-9]*$"),m=new RegExp("^62[24568][0-9]{13}[0-9]*$"),h=new RegExp("^6[45][0-9]{14}[0-9]*$"),v=new RegExp("^3[0689][0-9]{12}[0-9]*$"),y=new RegExp("^35[0-9]{14}[0-9]*$");return n.test(e)?"visa":t.test(e)?"amex":c.test(e)||l.test(e)?"mastercard":d.test(e)||m.test(e)||h.test(e)?"discover":v.test(e)?"diners":y.test(e)?"jcb":o.test(e)||r.test(e)?"china_union_pay":void 0}),h=n(17);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function y(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var f=r.default.extend({name:"PaymentDetailPayment",props:{isAuthened:Boolean},data:function(){return{isReservations:!1,isFixed:!1,miles:0,cardInfo:{}}},computed:y(y(y({},Object(c.e)({guestData:function(e){return e.guestDetail.guest},bookingData:function(e){return e.booking.bookingData},isLoading:function(e){return e.booking.paymentState.isLoading},cardToken:function(e){return e.paymentDetail.paymentState.token},paymentMethodSelected:function(e){return e.paymentDetail.paymentMethodSelected},isFormValidated:function(e){return e.paymentDetail.isFormValidated},hotelId:function(e){return e.hotel.data.hotelID},reservationData:function(e){return e.booking.reservationData},isUpdateBooking:function(e){return e.hotelDetail.isUpdateBooking},isUpdateLoading:function(e){return e.booking.isUpdateLoading},reservationError:function(e){return e.booking.reservationError},roomSelectedFromAPI:function(e){return e.hotelDetail.roomSelectedFromAPI}})),Object(c.d)({numberAdults:"booking/numberAdults",numberChildren:"booking/numberChildren",roomData:"booking/roomData",isBillingInformationValidated:"paymentDetail/isBillingInformationValidated",roomSelectedParams:"booking/roomSelectedParams",totalPriceWithoutTax:"hotelDetail/totalPriceWithoutTax",numberAdultsInRoomSelected:"booking/numberAdultsInRoomSelected",numberChildrenInRoomSelected:"booking/numberChildrenInRoomSelected",promoCodeFromAPI:"hotelDetail/promoCodeFromAPI",roomDetails:"hotelDetail/roomDetails",points:"users/points",hotelDetailV2:"hotelDetail/hotelDetailV2",hotelSelected:"hotel/hotelSelected",lang:"appHeader/language",users:"users/userData",additionalParams:"guestDetail/additionalParams",guest:"guestDetail/guest",isReceiveSubscription:"guestDetail/isReceiveSubscription"})),{},{getLang:function(){return{questions:this.$t("payment_detail.questions"),call:this.$t("payment_detail.call"),checkout:this.$t("payment_info.checkout"),holdReservation:this.$t("payment_detail.hold_reservation")}},paymentType:function(){var e,t,n=m(null===(e=this.cardInfo)||void 0===e?void 0:e.cardno);switch(this.paymentMethodSelected){case"credit_card":return{type:"credit_card",card_token:this.cardToken.token,save_card:!0};case"on_site_credit_card_required":return{type:"on_site_credit_card_required",card_token:this.cardToken.token,card_holder:(null===(t=this.cardInfo)||void 0===t?void 0:t.holdername)||"",card_type:n,card_sequence:null,save_card:!0};case"on_site":return{type:"on_site"}}return{}},getParamsReservations:function(){return{hotelId:this.hotelId,brand:d.e,category:this.hotelSelected.prefecture,lang:this.$langFormat(this.lang),queryParam:{adults:this.numberAdults,children:this.numberChildren,checkin_date:this.bookingData.checkIn,checkout_date:this.bookingData.checkOut,guest:this.guestData[0],payment:this.paymentType,rooms:this.roomData,spending_point:this.miles,extra_items:[],additional_questions:this.additionalParams,coupon_code:this.bookingData.promoCode}}},getParamsUpdateBooking:function(){return{hotelID:this.hotelId,reservationID:this.reservationData.reservation_number,email:this.reservationData.email,byPassToken:this.reservationData.bypass_token,body:y({},this.getParamsReservations.queryParam)}},reservationsError:function(){var e;return null===(e=this.reservationError)||void 0===e?void 0:e.error},buildParams:function(){return{hotelID:this.hotelId,queryString:{checkin_date:this.bookingData.checkIn,checkout_date:this.bookingData.checkOut,children:this.numberChildrenInRoomSelected,mode:"standard",adults:this.numberAdultsInRoomSelected,total_price_without_tax:this.totalPriceWithoutTax,rooms:this.roomSelectedParams,coupon_code:this.promotionCode,spending_point:this.miles}}},buttonDisableCondition:function(){return!!(this.isLoading&&this.isUpdateLoading||!this.paymentMethodSelected)}}),watch:{cardToken:{handler:function(e){var t=this;e&&(this.isUpdateBooking?this.updateReservations(this.getParamsUpdateBooking):this.createReservations(this.getParamsReservations).then((function(){t.receiveSubscription()})))},deep:!0},reservationData:{handler:function(e){if(e.reservation_number&&this.isReservations){this.clearRoomSelected();var q={email:Object(l.b)(e.guest.email),bypass_token:e.bypass_token,hotel_id:this.hotelId};this.$router.push({path:"confirm-booking/".concat(e.reservation_number),query:q}),this.$gtm.push({triggerType:"Page Load",locale:this.$langFormat(this.lang),pageCategory:"ConfirmStayPage"})}},deep:!0},users:function(e){e&&this.paymentDetailGtm()},reservationError:function(e){}},mounted:function(){this.getDataPayment(""),this.paymentDetailGtm(),window.addEventListener("scroll",this.$_onScroll),this.$nuxt.$on("on:sendCardInfo",this.saveCardInfo)},beforeDestroy:function(){this.$store.commit("booking/".concat(h.BookingActionTypes.CREATE_RESERVATIONS_FAIL),null),window.removeEventListener("scroll",this.$_onScroll),this.$nuxt.$off("on:sendCardInfo",this.saveCardInfo)},methods:y(y({},Object(c.c)({triggerPayment:"paymentDetail/triggerPayment",createReservations:"booking/createReservations",getDataPayment:"paymentDetail/getDataPayment",updateReservations:"booking/updateReservations",clearRoomSelected:"hotelDetail/clearRoomSelected",getRoomSelected:"hotelDetail/getRoomSelected"})),{},{saveCardInfo:function(e){this.cardInfo=e},$_handlePayment:function(){var e=this;this.isReservations=!0,"credit_card"===this.paymentMethodSelected||"on_site_credit_card_required"===this.paymentMethodSelected?this.triggerPayment():this.isUpdateBooking?this.updateReservations(this.getParamsUpdateBooking):this.createReservations(this.getParamsReservations).then((function(){e.receiveSubscription()}))},receiveSubscription:function(){var e,t;this.isReceiveSubscription&&this.$api.$post("/api/Mystays/Booking/savesubscribedata",{firstname:this.guest.first_name||"",lastname:this.guest.last_name||"",email:this.guest.email||"",subscribe:!0,language:this.$i18n.locale,brand:(null===(e=this.hotelSelected)||void 0===e?void 0:e.brand)||"",prefecture:(null===(t=this.hotelSelected)||void 0===t?void 0:t.prefecture)||"",hotelId:this.hotelId})},paymentDetailGtm:function(){var e,t,n,o=this,r=this.roomSelectedFromAPI&&(null===(e=this.roomSelectedFromAPI)||void 0===e||null===(t=e.rooms)||void 0===t?void 0:t.map((function(e){return{brand:d.e,category:o.hotelSelected.prefecture,checkInDate:o.roomSelectedFromAPI.checkin_date,checkOutDate:o.roomSelectedFromAPI.checkout_date,coupon:o.bookingData.promoCode,id:o.hotelId,name:o.hotelId,numberOfAdult:e.adults,numberOfChildren:e.children,numberOfRooms:o.roomSelectedFromAPI.rooms.length,numberOfDaysToCheckIn:o.roomSelectedFromAPI.number_of_days_to_checkin,price:e.total_price,quantity:o.roomSelectedFromAPI.nights,roomId:e.room_type_code,roomName:e.room_type_name,roomSize:e.room_size.value,roomType:e.room_type_name,planId:e.room_plan_code,planName:e.room_plan_name}}))),c=y(y({triggerType:"Page Load"},this.isPageLoaded&&{event:"virtualPageview"}),{},{eeAction:"eeCheckout",checkoutStep:"2",userId:(null===(n=this.users)||void 0===n?void 0:n.id)||"",pageCategory:this.$route.name,products:r});this.$gtm.push(c)},$_onScroll:function(){var e=document.querySelector(".payment-total");window.pageYOffset+window.innerHeight>=e.offsetTop+e.getBoundingClientRect().height+102?this.isFixed=!0:this.isFixed=!1},onReceiveMiles:function(e){this.miles=e,this.getRoomSelected(this.buildParams)}})}),_=(n(999),n(5)),component=Object(_.a)(f,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"payment-detail__payment"},[n("div",{staticClass:"payment-detail__payment call-out"},[n("p",{staticClass:"is-bold mb-1"},[e._v("\n      "+e._s(e.getLang.questions)+"\n    ")]),e._v(" "),n("div",{staticClass:"call-out__tel"},[n("a",{attrs:{href:"tel:"+e.hotelDetailV2.phone}},[n("span",{staticClass:"icon-Icon-Phone"}),e._v("\n        "+e._s(e.getLang.call)+" "+e._s(e.hotelDetailV2.phone)+"\n      ")])])]),e._v(" "),n("GuestDetailPaymentInfo"),e._v(" "),n("div",{staticClass:"payment-detail__payment login"},[n("TotalPrcie")],1),e._v(" "),n("div",{staticClass:"payment-detail__payment__button",class:{"is-fixed":e.isFixed}},[n("b-button",{staticClass:"button m-btn m-btn__yellow",attrs:{disabled:e.buttonDisableCondition},on:{click:e.$_handlePayment}},[e.isLoading||e.isUpdateLoading?n("b-spinner",{staticClass:"mr-2",attrs:{small:""}}):e._e(),e._v("\n      "+e._s(e.isUpdateBooking?"Confirm Updates":e.getLang.checkout)+"\n    ")],1)],1),e._v(" "),n("MyStayPopup",{ref:"reservationsError",attrs:{"modal-class":"reservations-error",size:"lg",centered:!0,"is-close-icon":!0}},[n("div",{staticClass:"reservations-error-content"},[n("span",{staticClass:"icon-Icon-Info mr-2 font-weight-bold"}),e._v(" "),n("span",[e._v(e._s(e.reservationsError))])])])],1)}),[],!1,null,"9854ae2a",null);t.default=component.exports;installComponents(component,{GuestDetailPaymentInfo:n(509).default,TotalPrcie:n(500).default,MyStayPopup:n(350).default})},1154:function(e,t,n){"use strict";n.r(t);n(15),n(10),n(13),n(7),n(14),n(22);var o=n(1),r=n(3),c=n(996),l=n(29);n(35),n(410);function d(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function m(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var h={name:"PayOnlineBilling",directives:{mask:c.mask},data:function(){return{isPopupOpen:!1,currentBillingIsSameStatus:["billing-is-same"],savePaymentStatus:["save-payment"],expirationDate:["2000"],expirationMonth:["2000"],error:""}},validations:{payOnlineData:{$each:{cardNumber:{value:l.k},nameOnCard:{value:l.k},SecurityCode:{value:l.k},Expiration:{year:l.k,month:l.k}}}},computed:m(m(m({},Object(r.e)({reservationError:function(e){return e.booking.reservationError}})),Object(r.d)({isMonthYearSelected:"paymentDetail/isMonthYearSelected",isPaymentTriggered:"paymentDetail/isPaymentTriggered",paymentMethodItem:"paymentDetail/paymentMethodItem"})),{},{getLang:function(){return{billingDetails:this.$t("payment_info.billing_details"),what:this.$t("payment_info.what_is_cvv"),whatx:this.$t("payment_info.what_is_cvv_text"),billingSame:this.$t("payment_info.billing_same"),save:this.$t("payment_info.save_payment"),card_number:this.$t("forms.card_number"),card_name:this.$t("forms.card_name"),card_security:this.$t("forms.card_security"),card_expired_date:this.$t("forms.card_expired_date")}},isFormInValid:function(){return this.$v.$invalid},payOnlineData:function(){return[{cardNumber:{name:"cardNumber",icon:"",value:"",type:"text",label:this.getLang.card_number},nameOnCard:{name:"nameOnCard",value:"",type:"text",icon:"",label:this.getLang.card_name},Expiration:{year:"",month:""},SecurityCode:{name:"SecurityCode",value:"",type:"text",icon:"",label:this.getLang.card_security},savePayment:!0,paymentId:0}]}}),watch:{isFormInValid:function(e){this.setValidForm(!e)},isFormVadatedChange:function(){this.ceFormSelectedStatus({isFormValidated:!0})},isPaymentTriggered:function(e){this.$v.$touch(),this.isFormInValid||this.doPurchase()}},mounted:function(){this.handelExpirationDate(),this.handelExpirationMonth(),this.payOnlineData[0].Expiration.year=this.expirationDate[0].value,this.payOnlineData[0].Expiration.month=this.expirationMonth[0].value},methods:m(m({},Object(r.c)({setValidForm:"paymentDetail/setValidForm",getDataPayment:"paymentDetail/getDataPayment"})),{},{$_addCard:function(){this.payOnlineData.push({cardNumber:{name:"cardNumber",icon:"",value:"",type:"text",label:"Card Number"},nameOnCard:{name:"nameOnCard",label:"Name on Card",value:"",type:"text",icon:""},Expiration:{name:"Expiration",label:"Expiration Date",value:"",type:"text",icon:""},SecurityCode:{name:"SecurityCode",label:"SecurityCode/CVV",value:"",type:"text",icon:""},savePayment:!0,paymentId:this.payOnlineData[this.payOnlineData.length-1].paymentId+1})},$_removeCard:function(e){this.payOnlineData.splice(e,1)},input:function(e){var t=e.value,n=e.name;this.payOnlineData[0][n].value=t,this.$v.payOnlineData.$each[0][n].$touch()},$_onChangeYear:function(e){this.payOnlineData[0].Expiration.year=e},$_onChangeMonth:function(e){this.payOnlineData[0].Expiration.month=e},$_savePayment:function(e){this.payOnlineData[0].savePayment=e},handelExpirationDate:function(){for(var e=[],t=(new Date).getFullYear(),n=0,o=0;o<=15;o++){var r=t+n;n++,e.push(r)}return this.expirationDate=e},handelExpirationMonth:function(){for(var e=[],t=1;t<=12;t++){var n=t<10?"0".concat(t):t;e.push(n)}return this.expirationMonth=e},doPurchase:function(){var e=this,t=this.payOnlineData[0].cardNumber.value,n="".concat(this.payOnlineData[0].Expiration.year).concat(this.payOnlineData[0].Expiration.month),o=this.payOnlineData[0].SecurityCode.value,r=this.payOnlineData[0].nameOnCard.value,c=t.replaceAll(" ",""),l={cardno:c&&c.trim(),expire:n&&n.trim(),securitycode:o&&o.trim(),holdername:r&&r.trim()};this.$nuxt.$emit("on:sendCardInfo",l),Multipayment.init("9101254145541"),Multipayment.getToken(l,(function(t){if("000"===t.resultCode)e.error="",e.getDataPayment(t.tokenObject);else{var n=e.$t("error.".concat(t.resultCode));e.error=n}}))}}),head:function(){return{script:[{src:"https://static.mul-pay.jp/ext/js/token.js"}]}}},v=(n(997),n(5)),component=Object(v.a)(h,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"pay-online"},[n("h4",[e._v(e._s(e.getLang.billingDetails))]),e._v(" "),e.paymentMethodItem?n("div",{staticClass:"pay-online__name"},[e._v("\n    "+e._s(e.paymentMethodItem.name)+"\n  ")]):e._e(),e._v(" "),n("div",{staticClass:"pay-online__billing billing-card"},[n("div",{staticClass:"billing-card__header"},[n("div",{staticClass:"billing-card__header__text"},[e._v("\n        "+e._s(e.getLang.billingSame)+"\n      ")])]),e._v(" "),e._l(e.payOnlineData,(function(t,o){return n("div",{key:o,staticClass:"billing-card__content"},[o>0?n("div",{staticClass:"billing-card__content__remove"},[n("div",[e._v("Add a card")]),e._v(" "),n("div",{on:{click:function(t){return e.$_removeCard(o)}}},[e._v("\n          removeCard\n        ")])]):e._e(),e._v(" "),n("div",{staticClass:"billing-card__content-row"},[n("div",{staticClass:"billing-card__content-card-number"},[n("InputCustom",{directives:[{name:"mask",rawName:"v-mask",value:["#### #### #### ####"],expression:"['#### #### #### ####']"}],attrs:{label:t.cardNumber.label,icon:t.cardNumber.icon,type:t.cardNumber.type,value:t.cardNumber.value,"input-name":t.cardNumber.name,validations:e.$v.payOnlineData.$each[o].cardNumber.value},on:{input:e.input}}),e._v(" "),n("div",{staticClass:"billing-card__birth-day"},[n("SelectCustom",{attrs:{data:e.expirationDate,"label-text":e.getLang.card_expired_date,"default-selected-props":"",validations:e.$v.payOnlineData.$each[o].Expiration.year},on:{input:e.$_onChangeYear}}),e._v(" "),n("SelectCustom",{attrs:{data:e.expirationMonth,"default-selected-props":"",validations:e.$v.payOnlineData.$each[o].Expiration.month},on:{input:e.$_onChangeMonth}})],1)],1),e._v(" "),n("div",{staticClass:"billing-card__content-card-name"},[n("InputCustom",{attrs:{label:t.nameOnCard.label,icon:t.nameOnCard.icon,type:t.nameOnCard.type,value:t.nameOnCard.value,"input-name":t.nameOnCard.name,validations:e.$v.payOnlineData.$each[o].nameOnCard.value},on:{input:e.input}}),e._v(" "),n("div",{staticClass:"securityCode"},[n("InputCustom",{directives:[{name:"mask",rawName:"v-mask",value:["##########"],expression:"['##########']"}],attrs:{label:t.SecurityCode.label,icon:t.SecurityCode.icon,type:t.SecurityCode.type,value:t.SecurityCode.value,"input-name":t.SecurityCode.name,validations:e.$v.payOnlineData.$each[o].SecurityCode.value},on:{input:e.input}}),e._v(" "),n("div",{staticClass:"securityCode__popup"},[n("span",{staticClass:"icon-Icon-Credit-Card"}),e._v(" "),n("p",[e._v(e._s(e.getLang.what))])])],1)],1)])])})),e._v(" "),e.error?n("div",{staticClass:"billing-card__header"},[n("div",{staticClass:"add-card"},[e._v("\n        "+e._s(e.error)+"\n      ")])]):e._e(),e._v(" "),e.reservationError&&!e.error?n("div",{staticClass:"billing-card__header"},[n("div",{staticClass:"add-card"},[n("span",{staticClass:"icon-Icon-Info mr-2 font-weight-bold"}),e._v(" "),n("span",[e._v(" "+e._s(e.reservationError.error))])])]):e._e()],2)])}),[],!1,null,"fe5fa3c4",null);t.default=component.exports;installComponents(component,{InputCustom:n(181).default,SelectCustom:n(1185).default})},1161:function(e,t,n){"use strict";n.r(t);n(15),n(10),n(13),n(7),n(14);var o=n(1),r=n(3);function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function l(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var d={name:"PaymentDetailInfo",props:{isAuthened:{type:Boolean}},data:function(){return{agreeWithCondition:[{value:!0,text:""}],agreeStatus:[]}},computed:l(l(l({},Object(r.e)({reservationError:function(e){return e.booking.reservationError}})),Object(r.d)({paymentMethod:"paymentDetail/paymentMethodSelected"})),{},{getLang:function(){return{payQuestion:this.$t("payment_info.pay_question"),agree:this.$t("payment_info.agree"),bookingCondition:this.$t("payment_info.booking_condition"),termsAndPolicy:this.$t("payment_info.terms_and_policy")}}})},m=(n(994),n(5)),component=Object(m.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"payment-detail__info"},[e.paymentMethod?e._e():n("div",{staticClass:"payment-detail__info__title"},[n("h5",[e._v("\n      "+e._s(e.getLang.payQuestion)+"\n    ")])]),e._v(" "),n("PaymentMethod"),e._v(" "),e.reservationError&&"on_site"===e.paymentMethod?n("div",{staticClass:"reservation-error"},[n("span",{staticClass:"icon-Icon-Info mr-2 font-weight-bold"}),e._v(" "),n("span",[e._v(" "+e._s(e.reservationError.error))])]):e._e()],1)}),[],!1,null,"9a39a34c",null);t.default=component.exports;installComponents(component,{PaymentMethod:n(1178).default})},1178:function(e,t,n){"use strict";n.r(t);n(15),n(10),n(13),n(7),n(14);var o=n(1),r=n(3),c=n(479),l=n(17);function d(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function m(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?d(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):d(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var h={name:"PaymentMethod",components:{BFormRadio:c.a},data:function(){return{paymentMethod:"",payLater:{}}},computed:m(m({},Object(r.d)({paymentMethodFromStore:"paymentDetail/paymentMethod",paymentMethodList:"paymentDetail/paymentMethodList"})),{},{getLang:function(){return{payOnline:this.$t("payment_info.pay_online"),payOnlineText:this.$t("payment_info.pay_online_text"),addCredit:this.$t("payment_info.add_credit"),payLater:this.$t("payment_info.pay_later"),payLaterText:this.$t("payment_info.pay_later_text"),flexPlan:this.$t("payment_info.flex_plan")}}}),watch:{paymentMethod:function(e){this.changePaymentMethod(e),this.$store.commit("booking/".concat(l.BookingActionTypes.CREATE_RESERVATIONS_FAIL),null)}},created:function(){this.resetPaymentMethod()},mounted:function(){},methods:m(m({},Object(r.c)({changePaymentMethod:"paymentDetail/changePaymentMethod",resetPaymentMethod:"paymentDetail/resetPaymentMethod"})),{},{selectPaymentMethod:function(e){this.paymentMethod=e}})},v=(n(995),n(5)),component=Object(v.a)(h,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"payment-method"},[n("b-form-radio-group",{attrs:{id:"radio-slots",name:"radio-options-slots",stacked:""},model:{value:e.paymentMethod,callback:function(t){e.paymentMethod=t},expression:"paymentMethod"}},e._l(e.paymentMethodList,(function(t){return n("b-form-radio",{key:t.code,staticClass:"payment-method__item",class:{"pl-0":e.paymentMethod===t.code&&"on_site"!==e.paymentMethod,"hide-radio":e.paymentMethod===t.code&&"on_site"!==e.paymentMethod,"gray-bg":e.paymentMethod===t.code&&"on_site"===e.paymentMethod},attrs:{value:t.code,inline:"",button:"",plain:""}},["credit_card"===t.code?n("div",{staticClass:"payment-detail__info pay-online"},["credit_card"!==e.paymentMethod?n("div",{staticClass:"pay-online__section"},[n("div",{staticClass:"pay-online__section__text"},[n("h6",[e._v(e._s(e.$t("payment_info.pay_online")))]),e._v(" "),n("p",[e._v(e._s(t.name))])]),e._v(" "),n("button",{staticClass:"button m-btn m-btn__white",on:{click:function(n){return e.selectPaymentMethod(t.code)}}},[n("span",{staticClass:"icon-Icon-Credit-Card"}),e._v(" "),n("span",[e._v(e._s(e.getLang.addCredit))])])]):n("div",[n("PayOnlineBilling")],1)]):e._e(),e._v(" "),"on_site_credit_card_required"===t.code?n("div",{staticClass:"payment-detail__info pay-online"},["on_site_credit_card_required"!==e.paymentMethod?n("div",{staticClass:"pay-online__section"},[n("div",{staticClass:"pay-online__section__text"},[n("h6",[e._v(e._s(e.$t("payment_info.pay_online")))]),e._v(" "),n("p",[e._v(e._s(t.name))])]),e._v(" "),n("button",{staticClass:"button m-btn m-btn__white",on:{click:function(n){return e.selectPaymentMethod(t.code)}}},[n("span",{staticClass:"icon-Icon-Credit-Card"}),e._v(" "),n("span",[e._v(e._s(e.getLang.addCredit))])])]):n("div",[n("PayOnlineBilling")],1)]):e._e(),e._v(" "),"on_site"===t.code?n("div",{staticClass:"payment-detail__info pay-online"},[n("div",{staticClass:"pay-online__section"},[n("div",{staticClass:"pay-online__section__text"},[n("h6",[e._v(e._s(e.getLang.payLater))]),e._v(" "),n("p",[e._v(e._s(e.getLang.payLaterText))])]),e._v(" "),n("button",{staticClass:"button m-btn m-btn__blue",on:{click:function(n){return e.selectPaymentMethod(t.code)}}},[e._v("\n            "+e._s(e.getLang.flexPlan)+"\n          ")])])]):e._e()])})),1)],1)}),[],!1,null,"1f40a3f8",null);t.default=component.exports;installComponents(component,{PayOnlineBilling:n(1154).default})},1185:function(e,t,n){"use strict";n.r(t);var o={name:"SelectCustom",props:{defaultSelectedProps:{type:String},validations:{type:Object},labelText:{type:String,default:""},data:{type:Array,default:function(){return["A","B","C"]}}},data:function(){return{defaultSelected:"",selected:""}},methods:{$_changeOption:function(e){this.$emit("input",e.target.value)}}},r=(n(998),n(5)),component=Object(r.a)(o,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"app-select is-vertical",class:{"has-error":!!e.validations&&e.validations.$error}},[n("label",{staticClass:"is-bold"},[e._v(e._s(e.labelText))]),e._v(" "),n("select",{directives:[{name:"model",rawName:"v-model",value:e.selected,expression:"selected"}],on:{change:[function(t){var n=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){return"_value"in e?e._value:e.value}));e.selected=t.target.multiple?n:n[0]},e.$_changeOption]}},[e.defaultSelectedProps?n("option",{attrs:{disabled:"",value:""}},[e._v("\n      "+e._s(e.defaultSelectedProps)+"\n    ")]):e._e(),e._v(" "),e._l(e.data,(function(t,o){return n("option",{key:o,domProps:{value:t}},[e._v("\n      "+e._s(t)+"\n    ")])}))],2),e._v(" "),n("span",{staticClass:"icon-Icon-Required"}),e._v(" "),n("span",{staticClass:"app-select__icon"},[e._t("default")],2)])}),[],!1,null,"da60cee0",null);t.default=component.exports},1208:function(e,t,n){"use strict";n.r(t);n(15),n(10),n(13),n(7),n(14);var o=n(1),r=n(4),c=n(3);function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function d(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var m=r.default.extend({name:"Payment",data:function(){return{isAuthened:!1,isSelectedHotel:!0,currentStep:5,isShowBackToSearchResult:!0,pageLoaded:!1}},computed:d(d({},Object(c.e)({isUpdateBooking:function(e){return e.hotelDetail.isUpdateBooking}})),{},{getLang:function(){return{guest:this.$t("payment_info.guest"),payment:this.$t("payment_info.payment")}}}),mounted:function(){this.showCancelReservation(!1),this.pageLoaded=!0},methods:d({},Object(c.c)({showCancelReservation:"appAuthen/showCancelReservation"}))}),h=(n(993),n(5)),component=Object(h.a)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.pageLoaded?n("div",{staticClass:"payment"},[n("HotelNavigationBar",{attrs:{"is-selected-hotel":e.isSelectedHotel,"is-login":e.isAuthened,"current-step":e.currentStep,"is-show-back-to-search-result":e.isShowBackToSearchResult}}),e._v(" "),n("CompareBooking"),e._v(" "),n("section",{staticClass:"payment-detail",class:{"is-update-booking":e.isUpdateBooking}},[n("div",{staticClass:"container-page"},[n("h1",[e._v(e._s(e.getLang.payment))]),e._v(" "),n("div",{staticClass:"payment-detail-section"},[n("PaymentDetailInfo",{attrs:{"is-authened":e.isAuthened}}),e._v(" "),n("PaymentDetailPayment",{attrs:{"is-authened":e.isAuthened}})],1)])])],1):e._e()}),[],!1,null,"4b636876",null);t.default=component.exports;installComponents(component,{HotelNavigationBar:n(154).default,CompareBooking:n(411).default,PaymentDetailInfo:n(1161).default,PaymentDetailPayment:n(1153).default})},926:function(e,t,n){},927:function(e,t,n){},928:function(e,t,n){},929:function(e,t,n){},930:function(e,t,n){},931:function(e,t,n){},993:function(e,t,n){"use strict";var o=n(926);n.n(o).a},994:function(e,t,n){"use strict";var o=n(927);n.n(o).a},995:function(e,t,n){"use strict";var o=n(928);n.n(o).a},996:function(e,t,n){e.exports=function(e){function t(o){if(n[o])return n[o].exports;var a=n[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p=".",t(t.s=10)}([function(e,t){e.exports={"#":{pattern:/\d/},X:{pattern:/[0-9a-zA-Z]/},S:{pattern:/[a-zA-Z]/},A:{pattern:/[a-zA-Z]/,transform:function(e){return e.toLocaleUpperCase()}},a:{pattern:/[a-zA-Z]/,transform:function(e){return e.toLocaleLowerCase()}},"!":{escape:!0}}},function(e,t,n){"use strict";function o(e){var t=document.createEvent("Event");return t.initEvent(e,!0,!0),t}var a=n(2),r=n(0),i=n.n(r);t.a=function(e,t){var r=t.value;if((Array.isArray(r)||"string"==typeof r)&&(r={mask:r,tokens:i.a}),"INPUT"!==e.tagName.toLocaleUpperCase()){var u=e.getElementsByTagName("input");if(1!==u.length)throw new Error("v-mask directive requires 1 input, found "+u.length);e=u[0]}e.oninput=function(t){if(t.isTrusted){var i=e.selectionEnd,u=e.value[i-1];for(e.value=n.i(a.a)(e.value,r.mask,!0,r.tokens);i<e.value.length&&e.value.charAt(i-1)!==u;)i++;e===document.activeElement&&(e.setSelectionRange(i,i),setTimeout((function(){e.setSelectionRange(i,i)}),0)),e.dispatchEvent(o("input"))}};var s=n.i(a.a)(e.value,r.mask,!0,r.tokens);s!==e.value&&(e.value=s,e.dispatchEvent(o("input")))}},function(e,t,n){"use strict";var o=n(6),a=n(5);t.a=function(e,t){var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i=arguments[3];return Array.isArray(t)?n.i(a.a)(o.a,t,i)(e,t,r,i):n.i(o.a)(e,t,r,i)}},function(e,t,n){"use strict";function o(e){e.component(s.a.name,s.a),e.directive("mask",i.a)}Object.defineProperty(t,"__esModule",{value:!0});var a=n(0),r=n.n(a),i=n(1),u=n(7),s=n.n(u);n.d(t,"TheMask",(function(){return s.a})),n.d(t,"mask",(function(){return i.a})),n.d(t,"tokens",(function(){return r.a})),n.d(t,"version",(function(){return c}));var c="0.11.1";t.default=o,"undefined"!=typeof window&&window.Vue&&window.Vue.use(o)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),a=n(0),r=n.n(a),i=n(2);t.default={name:"TheMask",props:{value:[String,Number],mask:{type:[String,Array],required:!0},masked:{type:Boolean,default:!1},tokens:{type:Object,default:function(){return r.a}}},directives:{mask:o.a},data:function(){return{lastValue:null,display:this.value}},watch:{value:function(e){e!==this.lastValue&&(this.display=e)},masked:function(){this.refresh(this.display)}},computed:{config:function(){return{mask:this.mask,tokens:this.tokens,masked:this.masked}}},methods:{onInput:function(e){e.isTrusted||this.refresh(e.target.value)},refresh:function(e){this.display=e,(e=n.i(i.a)(e,this.mask,this.masked,this.tokens))!==this.lastValue&&(this.lastValue=e,this.$emit("input",e))}}}},function(e,t,n){"use strict";t.a=function(e,t,n){return t=t.sort((function(e,t){return e.length-t.length})),function(o,a){for(var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i=0;i<t.length;){var u=t[i];i++;var s=t[i];if(!(s&&e(o,s,!0,n).length>u.length))return e(o,u,r,n)}return""}}},function(e,t,n){"use strict";t.a=function(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=arguments[3];e=e||"",t=t||"";for(var a=0,r=0,i="";a<t.length&&r<e.length;){var s=o[u=t[a]],c=e[r];s&&!s.escape?(s.pattern.test(c)&&(i+=s.transform?s.transform(c):c,a++),r++):(s&&s.escape&&(u=t[++a]),n&&(i+=u),c===u&&r++,a++)}for(var l="";a<t.length&&n;){var u;if(o[u=t[a]]){l="";break}l+=u,a++}return i+l}},function(e,t,n){var o=n(8)(n(4),n(9),null,null);e.exports=o.exports},function(e,t){e.exports=function(e,t,n,o){var a,r=e=e||{},i=typeof e.default;"object"!==i&&"function"!==i||(a=e,r=e.default);var u="function"==typeof r?r.options:r;if(t&&(u.render=t.render,u.staticRenderFns=t.staticRenderFns),n&&(u._scopeId=n),o){var s=u.computed||(u.computed={});Object.keys(o).forEach((function(e){var t=o[e];s[e]=function(){return t}}))}return{esModule:a,exports:r,options:u}}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;return(e._self._c||t)("input",{directives:[{name:"mask",rawName:"v-mask",value:e.config,expression:"config"}],attrs:{type:"text"},domProps:{value:e.display},on:{input:e.onInput}})},staticRenderFns:[]}},function(e,t,n){e.exports=n(3)}])},997:function(e,t,n){"use strict";var o=n(929);n.n(o).a},998:function(e,t,n){"use strict";var o=n(930);n.n(o).a},999:function(e,t,n){"use strict";var o=n(931);n.n(o).a}}]);