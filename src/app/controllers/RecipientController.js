import * as Yup from 'yup'
import Recipient from '../models/Recipient'

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      neighborhood: Yup.string().required(),
      number: Yup.string().required(),
      cep: Yup.string().required(),
      city: Yup.string().required(),
      state: Yup.string().required(),
      complement: Yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' })
    }

    const {
      id,
      name,
      street,
      neighborhood,
      number,
      cep,
      city,
      state,
      complement,
    } = await Recipient.create(req.body)

    return res.json({
      id,
      name,
      street,
      neighborhood,
      number,
      cep,
      city,
      state,
      complement,
    })
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      neighborhood: Yup.string(),
      number: Yup.string(),
      cep: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      complement: Yup.string(),
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou' })
    }

    const recipient = await Recipient.findByPk(req.params.id)

    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado' })
    }

    const {
      name,
      street,
      neighborhood,
      number,
      cep,
      city,
      state,
      complement,
    } = await recipient.update(req.body)

    return res.json({
      name,
      street,
      neighborhood,
      number,
      cep,
      city,
      state,
      complement,
    })
  }
}

export default new RecipientController()
