export default async function({ $api, $cookiz }) {
  const mystaysToken = $cookiz.get('mystaysToken')
  if (!mystaysToken) {
    try {
      const headers = {
        UserName: 'sitecore\\InternalApiUser',
        Password: 'InternalApiUser',
        Audience: 'https://phase2.booking.mystays.com'
      }
      const data = await $api.$get(
        '/api/core/CoreAuthentication/GenerateToken',
        {
          headers
        }
      )

      if (data) {
        $cookiz.set('mystaysToken', data.token, {
          path: '/',
          expires: new Date(data.expired)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
