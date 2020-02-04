import * as Yup from 'yup'

import Deliveryman from '../models/Deliveryman'
import File from '../models/File'

class DeliverymanController {
  async index(req, res) {
    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    })

    return res.json(deliverymans)
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    })

    if (deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'o entregador já existe na nossa base de dados' })
    }

    const { id, name, email } = await Deliveryman.create(req.body)

    return res.json({ id, name, email })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    const { email } = req.body

    const deliveryman = await Deliveryman.findByPk(req.params.id)

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } })

      if (deliverymanExists) {
        return res
          .status(400)
          .json({ error: 'Já existe um entregador com o e-mail fornecido' })
      }
    }

    const { id, name } = await deliveryman.update(req.body)

    return res.json({ id, name, email })
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id)

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' })
    }

    await deliveryman.destroy()

    return res.send()
  }
}

export default new DeliverymanController()
