import * as Yup from 'yup'
import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import DeliveryProblem from '../models/DeliveryProblem'

import Mail from '../../lib/Mail'

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

  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.id)

    if (!problem) {
      return res.status(400).json({ error: 'Problema não encontrada' })
    }

    const delivery = await Delivery.findByPk(problem.delivery_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    })

    delivery.canceled_at = new Date()

    await delivery.save()

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Entregada cancelada',
      text: 'Um cancelamento pelo qual você é o entregador foi realizado',
    })

    return res.json(delivery)
  }
}

export default new ProblemInDelivery()
