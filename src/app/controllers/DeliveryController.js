import * as Yup from 'yup'
import { parseISO } from 'date-fns'
import Delivery from '../models/Delivery'
import Deliveryman from '../models/Deliveryman'
import Recipient from '../models/Recipient'
import File from '../models/File'

class DeliveryController {
  async index(req, res) {
    /*
     * list with pagination
     */

    const { page } = req.query

    const deliveries = await Delivery.findAll({
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

  async store(req, res) {
    /*
     * type validations
     */
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    /*
     * Get response body
     */

    const { product, deliveryman_id, recipient_id } = req.body

    /*
     * Validate if deliveryman exists
     */

    const deliverymanExists = await Deliveryman.findByPk(deliveryman_id)

    if (!deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'O entregador selecionado não existe' })
    }

    /*
     * Validate if recipient exists
     */

    const recipientExists = await Recipient.findByPk(recipient_id)

    if (!recipientExists) {
      return res.status(400).json({ error: 'O destinatário não existe' })
    }

    /*
     * create
     */

    const { id } = await Delivery.create({
      product,
      deliveryman_id,
      recipient_id,
    })

    return res.json({ id, product, deliveryman_id, recipient_id })
  }

  async update(req, res) {
    /*
     * type validations
     */

    const schema = Yup.object().shape({
      product: Yup.string(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
      signature_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    /*
     * Validate if delivery exists
     */

    const delivery = await Delivery.findByPk(req.params.id)

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' })
    }

    /*
     * Get response body
     */

    const {
      deliveryman_id,
      recipient_id,
      start_date,
      end_date,
      signature_id,
    } = req.body

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
     * Validate if deliveryman choosed exists
     */

    if (deliveryman_id) {
      const deliverymanExists = await Deliveryman.findByPk(deliveryman_id)

      if (!deliverymanExists) {
        return res
          .status(400)
          .json({ error: 'O entregador selecionado não existe' })
      }
    }

    /*
     * Validate if recipient choosed exists
     */

    if (recipient_id) {
      const recipientExists = await Recipient.findByPk(recipient_id)

      if (!recipientExists) {
        return res.status(400).json({ error: 'O destinatário não existe' })
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
     * update
     */

    const { product } = await delivery.update(req.body)

    return res.json({
      deliveryman_id,
      recipient_id,
      start_date,
      end_date,
      product,
      signature_id,
    })
  }

  async delete(req, res) {
    /*
     * validate if delivyman exists
     */
    const delivery = await Delivery.findByPk(req.params.id)

    if (!delivery) {
      return res.status(400).json({ error: 'Entrega não encontrada' })
    }

    /*
     * delete
     */

    await delivery.destroy()

    return res.send()
  }
}

export default new DeliveryController()
