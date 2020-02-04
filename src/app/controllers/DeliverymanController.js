import * as Yup from 'yup'

import Deliveryman from '../models/Deliveryman'
import File from '../models/File'

class DeliverymanController {
  async index(req, res) {
    /*
     * list with pagination
     */

    const { page } = req.query

    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
    })

    return res.json(deliverymans)
  }

  async store(req, res) {
    /*
     * type validations
     */
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

    /*
     * Validate if deliveryman exists
     */

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    })

    if (deliverymanExists) {
      return res
        .status(400)
        .json({ error: 'o entregador já existe na nossa base de dados' })
    }

    /*
     * create
     */

    const { id, name, email } = await Deliveryman.create(req.body)

    return res.json({ id, name, email })
  }

  async update(req, res) {
    /*
     * type validations
     */
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }

    const deliveryman = await Deliveryman.findByPk(req.params.id)

    /*
     * validate if deliveryman passed in params exists
     */

    if (!deliveryman) {
      res.status(400).json({ error: 'Entregador não encontrado' })
    }

    /*
     * validate if delivyman email already exists
     */

    const { email, avatar_id } = req.body

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({ where: { email } })

      if (deliverymanExists) {
        return res
          .status(400)
          .json({ error: 'Já existe um entregador com o e-mail fornecido' })
      }
    }

    /*
     * Validate if file choosed exists
     */

    if (avatar_id) {
      const signatureExists = await File.findByPk(avatar_id)

      if (!signatureExists) {
        return res.status(400).json({ error: 'A imagem não existe' })
      }
    }

    /*
     * Update
     */

    const { id, name } = await deliveryman.update(req.body)

    return res.json({ id, name, email })
  }

  async delete(req, res) {
    /*
     * validate if delivyman exists
     */
    const deliveryman = await Deliveryman.findByPk(req.params.id)

    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado' })
    }

    /*
     * delete
     */

    await deliveryman.destroy()

    return res.send()
  }
}

export default new DeliverymanController()
