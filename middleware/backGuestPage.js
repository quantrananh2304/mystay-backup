export default function({ $cookiz, redirect }) {
  if (!$cookiz.get('from_guest_page')) {
    redirect('/guest-detail')
  }

  $cookiz.remove('from_guest_page')
}
