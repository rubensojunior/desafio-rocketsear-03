import { Op } from 'sequelize'
import * as Yup from 'yup'
import Delivery from '../models/Delivery'
import DeliveryProblem from '../models/DeliveryProblem'
import File from '../models/File'
import Recipient from '../models/Recipient'
import Deliveryman from '../models/Deliveryman'

class ProblemInDelivery {
  async index(req, res) {
    /*
     * list with pagination
     */
    const deliveryId = req.params.id

    const delivery = await Delivery.findByPk(deliveryId)

    if (!delivery) {
      res.status(400).json({ error: 'Entrega não encontrada' })
    }

    const { page } = req.query

    const deliveriesWithProblems = await DeliveryProblem.findAll({
      where: {
        delivery_id: deliveryId,
      },
      attributes: ['id', 'description', 'delivery_id'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          attributes: ['product', 'start_date'],
        },
      ],
      limit: 20,
      offset: (page - 1) * 20,
    })

    return res.json(deliveriesWithProblems)
  }

  async store(req, res) {
    /*
     * type validations
     */
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    /*
     * Validate if delivery exists
     */

    const delivery_id = req.params.id

    const deliveryExists = await Delivery.findByPk(delivery_id)

    if (!deliveryExists) {
      return res.status(400).json({ error: 'Entrega não encontrada' })
    }

    /*
     * create
     */

    const { description } = req.body

    const { id } = await DeliveryProblem.create({
      description,
      delivery_id,
    })

    return res.json({ id, description, delivery_id })
  }
}

export default new ProblemInDelivery()
