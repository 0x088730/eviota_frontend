import request from 'superagent'

export const EviotaApi = ({ baseUrl, accessToken }) => ({
  postProfile: async (formData: any): Promise<any> =>
    (
      await request
        .post(`${baseUrl}/me/profile`)
        .set('mode', 'no-cors')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(formData)
    ).body.metadata,
})
