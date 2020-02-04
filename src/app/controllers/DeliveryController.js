import * as Yup from 'yup'
import Delivery from '../models/Delivery'

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    const { product, deliveryman_id, recipient_id } = req.body

    const delivery = await Delivery.create({
      product,
      deliveryman_id,
      recipient_id,
      start_date: new Date(),
    })

    return res.json(delivery)
  }
}

export default new DeliveryController()
