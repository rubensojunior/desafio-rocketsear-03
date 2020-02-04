import { Op } from 'sequelize'
import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import Recipient from '../models/Recipient'
import File from '../models/File'

class DeliveredController {
  async index(req, res) {
    /*
     * list with pagination
     */

    const { page } = req.query

    const deliveries = await Delivery.findAll({
      where: {
        canceled_at: null,
        end_date: { [Op.not]: null },
        deliveryman_id: req.params.id,
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

    return res.json(deliveries)
  }
}

export default new DeliveredController()
