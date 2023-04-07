export default function({ store, redirect }) {
  const { isLogin } = store.state.users.data
  if (!isLogin) {
    redirect('/')
  }
}
