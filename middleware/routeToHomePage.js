export default function({ $cookiz, redirect }) {
  if (
    $cookiz.get('tripla-client-session') &&
    $cookiz.get('mystays-dev-token')
  ) {
    redirect('/')
  }
}
