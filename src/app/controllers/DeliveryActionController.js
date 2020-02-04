import { parseISO, startOfDay, endOfDay } from 'date-fns'
import * as Yup from 'yup'
import { Op } from 'sequelize'
import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import Recipient from '../models/Recipient'
import File from '../models/File'

class DeliveryActionController {
  async index(req, res) {
    /*
     * list with pagination
     */

    const { page } = req.query

    const deliveries = await Delivery.findAll({
      where: {
        canceled_at: null,
        end_date: null,
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

  async update(req, res) {
    /*
     * type validations
     */

    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signature_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    /*
     * Validate if delivery exists
     */

    const delivery = await Delivery.findByPk(req.params.iddl)

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' })
    }

    /*
     * Validate if deliveryman is the same deliveryman of delivery
     */

    const deliveryman = await Deliveryman.findByPk(req.params.iddm)

    if (!deliveryman) {
      return res.status(401).json({ error: 'Entregador não autorizado' })
    }

    /*
     * Get response body
     */

    const { start_date, end_date, signature_id } = req.body

    /*
     * Validate if start_hour is valid (8:00 - 18:00)
     */

    if (start_date) {
      const hourStart = parseISO(start_date).getHours()

      if (hourStart < 8 || hourStart > 17) {
        return res
          .status(400)
          .json({ error: 'Horário de retirada não permitido' })
      }
    }

    /*
     * Validate if file choosed exists
     */

    if (signature_id) {
      const signatureExists = await File.findByPk(signature_id)

      if (!signatureExists) {
        return res.status(400).json({ error: 'A imagem não existe' })
      }
    }

    /*
     * verify limit of withdraw (5)
     */

    if (start_date) {
      const parsedDate = parseISO(start_date)

      const deliveries = await Delivery.findAll({
        where: {
          start_date: {
            [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
          },
          deliveryman_id: req.params.iddm,
        },
      })

      if (deliveries.length > 5) {
        return res
          .status(401)
          .json({ error: 'O limite de retiradas diárias já foi alcançado' })
      }
    }

    /*
     * update
     */

    const { product, deliveryman_id, recipient_id } = await delivery.update({
      start_date,
      end_date,
      signature_id,
    })

    return res.json({
      deliveryman_id,
      recipient_id,
      start_date,
      end_date,
      product,
      signature_id,
    })
  }
}

export default new DeliveryActionController()
