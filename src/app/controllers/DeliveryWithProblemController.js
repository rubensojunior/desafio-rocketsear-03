import { Op } from 'sequelize'
import Delivery from '../models/Delivery'
import DeliveryProblem from '../models/DeliveryProblem'
import File from '../models/File'
import Recipient from '../models/Recipient'
import Deliveryman from '../models/Deliveryman'

class DeliveryWithProblem {
  async index(req, res) {
    /*
     * list with pagination
     */

    const problems = await DeliveryProblem.findAll({
      attributes: ['delivery_id'],
    })

    const idsWithProblems = problems
      .map(p => p.delivery_id)
      .filter((value, index, self) => self.indexOf(value) === index)

    const { page } = req.query

    const deliveriesWithProblems = await Delivery.findAll({
      where: {
        id: {
          [Op.in]: idsWithProblems,
        },
      },
      attributes: ['id', 'product', 'start_date', 'end_date', 'canceled_at'],
      include: [
        { model: File, as: 'signature', attributes: ['name', 'path', 'url'] },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'neighborhood',
            'state',
            'city',
            'complement',
            'number',
            'cep',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
          ],
        },
      ],
      order: ['start_date'],
      limit: 20,
      offset: (page - 1) * 20,
    })

    return res.json(deliveriesWithProblems)
  }
}

export default new DeliveryWithProblem()
