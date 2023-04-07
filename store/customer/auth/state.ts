export default () => ({
  isFetching: false,
  status: '',
  data: {
    access_token: null,
    session_token: null,
  },
  mystaysToken: null,
  params: '',
  errorMessage: '',
  actionType: '',
  success: false,
  canLoadMore: false
})
