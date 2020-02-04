import Delivery from '../models/Delivery'
import DeliveryProblem from '../models/DeliveryProblem'

class DeliveryWithProblem {
  async index(req, res) {
    /*
     * list with pagination
     */

    const { page } = req.query

    const deliveriesWithProblems = await DeliveryProblem.findAll({
      include: [{ model: Delivery, as: 'delivery', attributes: ['product'] }],
      limit: 20,
      offset: (page - 1) * 20,
    })

    return res.json(deliveriesWithProblems)
  }
}

export default new DeliveryWithProblem()
