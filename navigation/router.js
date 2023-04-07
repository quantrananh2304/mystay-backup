import HomePage from '@/pages/HomePage.vue'
import SearchHotelPage from '@/pages/SearchHotelPage.vue'
import HotelDetailPage from '@/pages/HotelDetailPage.vue'
import HotelReviewPage from '@/pages/HotelReviewPage.vue'
import GuestDetailPage from '@/pages/GuestDetailPage.vue'
import PaymentDetailPage from '@/pages/PaymentDetailPage.vue'
import ConfirmStayPage from '@/pages/ConfirmStayPage.vue'
import CancelReservationPage from '@/pages/CancelReservationPage.vue'
import MyProfilePage from '@/pages/MyProfilePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import ShowFullMapPage from '@/pages/ShowFullMapPage.vue'
import MemberConfirmation from '@/pages/MemberConfirmation.vue'
import Authentication from '@/pages/Authentication.vue'
import SomethingWrong from '@/pages/SomethingWrong.vue'

import MyBooking from '@/presentation/modules/MyProfile/MyBooking.vue'
import Rewards from '@/presentation/modules/MyProfile/Rewards.vue'
import MyProfile from '@/presentation/modules/MyProfile/MyProfile.vue'

export const routers = () => [
  {
    name: 'Home Page',
    path: '/',
    component: HomePage
  },
  {
    name: 'Hotels',
    path: '/hotels',
    component: SearchHotelPage
  },
  {
    name: 'HotelListingPage',
    path: '/hotels-list',
    component: SearchHotelPage
  },
  {
    name: 'HotelDetailPage',
    path: '/hotel/:hotelID',
    component: HotelDetailPage,
    meta: { disableScroll: true }
  },
  {
    name: 'HotelReviewPage',
    path: '/summary',
    component: HotelReviewPage
  },
  {
    name: 'GuestDetailPage',
    path: '/guest-detail',
    component: GuestDetailPage
  },
  {
    name: 'PaymentDetailPage',
    path: '/payment',
    component: PaymentDetailPage
  },
  {
    name: 'ConfirmBookingPage',
    path: '/confirm-booking/:reservationID',
    component: ConfirmStayPage
  },
  {
    name: 'UserConfirmBookingPage',
    path: '/profile/confirm-booking/:reservationID',
    component: ConfirmStayPage
  },
  {
    name: 'CancelBookingPage',
    path: '/cancel',
    component: CancelReservationPage
  },
  {
    name: 'MyProfilePage',
    path: '/my-profile',
    component: MyProfilePage,
    children: [
      {
        name: 'MyProfile',
        path: '/profile/my-profile',
        component: MyProfile
      },
      {
        name: 'MyBooking',
        path: '/profile/my-booking',
        component: MyBooking
      },
      {
        name: 'MyRewards',
        path: '/profile/my-rewards',
        component: Rewards
      }
    ]
  },
  {
    name: 'ChangePassword',
    path: '/change-password',
    component: HomePage
  },
  {
    name: 'FullMapPage',
    path: '/full-map/:hotelId',
    component: ShowFullMapPage
  },
  {
    name: 'MemberConfirmmationPage',
    path: '/member-confirmation',
    component: MemberConfirmation
  },
  {
    name: 'Authentication',
    path: '/authentication',
    component: Authentication
  },
  {
    name: 'Result',
    path: '/booking/result',
    component: HomePage
  },
  {
    name: 'SomethingWrongPage',
    path: '/something-wrong',
    component: SomethingWrong
  },
  {
    name: 'NotFoundPage',
    path: '*',
    component: NotFoundPage
  }
]
